import { beforeAll, describe, expect, it } from "vitest";
import i18n from "./i18n";
import enNav from "./locales/en/nav.json";
import itNav from "./locales/it/nav.json";
import arNav from "./locales/ar/nav.json";

describe("i18n foundation", () => {
    beforeAll(async () => {
        if (!i18n.isInitialized) {
            await new Promise<void>((resolve) => {
                i18n.on("initialized", () => {
                    resolve();
                });
            });
        }
    });

    it("#fallback-en resolves fallback to en and a nav key to the English value", async () => {
        const fallback = i18n.options.fallbackLng;
        const fallbackList = Array.isArray(fallback) ? fallback : [fallback];
        expect(fallbackList).toContain("en");

        await i18n.changeLanguage("en");
        expect(i18n.t("nav.index")).toBe(enNav.nav.index);
    });

    it("#dir-rtl-for-ar drives documentElement dir", async () => {
        expect(i18n.dir("ar")).toBe("rtl");
        expect(i18n.dir("en")).toBe("ltr");

        await i18n.changeLanguage("ar");
        expect(document.documentElement.dir).toBe("rtl");

        await i18n.changeLanguage("it");
        expect(document.documentElement.dir).toBe("ltr");
    });

    it("#parity-nav keeps identical nav keys across en/it/ar", () => {
        const enKeys = Object.keys(enNav.nav).sort();
        const itKeys = Object.keys(itNav.nav).sort();
        const arKeys = Object.keys(arNav.nav).sort();

        expect(itKeys).toEqual(enKeys);
        expect(arKeys).toEqual(enKeys);
    });
});
