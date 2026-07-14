import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

declare global {
    interface Window {
        __i18n?: typeof i18n;
    }
}

const modules = import.meta.glob<Record<string, unknown>>("./locales/*/*.json", { eager: true });

const resources: Record<string, { translation: Record<string, unknown> }> = {
    en: { translation: {} },
    it: { translation: {} },
    ar: { translation: {} },
};

for (const path in modules) {
    const match = path.match(/\.\/locales\/([^/]+)\/([^/]+)\.json$/);
    if (match) {
        const [, lang] = match;
        if (resources[lang]) {
            Object.assign(resources[lang].translation, modules[path].default || modules[path]);
        }
    }
}

void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        supportedLngs: ["en", "it", "ar"],
        interpolation: { escapeValue: false },
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
            lookupLocalStorage: "wa-lang",
        },
    });

function applyDirection(lng: string): void {
    document.documentElement.dir = i18n.dir(lng);
    document.documentElement.lang = lng;
}

applyDirection(i18n.resolvedLanguage ?? i18n.language);
i18n.on("languageChanged", (lng) => {
    applyDirection(lng);
});

if (import.meta.env.DEV) {
    window.__i18n = i18n;
}

export default i18n;
