function changeLanguage(lang) {
  // Actualizar botones de idioma
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    if (btn.dataset.lang === lang) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Actualizar elementos con data-i18n
  document.querySelectorAll("[data-i18n]").forEach((elem) => {
    const key = elem.dataset.i18n;
    if (translations[lang] && translations[lang][key]) {
      elem.innerHTML = translations[lang][key];
    }
  });

  // Actualizar placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((elem) => {
    const key = elem.dataset.i18nPlaceholder;
    if (translations[lang] && translations[lang][key]) {
      elem.placeholder = translations[lang][key];
    }
  });

  // Actualizar título de la página
  updatePageTitle(lang);

  // Actualizar meta tags SEO
  updateMetaTags(lang);

  // Guardar en localStorage
  localStorage.setItem("preferred-language", lang);

  // Disparar evento para otros scripts
  document.dispatchEvent(
    new CustomEvent("languageChanged", { detail: { language: lang } }),
  );
}

function updatePageTitle(lang) {
  const path = window.location.pathname;
  const filename = path.split("/").pop() || "index.html";
  let titleKey = "seo_title_index";

  if (filename === "about.html") {
    titleKey = "seo_title_about";
  } else if (filename === "contact.html") {
    titleKey = "seo_title_contact";
  }

  if (translations[lang] && translations[lang][titleKey]) {
    document.title = translations[lang][titleKey];
  }
}

function updateMetaTags(lang) {
  const path = window.location.pathname;
  const filename = path.split("/").pop() || "index.html";
  let titleKey = "seo_title_index";
  let descKey = "seo_desc_index";
  let keywordsKey = "seo_keywords_index";

  if (filename === "about.html") {
    titleKey = "seo_title_about";
    descKey = "seo_desc_about";
    keywordsKey = "seo_keywords_about";
  } else if (filename === "contact.html") {
    titleKey = "seo_title_contact";
    descKey = "seo_desc_contact";
    keywordsKey = "seo_keywords_contact";
  }

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && translations[lang] && translations[lang][descKey]) {
    metaDesc.setAttribute("content", translations[lang][descKey]);
  }

  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords && translations[lang] && translations[lang][keywordsKey]) {
    metaKeywords.setAttribute("content", translations[lang][keywordsKey]);
  }

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && translations[lang] && translations[lang][titleKey]) {
    ogTitle.setAttribute("content", translations[lang][titleKey]);
  }

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && translations[lang] && translations[lang][descKey]) {
    ogDesc.setAttribute("content", translations[lang][descKey]);
  }

  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle && translations[lang] && translations[lang][titleKey]) {
    twitterTitle.setAttribute("content", translations[lang][titleKey]);
  }

  const twitterDesc = document.querySelector(
    'meta[name="twitter:description"]',
  );
  if (twitterDesc && translations[lang] && translations[lang][descKey]) {
    twitterDesc.setAttribute("content", translations[lang][descKey]);
  }
}

function initLanguage() {
  const savedLanguage = localStorage.getItem("preferred-language");
  if (savedLanguage) {
    changeLanguage(savedLanguage);
  } else {
    const browserLang = navigator.language || navigator.userLanguage;
    const defaultLang = browserLang.startsWith("es") ? "es" : "en";
    changeLanguage(defaultLang);
  }
}

// Intersection Observer
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const elemClass = entry.target.dataset.animated;
      if (entry.isIntersecting) {
        entry.target.style.visibility = "visible";
        entry.target.classList.add(elemClass);
      } else {
        entry.target.style.visibility = "hidden";
        entry.target.classList.remove(elemClass);
      }
    });
  },
  { rootMargin: "0px", threshold: 0.3 },
);

const animatedElements = document.querySelectorAll(".animate__animated");
animatedElements.forEach((element) => observer.observe(element));

// Mobile menu
const mobileBtn = document.querySelector(".mobile_btn");
const linksMenu = document.querySelector(".links");

if (mobileBtn) {
  mobileBtn.addEventListener("click", () => {
    linksMenu.classList.toggle("active");
  });

  document.querySelectorAll(".links a").forEach((link) => {
    link.addEventListener("click", () => {
      linksMenu.classList.remove("active");
    });
  });
}

// Language buttons
document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const lang = e.target.dataset.lang;
    changeLanguage(lang);
  });
});

// Current year
const yearEl = document.getElementById("current-year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Initialize
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initLanguage);
} else {
  initLanguage();
}
