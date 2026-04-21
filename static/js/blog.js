const LANG_KEY = "myblog_lang_v1";

const blogList = document.getElementById("blogList");
const blogStatus = document.getElementById("blogStatus");

const i18n = {
  uz: {
    pageTitle: "Abdulazizov | Blog",
    navAbout: "Men haqimda",
    navProjects: "GitHub",
    navBlog: "Blog",
    navAdmin: "Admin",
    blogEyebrow: "Public Blog",
    blogHeroTitle: "Blog postlar",
    blogHeroLead: "Bu sahifada barcha foydalanuvchi sizning e'lon qilingan postlaringizni ko'radi.",
    postsTitle: "Barcha postlar",
    goAdminBtn: "Admin panel",
    loading: "Postlar yuklanmoqda...",
    loadError: "Postlarni yuklashda xatolik bo'ldi.",
    noPosts: "Hozircha post yo'q.",
    postedOn: "Yozilgan: {date}",
    downloadFile: "Faylni yuklab olish",
    footerText: "Barcha huquqlar himoyalangan.",
  },
  en: {
    pageTitle: "Abdulazizov | Blog",
    navAbout: "About",
    navProjects: "GitHub",
    navBlog: "Blog",
    navAdmin: "Admin",
    blogEyebrow: "Public Blog",
    blogHeroTitle: "Blog posts",
    blogHeroLead: "All visitors can read your published posts on this page.",
    postsTitle: "All posts",
    goAdminBtn: "Admin panel",
    loading: "Loading posts...",
    loadError: "Failed to load posts.",
    noPosts: "No posts yet.",
    postedOn: "Posted: {date}",
    downloadFile: "Download file",
    footerText: "All rights reserved.",
  },
  ru: {
    pageTitle: "Abdulazizov | Блог",
    navAbout: "Обо мне",
    navProjects: "GitHub",
    navBlog: "Блог",
    navAdmin: "Админ",
    blogEyebrow: "Public Blog",
    blogHeroTitle: "Посты блога",
    blogHeroLead: "На этой странице все посетители видят ваши опубликованные записи.",
    postsTitle: "Все посты",
    goAdminBtn: "Админ-панель",
    loading: "Загрузка постов...",
    loadError: "Ошибка загрузки постов.",
    noPosts: "Пока нет постов.",
    postedOn: "Опубликовано: {date}",
    downloadFile: "Скачать файл",
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

let cachedPosts = [];

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

  document.documentElement.lang = currentLang;
  document.title = t("pageTitle");

  document.querySelectorAll(".lang-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.lang === currentLang);
  });
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
    blogList.innerHTML = `<p class="status">${escapeHtml(t("noPosts"))}</p>`;
    return;
  }

  blogList.innerHTML = cachedPosts
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
        </article>
      `;
    })
    .join("");
}

async function loadPosts() {
  blogStatus.textContent = t("loading");

  try {
    const response = await fetch("/api/posts");
    if (!response.ok) {
      throw new Error("load failed");
    }

    cachedPosts = await response.json();
    blogStatus.textContent = "";
    renderPosts();
  } catch {
    cachedPosts = [];
    blogStatus.textContent = t("loadError");
    renderPosts();
  }
}

function setLanguage(lang) {
  if (!i18n[lang]) {
    return;
  }

  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);

  applyTranslations();
  renderPosts();
}

document.querySelectorAll(".lang-btn").forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
  });
});

applyTranslations();
loadPosts();
