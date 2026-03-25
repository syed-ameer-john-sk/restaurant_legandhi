// ================================
// i18n Logic — Enterprise Grade
// ================================
function applyTranslations(lang) {
  const t = translations[lang];
  if (!t) { console.warn('[i18n] Missing translations for lang:', lang); return; }

  // Translate all [data-i18n] elements
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined && t[key] !== '') {
      el.innerHTML = t[key];
    }
  });

  // Translate all placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (t[key]) el.setAttribute("placeholder", t[key]);
  });

  // All 16 languages use LTR layout
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", "ltr");

  // Persist across sessions
  localStorage.setItem("site_lang", lang);

  // Update currentLang display button text
  const currentLangEl = document.getElementById("currentLang");
  if (currentLangEl) currentLangEl.textContent = lang.toUpperCase();

  // Highlight active language option
  document.querySelectorAll("[data-lang]").forEach(btn => {
    btn.style.fontWeight = btn.dataset.lang === lang ? "700" : "400";
    btn.style.color = btn.dataset.lang === lang ? "var(--color-gold, #d4a843)" : "";
  });

  // Notify other scripts (e.g. opening hours banner)
  document.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
}

// ================================
// Initialise on DOMContentLoaded
// ================================
document.addEventListener("DOMContentLoaded", () => {
  // Use saved language, default to French
  const saved = localStorage.getItem("site_lang") || "fr";
  applyTranslations(saved);

  // Use event delegation on the document body so clicks fire
  // even if the dropdown is closing simultaneously
  document.body.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-lang]");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    const lang = btn.getAttribute("data-lang");
    if (lang) {
      applyTranslations(lang);
      // Close the dropdown
      document.querySelectorAll(".lang-dropdown").forEach(d => d.classList.remove("active"));
    }
  });
});
