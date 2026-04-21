const DEFAULT_GITHUB_USER = "abdulazizov17";
const MAX_REPOS = 9;
const LANG_KEY = "myblog_lang_v1";

const projectList = document.getElementById("projectList");
const projectStatus = document.getElementById("projectStatus");
const githubUserInput = document.getElementById("githubUser");
const loadProjectsBtn = document.getElementById("loadProjects");

const i18n = {
  uz: {
    pageTitle: "Abdulazizov | Portfolio",
    navAbout: "Men haqimda",
    navProjects: "GitHub",
    navBlog: "Blog",
    navAdmin: "Admin",
    heroEyebrow: "Portfolio + Blog",
    heroTitle: "Salom, men Abdulazizov Asilbek.",
    heroLead:
      "Men TATU talabasi va Backend dasturchiman. Bu saytda men haqimda qisqacha ma'lumot, GitHub loyihalarim va blog yozuvlarimni topasiz.",
    heroBtn: "Loyihalarni ko'rish",
    aboutTitle: "Men haqimda",
    aboutShortTitle: "Qisqacha",
    aboutShortText:
      "Men zamonaviy web texnologiyalar bilan ishlayman: HTML, CSS, JavaScript va Backend texnologiyalar. Maqsadim - foydali, chiroyli va tez ishlaydigan mahsulotlar yaratish.",
    aboutSkillsTitle: "Konikmalar",
    projectsTitle: "GitHub loyihalarim",
    projectsIntro: "Asosiy ishlangan loyihalarim va ularda qilgan ishlarim:",
    githubPlaceholder: "GitHub username",
    loadBtn: "Yuklash",
    projectsReady: "Loyihalar ko'rsatilishga tayyor.",
    loadingProjects: "Loyihalar yuklanmoqda...",
    noProjects: "Loyihalar topilmadi.",
    projectsFound: "{username} profilidan {count} ta loyiha topildi.",
    projectsError: "Yuklashda xatolik bo'ldi. Username ni tekshiring.",
    openRepo: "Repo ochish",
    techLabel: "Texnologiya",
    updatedLabel: "Yangilangan",
    starsLabel: "Yulduz",
    forksLabel: "Fork",
    unknownTech: "Noma'lum",
    genericProjectDescription:
      "{name} loyihasida {lang} texnologiyasi bilan amaliy funksiyalar ishlab chiqdim.",
    blogCardTitle: "Blog ommaviy sahifada ko'rinadi",
    blogCardText:
      "Hamma foydalanuvchi blog postlarni ko'radi. Yozish va boshqarish esa Admin panel orqali qilinadi.",
    blogCardBtn: "Blog sahifasiga o'tish",
    adminCardBtn: "Admin panelga kirish",
    footerText: "Barcha huquqlar himoyalangan.",
  },
  en: {
    pageTitle: "Abdulazizov | Portfolio",
    navAbout: "About",
    navProjects: "GitHub",
    navBlog: "Blog",
    navAdmin: "Admin",
    heroEyebrow: "Portfolio + Blog",
    heroTitle: "Hi, I am Abdulazizov Asilbek.",
    heroLead:
      "I am a TATU student and Backend developer. On this site you can find information about me, my GitHub projects, and my blog posts.",
    heroBtn: "View projects",
    aboutTitle: "About me",
    aboutShortTitle: "Summary",
    aboutShortText:
      "I work with modern web technologies: HTML, CSS, JavaScript, and Backend technologies. My goal is to build useful, clean, and fast products.",
    aboutSkillsTitle: "Skills",
    projectsTitle: "My GitHub projects",
    projectsIntro: "Main projects and what I implemented in them:",
    githubPlaceholder: "GitHub username",
    loadBtn: "Load",
    projectsReady: "Projects are ready to load.",
    loadingProjects: "Loading projects...",
    noProjects: "No projects found.",
    projectsFound: "Found {count} projects from {username}.",
    projectsError: "Failed to load projects. Check the username.",
    openRepo: "Open repo",
    techLabel: "Tech",
    updatedLabel: "Updated",
    starsLabel: "Stars",
    forksLabel: "Forks",
    unknownTech: "Unknown",
    genericProjectDescription:
      "In {name}, I implemented practical features using {lang}.",
    blogCardTitle: "Blog is public for all visitors",
    blogCardText:
      "Everyone can read blog posts. Creating and managing posts happens in the Admin panel.",
    blogCardBtn: "Open blog page",
    adminCardBtn: "Open admin panel",
    footerText: "All rights reserved.",
  },
  ru: {
    pageTitle: "Abdulazizov | Портфолио",
    navAbout: "Обо мне",
    navProjects: "GitHub",
    navBlog: "Блог",
    navAdmin: "Админ",
    heroEyebrow: "Портфолио + Блог",
    heroTitle: "Привет, я Abdulazizov Asilbek.",
    heroLead:
      "Я студент TATU и Backend разработчик. На этом сайте вы найдете информацию обо мне, мои проекты на GitHub и записи блога.",
    heroBtn: "Смотреть проекты",
    aboutTitle: "Обо мне",
    aboutShortTitle: "Кратко",
    aboutShortText:
      "Я работаю с современными веб-технологиями: HTML, CSS, JavaScript и Backend технологиями. Моя цель - создавать полезные, аккуратные и быстрые продукты.",
    aboutSkillsTitle: "Навыки",
    projectsTitle: "Мои проекты GitHub",
    projectsIntro: "Основные проекты и что именно я в них сделал:",
    githubPlaceholder: "GitHub username",
    loadBtn: "Загрузить",
    projectsReady: "Проекты готовы к загрузке.",
    loadingProjects: "Загрузка проектов...",
    noProjects: "Проекты не найдены.",
    projectsFound: "Найдено проектов: {count} (профиль {username}).",
    projectsError: "Ошибка загрузки. Проверьте username.",
    openRepo: "Открыть репозиторий",
    techLabel: "Технология",
    updatedLabel: "Обновлен",
    starsLabel: "Звезды",
    forksLabel: "Форки",
    unknownTech: "Неизвестно",
    genericProjectDescription:
      "В проекте {name} я реализовал практические функции на {lang}.",
    blogCardTitle: "Блог открыт для всех посетителей",
    blogCardText:
      "Все пользователи читают посты, а создание и управление записями происходит через Админ-панель.",
    blogCardBtn: "Открыть блог",
    adminCardBtn: "Открыть админ-панель",
    footerText: "Все права защищены.",
  },
};

