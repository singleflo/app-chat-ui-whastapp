import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fmtTime, fmtRelativeDay } from "./utils";
import i18n from "../i18n";

describe("utils", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-07-14T12:00:00Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("fmtRelativeDay-locale", async () => {
        const yesterday = new Date("2026-07-13T12:00:00Z").getTime();
        
        await i18n.changeLanguage("it");
        expect(fmtRelativeDay(yesterday)).toBe("Ieri");
        
        await i18n.changeLanguage("en");
        expect(fmtRelativeDay(yesterday)).toBe("Yesterday");
    });

    it("fmtTime-locale", async () => {
        const time = new Date("2026-07-14T15:30:00Z").getTime();
        
        await i18n.changeLanguage("it");
        expect(fmtTime(time)).toBeTruthy();
        
        await i18n.changeLanguage("en");
        expect(fmtTime(time)).toBeTruthy();
    });
});
