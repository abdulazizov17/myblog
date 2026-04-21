const LANG_KEY = "myblog_lang_v1";
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_ATTACHMENTS = 6;

const loginSection = document.getElementById("loginSection");
const adminSection = document.getElementById("adminSection");

const loginForm = document.getElementById("loginForm");
const loginStatus = document.getElementById("loginStatus");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const logoutBtn = document.getElementById("logoutBtn");
const adminWelcome = document.getElementById("adminWelcome");

const postForm = document.getElementById("postForm");
const postTitle = document.getElementById("postTitle");
const postContent = document.getElementById("postContent");
const postFiles = document.getElementById("postFiles");
const pendingPreview = document.getElementById("pendingPreview");
const postStatus = document.getElementById("postStatus");

const postsStatus = document.getElementById("postsStatus");
const adminPosts = document.getElementById("adminPosts");

const i18n = {
  uz: {
    pageTitle: "Abdulazizov | Admin",
    navAbout: "Men haqimda",
    navProjects: "GitHub",
    navBlog: "Blog",
    navAdmin: "Admin",
    adminEyebrow: "Admin Studio",
    adminHeroTitle: "Blog boshqaruvi",
    adminHeroLead:
      "Bu qism faqat siz uchun: kirish qiling, post yozing, media yuklang va boshqaring.",
    loginTitle: "Admin login",
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",
    loginBtn: "Kirish",
    loginError: "Login yoki parol noto'g'ri.",
    loginServerError: "Serverga ulanishda xatolik. `npm start` ishlayotganini tekshiring.",
    openViaServer: "Admin panelni `http://localhost:3000/admin` manzili orqali oching.",
    loginSuccess: "Muvaffaqiyatli kirdingiz.",
    logoutBtn: "Chiqish",
    editorTitle: "Yangi post yozish",
    postTitlePlaceholder: "Post sarlavhasi",
    postContentPlaceholder: "Post matni...",
    uploadLabel: "Rasm, video yoki fayl biriktirish",
    uploadHint: "Har bir fayl maksimal 25MB. Bir postga 6 ta fayl.",
    pendingCount: "Tanlangan fayllar: {count}",
    removeAttach: "Olib tashlash",
    publishBtn: "Postni e'lon qilish",
    publishError: "Post saqlashda xatolik bo'ldi.",
    publishSuccess: "Post muvaffaqiyatli e'lon qilindi.",
    emptyPost: "Sarlavha kiriting va matn yoki fayl qo'shing.",
    fileTooBig: "{name} juda katta (25MB dan oshmasin).",
    tooManyFiles: "Maksimal {count} ta fayl biriktirish mumkin.",
    myPostsTitle: "Mening postlarim",
    openPublicBtn: "Public blogni ochish",
    loadingPosts: "Postlar yuklanmoqda...",
    loadError: "Postlarni yuklashda xatolik bo'ldi.",
    noPosts: "Hozircha post yo'q.",
    deletePost: "O'chirish",
    deleteError: "Postni o'chirishda xatolik bo'ldi.",
    postedOn: "Yozilgan: {date}",
    downloadFile: "Faylni yuklab olish",
    welcome: "Xush kelibsiz, {username}",
    footerText: "Barcha huquqlar himoyalangan.",
  },
  en: {
    pageTitle: "Abdulazizov | Admin",
    navAbout: "About",
    navProjects: "GitHub",
    navBlog: "Blog",
    navAdmin: "Admin",
    adminEyebrow: "Admin Studio",
    adminHeroTitle: "Blog management",
    adminHeroLead:
      "This section is only for you: sign in, publish posts, upload media, and manage content.",
    loginTitle: "Admin login",
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",
    loginBtn: "Sign in",
    loginError: "Invalid username or password.",
    loginServerError: "Server connection failed. Make sure `npm start` is running.",
    openViaServer: "Open admin using `http://localhost:3000/admin`.",
    loginSuccess: "Signed in successfully.",
    logoutBtn: "Logout",
    editorTitle: "Create new post",
    postTitlePlaceholder: "Post title",
    postContentPlaceholder: "Post content...",
    uploadLabel: "Attach image, video, or file",
    uploadHint: "Each file up to 25MB. Up to 6 files per post.",
    pendingCount: "Selected files: {count}",
    removeAttach: "Remove",
    publishBtn: "Publish post",
    publishError: "Failed to save post.",
    publishSuccess: "Post published successfully.",
    emptyPost: "Enter title and add text or files.",
    fileTooBig: "{name} is too large (max 25MB).",
    tooManyFiles: "You can attach up to {count} files.",
    myPostsTitle: "My posts",
    openPublicBtn: "Open public blog",
    loadingPosts: "Loading posts...",
    loadError: "Failed to load posts.",
    noPosts: "No posts yet.",
    deletePost: "Delete",
    deleteError: "Failed to delete post.",
    postedOn: "Posted: {date}",
    downloadFile: "Download file",
    welcome: "Welcome, {username}",
    footerText: "All rights reserved.",
  },
  ru: {
    pageTitle: "Abdulazizov | Admin",
    navAbout: "Обо мне",
    navProjects: "GitHub",
    navBlog: "Блог",
    navAdmin: "Админ",
    adminEyebrow: "Admin Studio",
    adminHeroTitle: "Управление блогом",
    adminHeroLead:
      "Этот раздел только для вас: войдите, публикуйте посты, загружайте медиа и управляйте контентом.",
    loginTitle: "Вход в админ",
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",
    loginBtn: "Войти",
    loginError: "Неверный логин или пароль.",
    loginServerError: "Ошибка подключения к серверу. Убедитесь, что запущен `npm start`.",
    openViaServer: "Открывайте админку через `http://localhost:3000/admin`.",
    loginSuccess: "Успешный вход.",
    logoutBtn: "Выйти",
    editorTitle: "Новый пост",
    postTitlePlaceholder: "Заголовок",
    postContentPlaceholder: "Текст поста...",
    uploadLabel: "Прикрепить изображение, видео или файл",
    uploadHint: "Каждый файл до 25MB. До 6 файлов на пост.",
    pendingCount: "Выбрано файлов: {count}",
    removeAttach: "Убрать",
    publishBtn: "Опубликовать",
    publishError: "Ошибка сохранения поста.",
    publishSuccess: "Пост успешно опубликован.",
    emptyPost: "Введите заголовок и добавьте текст или файлы.",
    fileTooBig: "{name} слишком большой (макс 25MB).",
    tooManyFiles: "Можно прикрепить максимум {count} файлов.",
    myPostsTitle: "Мои посты",
    openPublicBtn: "Открыть публичный блог",
    loadingPosts: "Загрузка постов...",
    loadError: "Ошибка загрузки постов.",
    noPosts: "Пока нет постов.",
    deletePost: "Удалить",
    deleteError: "Не удалось удалить пост.",
    postedOn: "Опубликовано: {date}",
    downloadFile: "Скачать файл",
    welcome: "Добро пожаловать, {username}",
    footerText: "Все права защищены.",
  },
};

