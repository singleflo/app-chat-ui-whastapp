import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import i18n from "../i18n";

describe("LanguageSwitcher", () => {
    beforeEach(async () => {
        await i18n.changeLanguage("en");
    });

    it("#switcher-changes-language", async () => {
        render(<LanguageSwitcher />);
        
        // Find the AR button
        const arButton = screen.getByText("العربية");
        fireEvent.click(arButton);
        
        expect(i18n.language).toBe("ar");
        expect(document.documentElement.dir).toBe("rtl");
    });
});
