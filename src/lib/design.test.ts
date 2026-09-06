import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import {
    DESIGN_IDS,
    getDesign,
    setDesign,
    subscribeDesign,
    useDesign,
    applyDesignAttribute,
    resetDesignStoreForTests,
} from "./design";

describe("design store", () => {
    beforeEach(() => {
        localStorage.removeItem("wa-design");
        resetDesignStoreForTests();
    });

    it("defaults to whatsapp when nothing is stored", () => {
        expect(getDesign()).toBe("whatsapp");
    });

    it("falls back to whatsapp when the stored value is invalid", () => {
        localStorage.setItem("wa-design", "darkmode");
        resetDesignStoreForTests();
        expect(getDesign()).toBe("whatsapp");
    });

    it("setDesign persists and notifies listeners", () => {
        const listener = vi.fn();
        const unsubscribe = subscribeDesign(listener);

        act(() => setDesign("linear"));

        expect(getDesign()).toBe("linear");
        expect(localStorage.getItem("wa-design")).toBe("linear");
        expect(listener).toHaveBeenCalledTimes(1);
        unsubscribe();
    });

    it("setDesign is a no-op for the current value", () => {
        const listener = vi.fn();
        const unsubscribe = subscribeDesign(listener);

        act(() => setDesign("whatsapp"));

        expect(listener).not.toHaveBeenCalled();
        unsubscribe();
    });

    it("applyDesignAttribute sets data-design on <html>", () => {
        applyDesignAttribute("slack");
        expect(document.documentElement.getAttribute("data-design")).toBe("slack");
    });

    it("useDesign returns the design and reacts to changes", () => {
        const { result } = renderHook(() => useDesign());
        expect(result.current[0]).toBe("whatsapp");

        act(() => result.current[1]("intercom"));

        expect(result.current[0]).toBe("intercom");
    });

    it("DESIGN_IDS covers the four languages", () => {
        expect(DESIGN_IDS).toEqual(["whatsapp", "linear", "intercom", "slack"]);
    });
});