const localeByLang = {
  uz: "uz-UZ",
  en: "en-US",
  ru: "ru-RU",
};

let currentLang = localStorage.getItem(LANG_KEY);
if (!i18n[currentLang]) {
  currentLang = "uz";
}

let pendingFiles = [];
let cachedPosts = [];
let adminUser = "";

document.getElementById("year").textContent = new Date().getFullYear();

function t(key, vars = {}) {
  const table = i18n[currentLang] || i18n.uz;
  let text = table[key] ?? i18n.uz[key] ?? key;

  Object.entries(vars).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });

  return text;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatDateTime(dateValue) {
  return new Intl.DateTimeFormat(localeByLang[currentLang], {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = t(element.dataset.i18nPlaceholder);
  });

  document.documentElement.lang = currentLang;
  document.title = t("pageTitle");

  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === currentLang);
  });

  if (adminUser) {
    adminWelcome.textContent = t("welcome", { username: adminUser });
  }
}

function showLogin() {
  loginSection.classList.remove("hidden");
  adminSection.classList.add("hidden");
}

function showAdmin() {
  loginSection.classList.add("hidden");
  adminSection.classList.remove("hidden");
}

function setLoginStatus(message, isError = false) {
  loginStatus.textContent = message;
  loginStatus.style.color = isError ? "#b91c1c" : "var(--muted)";
}

function setPostStatus(message, isError = false) {
  postStatus.textContent = message;
  postStatus.style.color = isError ? "#b91c1c" : "var(--muted)";
}

function setPostsStatus(message, isError = false) {
  postsStatus.textContent = message;
  postsStatus.style.color = isError ? "#b91c1c" : "var(--muted)";
}

