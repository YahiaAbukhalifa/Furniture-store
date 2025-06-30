import translations from "./translations.js";

const languageSelector = document.querySelector("select");

languageSelector.addEventListener("change", (event) => {
  const selectedLanguage = event.target.value;
  setLanguage(selectedLanguage);
  localStorage.setItem("lang", selectedLanguage);
});

document.addEventListener("DOMContentLoaded", () => {
  const storedLanguage = localStorage.getItem("lang") || "en";
  setLanguage(storedLanguage);
  languageSelector.value = storedLanguage;
});

const setLanguage = (language) => {
  const elements = document.querySelectorAll("[data-i18n]");
  elements.forEach((element) => {
    const translationKey = element.getAttribute("data-i18n");
    const translation = translations[language][translationKey];

    if (translation) {
      if (element.tagName.toLowerCase() === "input") {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    } else {
      console.error(`Missing translation for ${translationKey} in ${language}`);
    }
  });

  if (language === "ar") {
    document.body.classList.add("ar");
    document.dir = "rtl";
  } else {
    document.body.classList.remove("ar");
    document.dir = "ltr";
  }
};
