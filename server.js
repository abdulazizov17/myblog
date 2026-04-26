const express = require("express");
const multer = require("multer");
const crypto = require("node:crypto");
const fs = require("node:fs");
const fsp = require("node:fs/promises");
const path = require("node:path");

require("dotenv").config();

const app = express();

const PORT = Number(process.env.PORT || 3000);
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "change-me-123";
const SESSION_SECRET = process.env.SESSION_SECRET || "change-session-secret";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24;

const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, "data");
const UPLOAD_DIR = path.join(ROOT_DIR, "uploads");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

const sessions = new Map();

function ensureStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  if (!fs.existsSync(POSTS_FILE)) {
    fs.writeFileSync(POSTS_FILE, "[]", "utf8");
  }
}

ensureStorage();

function parseCookies(rawCookie = "") {
  return rawCookie
    .split(";")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .reduce((acc, pair) => {
      const eqIndex = pair.indexOf("=");
      if (eqIndex === -1) {
        return acc;
      }

      const key = pair.slice(0, eqIndex);
      const value = decodeURIComponent(pair.slice(eqIndex + 1));
      acc[key] = value;
      return acc;
    }, {});
}

function timingSafeMatch(a = "", b = "") {
  const aBuf = Buffer.from(a, "utf8");
  const bBuf = Buffer.from(b, "utf8");
  if (aBuf.length !== bBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuf, bBuf);
}

function signToken(token) {
  return crypto.createHmac("sha256", SESSION_SECRET).update(token).digest("hex");
}

function createSession(username) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const signedToken = signToken(rawToken);

  sessions.set(signedToken, {
    username,
    expiresAt: Date.now() + SESSION_TTL_MS,
  });

  return rawToken;
}

function getSessionFromRequest(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  const rawToken = cookies.admin_session;

  if (!rawToken) {
    return null;
  }

  const signedToken = signToken(rawToken);
  const session = sessions.get(signedToken);

  if (!session) {
    return null;
  }

  if (session.expiresAt < Date.now()) {
    sessions.delete(signedToken);
    return null;
  }

  return { ...session, signedToken };
}

function setSessionCookie(res, rawToken) {
  res.setHeader(
    "Set-Cookie",
    `admin_session=${encodeURIComponent(rawToken)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${Math.floor(
      SESSION_TTL_MS / 1000
    )}`
  );
}

function clearSessionCookie(res) {
  res.setHeader(
    "Set-Cookie",
    "admin_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0"
  );
}

async function readPosts() {
  const raw = await fsp.readFile(POSTS_FILE, "utf8");
  const clean = raw.replace(/^\uFEFF/, "").trim();
  if (!clean) {
    return [];
  }

  const parsed = JSON.parse(clean);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed;
}

async function writePosts(posts) {
  await fsp.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), "utf8");
}

async function cleanupUploadedFiles(files = []) {
  await Promise.all(
    files.map(async (file) => {
      try {
        await fsp.unlink(file.path);
      } catch {
        // ignore cleanup failures
      }
    })
  );
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const safeOriginal = path
      .basename(file.originalname)
      .replace(/[^a-zA-Z0-9._-]/g, "_");

    const ext = path.extname(safeOriginal);
    const base = path.basename(safeOriginal, ext).slice(0, 64) || "file";

    cb(null, `${Date.now()}-${crypto.randomUUID()}-${base}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    files: 6,
    fileSize: 25 * 1024 * 1024,
  },
});

function requireAdmin(req, res, next) {
  const session = getSessionFromRequest(req);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.admin = session;
  return next();
}

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(UPLOAD_DIR));
app.use(express.static(ROOT_DIR));

app.get("/api/posts", async (_req, res) => {
  try {
    const posts = await readPosts();
    posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(posts);
  } catch {
    res.status(500).json({ message: "Could not read posts" });
  }
});

app.post("/api/admin/login", (req, res) => {
  const username = String(req.body.username || "").trim();
  const password = String(req.body.password || "");
  const normalizedInputUser = username.toLowerCase();
  const normalizedAdminUser = String(ADMIN_USERNAME || "").trim().toLowerCase();

  const ok =
    timingSafeMatch(normalizedInputUser, normalizedAdminUser) &&
    timingSafeMatch(password, ADMIN_PASSWORD);
  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = createSession(username);
  setSessionCookie(res, token);

  return res.json({ ok: true, username });
});

app.post("/api/admin/logout", (req, res) => {
  const session = getSessionFromRequest(req);
  if (session) {
    sessions.delete(session.signedToken);
  }

  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get("/api/admin/me", requireAdmin, (req, res) => {
  res.json({ ok: true, username: req.admin.username });
});

app.post("/api/admin/posts", requireAdmin, upload.array("attachments", 6), async (req, res) => {
  const files = req.files || [];

  try {
    const title = String(req.body.title || "").trim();
    const content = String(req.body.content || "").trim();

    if (!title) {
      await cleanupUploadedFiles(files);
      return res.status(400).json({ message: "Title is required" });
    }

    if (!content && !files.length) {
      await cleanupUploadedFiles(files);
      return res.status(400).json({ message: "Content or attachment is required" });
    }

    const attachments = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.originalname,
      mime: file.mimetype || "application/octet-stream",
      size: file.size,
      url: `/uploads/${file.filename}`,
    }));

    const posts = await readPosts();

    const newPost = {
      id: crypto.randomUUID(),
      title,
      content,
      createdAt: new Date().toISOString(),
      attachments,
    };

    posts.unshift(newPost);
    await writePosts(posts);

    return res.status(201).json(newPost);
  } catch {
    await cleanupUploadedFiles(files);
    return res.status(500).json({ message: "Could not save post" });
  }
});

app.delete("/api/admin/posts/:id", requireAdmin, async (req, res) => {
  const id = String(req.params.id || "");

  try {
    const posts = await readPosts();
    const index = posts.findIndex((post) => post.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "Post not found" });
    }

    const [removed] = posts.splice(index, 1);
    await writePosts(posts);

    const attachments = Array.isArray(removed.attachments) ? removed.attachments : [];
    await Promise.all(
      attachments.map(async (item) => {
        if (!item || typeof item.url !== "string") {
          return;
        }

        const filename = path.basename(item.url);
        const filePath = path.join(UPLOAD_DIR, filename);

        try {
          await fsp.unlink(filePath);
        } catch {
          // ignore delete failures
        }
      })
    );

    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ message: "Could not delete post" });
  }
});

app.get("/admin", (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, "admin.html"));
});

app.get("/blog", (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, "blog.html"));
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(ROOT_DIR, "index.html"));
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "File is too large (max 25MB)." });
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Too many files (max 6)." });
    }

    return res.status(400).json({ message: err.message });
  }

  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON body" });
  }

  return res.status(500).json({ message: "Unexpected server error" });
});

const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
  if (ADMIN_USERNAME === "admin" && ADMIN_PASSWORD === "change-me-123") {
    console.log("Default admin credentials detected. Set ADMIN_USERNAME and ADMIN_PASSWORD in environment.");
  }
});