function renderPendingFiles() {
  if (!pendingFiles.length) {
    pendingPreview.innerHTML = "";
    return;
  }

  pendingPreview.innerHTML = `
    <p class="status">${escapeHtml(t("pendingCount", { count: pendingFiles.length }))}</p>
    <div class="pending-list">
      ${pendingFiles
        .map(
          (file, index) => `
            <div class="pending-item">
              <div class="pending-main">
                <span class="pending-file">FILE</span>
                <span>${escapeHtml(file.name)}</span>
              </div>
              <button type="button" data-remove-index="${index}">${escapeHtml(t("removeAttach"))}</button>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderAttachmentContent(attachment) {
  if (!attachment || !attachment.url) {
    return "";
  }

  const safeName = escapeHtml(attachment.name || "file");

  if ((attachment.mime || "").startsWith("image/")) {
    return `<img src="${attachment.url}" alt="${safeName}" class="blog-image" />`;
  }

  if ((attachment.mime || "").startsWith("video/")) {
    return `<video class="blog-video" controls src="${attachment.url}"></video>`;
  }

  return `
    <a class="file-link" href="${attachment.url}" download="${safeName}">
      ${escapeHtml(t("downloadFile"))}: ${safeName}
    </a>
  `;
}

function renderPosts() {
  if (!cachedPosts.length) {
    adminPosts.innerHTML = `<p class="status">${escapeHtml(t("noPosts"))}</p>`;
    return;
  }

  adminPosts.innerHTML = cachedPosts
    .map((post) => {
      const attachments = Array.isArray(post.attachments) ? post.attachments : [];

      return `
        <article class="blog-post">
          <h3>${escapeHtml(post.title)}</h3>
          <p class="meta">${escapeHtml(
            t("postedOn", {
              date: formatDateTime(post.createdAt),
            })
          )}</p>
          ${post.content ? `<p>${escapeHtml(post.content)}</p>` : ""}
          ${
            attachments.length
              ? `<div class="post-attachments">${attachments
                  .map((item) => `<div class="post-attachment">${renderAttachmentContent(item)}</div>`)
                  .join("")}</div>`
              : ""
          }
          <button data-id="${post.id}">${escapeHtml(t("deletePost"))}</button>
        </article>
      `;
    })
    .join("");
}

async function fetchPosts() {
  setPostsStatus(t("loadingPosts"));

  try {
    const response = await fetch("/api/posts", { credentials: "same-origin" });
    if (!response.ok) {
      throw new Error("load_failed");
    }

    cachedPosts = await response.json();
    setPostsStatus("");
    renderPosts();
  } catch {
    cachedPosts = [];
    setPostsStatus(t("loadError"), true);
    renderPosts();
  }
}

async function checkAuth() {
  try {
    const response = await fetch("/api/admin/me", { credentials: "same-origin" });
    if (!response.ok) {
      showLogin();
      return;
    }

    const data = await response.json();
    adminUser = data.username || "admin";
    adminWelcome.textContent = t("welcome", { username: adminUser });
    showAdmin();
    fetchPosts();
  } catch {
    showLogin();
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  try {
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        setLoginStatus(t("loginError"), true);
      } else {
        setLoginStatus(t("loginServerError"), true);
      }
      return;
    }

    const data = await response.json();
    adminUser = data.username || username;
    setLoginStatus(t("loginSuccess"));
    adminWelcome.textContent = t("welcome", { username: adminUser });
    showAdmin();
    fetchPosts();
  } catch {
    setLoginStatus(t("loginServerError"), true);
  }
});

logoutBtn.addEventListener("click", async () => {
  try {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "same-origin",
    });
  } catch {
    // no-op
  }

  adminUser = "";
  showLogin();
  postForm.reset();
  pendingFiles = [];
  renderPendingFiles();
  adminPosts.innerHTML = "";
});

postFiles.addEventListener("change", () => {
  const files = Array.from(postFiles.files || []);

  if (!files.length) {
    return;
  }

  if (pendingFiles.length + files.length > MAX_ATTACHMENTS) {
    setPostStatus(t("tooManyFiles", { count: MAX_ATTACHMENTS }), true);
    postFiles.value = "";
    return;
  }

  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      setPostStatus(t("fileTooBig", { name: file.name }), true);
      continue;
    }

    pendingFiles.push(file);
  }

  postFiles.value = "";
  setPostStatus("");
  renderPendingFiles();
});

pendingPreview.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const index = Number(target.dataset.removeIndex);
  if (Number.isNaN(index)) {
    return;
  }

  pendingFiles.splice(index, 1);
  renderPendingFiles();
});

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = postTitle.value.trim();
  const content = postContent.value.trim();

  if (!title || (!content && !pendingFiles.length)) {
    setPostStatus(t("emptyPost"), true);
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);

  pendingFiles.forEach((file) => {
    formData.append("attachments", file);
  });

  try {
    const response = await fetch("/api/admin/posts", {
      method: "POST",
      credentials: "same-origin",
      body: formData,
    });

    if (!response.ok) {
      setPostStatus(t("publishError"), true);
      return;
    }

    postForm.reset();
    pendingFiles = [];
    renderPendingFiles();
    setPostStatus(t("publishSuccess"));
    fetchPosts();
  } catch {
    setPostStatus(t("publishError"), true);
  }
});

adminPosts.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const id = target.dataset.id;
  if (!id) {
    return;
  }

  try {
    const response = await fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
      credentials: "same-origin",
    });

    if (!response.ok) {
      setPostsStatus(t("deleteError"), true);
      return;
    }

    fetchPosts();
  } catch {
    setPostsStatus(t("deleteError"), true);
  }
});

function setLanguage(lang) {
  if (!i18n[lang]) {
    return;
  }

  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);

  applyTranslations();
  renderPendingFiles();
  renderPosts();
}

document.querySelectorAll(".lang-btn").forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
  });
});

applyTranslations();
showLogin();
if (window.location.protocol === "file:") {
  setLoginStatus(t("openViaServer"), true);
}
checkAuth();
