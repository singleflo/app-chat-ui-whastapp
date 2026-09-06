import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import { Home } from "./Home";

function renderHome() {
    return render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>,
    );
}

describe("Home", () => {
    beforeEach(() => {
        localStorage.removeItem("wa-design");
        document.documentElement.setAttribute("data-design", "whatsapp");
    });

    it("lists the assignation surface card among the entry links", () => {
        renderHome();

        const link = screen.getByRole("link", { name: /Assegnazione · team inbox/ });
        expect(link).toHaveAttribute("href", "/assignation");
    });

    it("renders the four design language switches", () => {
        renderHome();

        for (const name of ["WhatsApp", "Linear", "Intercom", "Slack"]) {
            expect(screen.getByRole("button", { name: new RegExp(name) })).toBeInTheDocument();
        }
    });

    it("clicking a design applies data-design on <html>", () => {
        renderHome();

        fireEvent.click(screen.getByRole("button", { name: /Linear/ }));

        expect(document.documentElement.getAttribute("data-design")).toBe("linear");
        expect(localStorage.getItem("wa-design")).toBe("linear");
    });
});
