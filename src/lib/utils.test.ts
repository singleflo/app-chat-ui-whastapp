import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { fmtTime, fmtRelativeDay, waitTimeLabel } from "./utils";
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

describe("waitTimeLabel", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date("2026-07-14T12:00:00Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("formats minutes under one hour", () => {
        expect(waitTimeLabel("2026-07-14T11:30:00Z")).toBe("30m");
    });

    it("formats hours under one day", () => {
        expect(waitTimeLabel("2026-07-14T07:00:00Z")).toBe("5h");
    });

    it("formats days locale-aware (g for it, d for en)", async () => {
        await i18n.changeLanguage("it");
        expect(waitTimeLabel("2026-07-11T12:00:00Z")).toBe("3g");

        await i18n.changeLanguage("en");
        expect(waitTimeLabel("2026-07-11T12:00:00Z")).toBe("3d");
    });

    it("returns empty string for invalid timestamps", () => {
        expect(waitTimeLabel("not-a-date")).toBe("");
    });
});
