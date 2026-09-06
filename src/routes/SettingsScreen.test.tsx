import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, beforeEach } from "vitest";
import { SettingsScreen } from "./SettingsScreen";
import { getDesign, resetDesignStoreForTests } from "@/lib/design";

describe("SettingsScreen design switcher", () => {
    beforeEach(() => {
        localStorage.removeItem("wa-design");
        resetDesignStoreForTests();
        document.documentElement.removeAttribute("data-design");
    });

    it("renders the design row with the four languages", () => {
        render(<SettingsScreen />);

        expect(screen.getByText("Linguaggio design")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "WhatsApp" })).toHaveAttribute(
            "aria-pressed",
            "true",
        );
        expect(screen.getByRole("button", { name: "Linear" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Intercom" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Slack" })).toBeInTheDocument();
    });

    it("clicking a design applies data-design to <html> and persists", () => {
        render(<SettingsScreen />);

        fireEvent.click(screen.getByRole("button", { name: "Linear" }));

        expect(document.documentElement.getAttribute("data-design")).toBe("linear");
        expect(localStorage.getItem("wa-design")).toBe("linear");
        expect(getDesign()).toBe("linear");
        expect(screen.getByRole("button", { name: "Linear" })).toHaveAttribute(
            "aria-pressed",
            "true",
        );
    });
});
