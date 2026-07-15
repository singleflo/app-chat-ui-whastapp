import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import i18n from "../i18n";

describe("LanguageSwitcher", () => {
    beforeEach(async () => {
        await i18n.changeLanguage("en");
    });

    it("#switcher-opens-then-selects", async () => {
        render(<LanguageSwitcher />);

        // Menu closed initially: options are not rendered.
        expect(screen.queryByText("العربية")).not.toBeInTheDocument();

        // Open the dropdown, then select Arabic.
        fireEvent.click(screen.getByRole("button", { expanded: false }));
        fireEvent.click(screen.getByText("العربية"));

        expect(i18n.language).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");

        // Menu closes after selection (no dangling options).
        expect(screen.queryByText("العربية")).not.toBeInTheDocument();
    });

    it("#switcher-closes-on-outside-click", () => {
        render(<LanguageSwitcher />);

        fireEvent.click(screen.getByRole("button", { expanded: false }));
        expect(screen.getByText("Italiano")).toBeInTheDocument();

        fireEvent.mouseDown(document.body);
        expect(screen.queryByText("Italiano")).not.toBeInTheDocument();
    });
});