const projectNarratives = {
  Telegram_bot: {
    uz: "Telegram bot yaratdim: foydalanuvchi buyruqlarini qayta ishlash, javob qaytarish va bot logikasini Python'da tashkil qildim.",
    en: "Built a Telegram bot in Python with command handling, message processing, and reusable bot logic.",
    ru: "Создал Telegram-бота на Python: обработка команд, входящих сообщений и организация логики бота.",
  },
  uploadfiles: {
    uz: "Fayl yuklash funksiyalarini backend tomonda ishlab chiqdim, so'rovlarni qabul qilish va fayllarni saqlash oqimini sozladim.",
    en: "Implemented backend file-upload flows, including request handling and storage workflow setup.",
    ru: "Реализовал backend-механику загрузки файлов: прием запросов и настройка процесса хранения.",
  },
  API_texnomart: {
    uz: "Texnomart API bilan integratsiya qildim: mahsulot ma'lumotlarini olish, qayta ishlash va interfeysga chiqarish ustida ishladim.",
    en: "Integrated Texnomart API: fetched product data, processed responses, and displayed results in the interface.",
    ru: "Сделал интеграцию с API Texnomart: получение данных о товарах, обработка ответов и вывод в интерфейс.",
  },
  API_Olcha: {
    uz: "Olcha API asosida mahsulotlar bilan ishlaydigan amaliy modul yozdim va frontend bilan bog'ladim.",
    en: "Built a practical module around the Olcha API and connected it to the frontend flow.",
    ru: "Разработал практический модуль на базе API Olcha и связал его с фронтенд-частью.",
  },
  customer_web_site: {
    uz: "Mijoz uchun web sahifa dizayni va frontend qismini tayyorladim, sahifalararo navigatsiya va ko'rinishni optimallashtirdim.",
    en: "Delivered customer-facing website UI, including frontend layout, navigation, and visual polish.",
    ru: "Подготовил клиентский веб-сайт: фронтенд-верстка, навигация между страницами и визуальная доработка.",
  },
  online_course_web_site: {
    uz: "Online kurslar uchun web loyiha ustida ishladim: kurslar bo'limi, sahifa tuzilmasi va asosiy foydalanuvchi oqimini qurdim.",
    en: "Worked on an online-course website: course sections, page structure, and core user flow.",
    ru: "Работал над сайтом онлайн-курсов: разделы курсов, структура страниц и основной пользовательский сценарий.",
  },
  django_magazin: {
    uz: "Django asosidagi magazin loyihasida katalog va frontend ko'rinishlarini ishlab chiqdim.",
    en: "Contributed to a Django shop project with catalog views and frontend presentation.",
    ru: "Развивал проект магазина на Django: каталог и фронтенд-представление.",
  },
  oniline_shop: {
    uz: "Online shop sahifalari ustida ishladim: mahsulot kartalari, sahifa dizayni va asosiy UI elementlarini tayyorladim.",
    en: "Implemented online-shop pages with product cards, page styling, and core UI components.",
    ru: "Реализовал страницы интернет-магазина: карточки товаров, оформление страниц и базовые UI-элементы.",
  },
  todo_project: {
    uz: "Todo ilovasida vazifalarni qo'shish, belgilash va boshqarish funksiyalarini amalga oshirdim.",
    en: "Implemented task creation, status updates, and task management features in a Todo app.",
    ru: "Реализовал в Todo-приложении добавление задач, изменение статуса и управление списком.",
  },
  abdulazizov17: {
    uz: "GitHub profil README va profil konfiguratsiyalarini sozlab, shaxsiy brandingni tartibga keltirdim.",
    en: "Configured my GitHub profile README and profile settings to organize personal branding.",
    ru: "Настроил README профиля GitHub и профильные конфигурации для личного брендинга.",
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

let cachedRepos = [];
let cachedUsername = DEFAULT_GITHUB_USER;
let projectsState = "idle";

document.getElementById("year").textContent = new Date().getFullYear();
githubUserInput.value = DEFAULT_GITHUB_USER;

function escapeHtml(value) {
  const str = String(value ?? "");
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function t(key, vars = {}) {
  const table = i18n[currentLang] || i18n.uz;
  let text = table[key] ?? i18n.uz[key] ?? key;

  Object.entries(vars).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });

  return text;
}

function formatDate(dateValue) {
  return new Intl.DateTimeFormat(localeByLang[currentLang], {
    year: "numeric",
    month: "short",
    day: "numeric",
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
}

function renderProjectStatus() {
  if (projectsState === "loading") {
    projectStatus.textContent = t("loadingProjects");
    return;
  }

  if (projectsState === "error") {
    projectStatus.textContent = t("projectsError");
    return;
  }

  if (projectsState === "empty") {
    projectStatus.textContent = t("noProjects");
    return;
  }

  if (projectsState === "success") {
    projectStatus.textContent = t("projectsFound", {
      count: cachedRepos.length,
      username: cachedUsername,
    });
    return;
  }

  projectStatus.textContent = t("projectsReady");
}

function getProjectNarrative(repo) {
  const mapped = projectNarratives[repo.name];
  if (mapped && mapped[currentLang]) {
    return mapped[currentLang];
  }

  if (repo.description) {
    return repo.description;
  }

  return t("genericProjectDescription", {
    name: repo.name,
    lang: repo.language || t("unknownTech"),
  });
}

function renderProjectCards() {
  if (!cachedRepos.length) {
    projectList.innerHTML = "";
    return;
  }

  projectList.innerHTML = cachedRepos
    .map((repo) => {
      const description = escapeHtml(getProjectNarrative(repo));
      const tech = escapeHtml(repo.language || t("unknownTech"));
      const updated = escapeHtml(formatDate(repo.updated_at));
      const stars = Number(repo.stargazers_count || 0);
      const forks = Number(repo.forks_count || 0);

      return `
        <article class="project-card">
          <h3>${escapeHtml(repo.name)}</h3>
          <p>${description}</p>
          <div class="project-meta">
            <span class="meta-tag">${escapeHtml(t("techLabel"))}: ${tech}</span>
            <span class="meta-tag">${escapeHtml(t("updatedLabel"))}: ${updated}</span>
            <span class="meta-tag">${escapeHtml(t("starsLabel"))}: ${stars}</span>
            <span class="meta-tag">${escapeHtml(t("forksLabel"))}: ${forks}</span>
          </div>
          <a href="${repo.html_url}" target="_blank" rel="noreferrer">${escapeHtml(t("openRepo"))}</a>
        </article>
      `;
    })
    .join("");
}

async function loadGitHubProjects() {
  const username = githubUserInput.value.trim() || DEFAULT_GITHUB_USER;
  cachedUsername = username;
  projectsState = "loading";
  renderProjectStatus();

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=${MAX_REPOS}`
    );

    if (!response.ok) {
      throw new Error("GitHub API error");
    }

    const repos = await response.json();
    cachedRepos = repos.filter((repo) => !repo.fork);

    if (!cachedRepos.length) {
      projectsState = "empty";
      renderProjectCards();
      renderProjectStatus();
      return;
    }

    projectsState = "success";
    renderProjectCards();
    renderProjectStatus();
  } catch (error) {
    cachedRepos = [];
    projectsState = "error";
    renderProjectCards();
    renderProjectStatus();
  }
}

function setLanguage(lang) {
  if (!i18n[lang]) {
    return;
  }

  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);

  applyTranslations();
  renderProjectStatus();
  renderProjectCards();
}

loadProjectsBtn.addEventListener("click", loadGitHubProjects);

document.querySelectorAll(".lang-btn").forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
  });
});

applyTranslations();
renderProjectStatus();
loadGitHubProjects();
