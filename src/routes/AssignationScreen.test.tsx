import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ChatDataProvider } from "@/data/chat-data";
import { AssignationScreen } from "./AssignationScreen";

function renderScreen() {
    return render(
        <MemoryRouter>
            <ChatDataProvider>
                <AssignationScreen />
            </ChatDataProvider>
        </MemoryRouter>,
    );
}

function openCardMenu(cardTitle: string) {
    const card = screen.getByText(cardTitle).closest("[data-chat-card]") as HTMLElement;
    const trigger = within(card).getByRole("button", { name: "Menu conversazione" });
    // Radix DropdownMenu opens on pointerdown (button 0, no ctrl).
    fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false });
}

describe("AssignationScreen", () => {
    it("renders title, panel counters and view toggle", () => {
        renderScreen();

        expect(screen.getByText("Assegnazione chat")).toBeInTheDocument();
        expect(screen.getByText("Utenti (3)")).toBeInTheDocument();
        expect(screen.getByText("Chat non assegnate (3)")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Kanban" })).toHaveAttribute("aria-pressed", "true");
    });

    it("lists fixture users and unassigned chats in the kanban panels", () => {
        renderScreen();

        expect(screen.getByText("Laura Bianchi")).toBeInTheDocument();
        expect(screen.getByText("Ufficio Commerciali")).toBeInTheDocument();
    });

    it("persists the selected view mode", () => {
        localStorage.removeItem("wa-assignation-view");
        renderScreen();

        fireEvent.click(screen.getByRole("button", { name: "Lista" }));

        expect(localStorage.getItem("wa-assignation-view")).toBe("list");
        expect(screen.getByText("Nessuna conversazione con i filtri attuali")).toBeInTheDocument();

        localStorage.removeItem("wa-assignation-view");
    });

    it("assign dialog flow moves a chat to the selected user", () => {
        renderScreen();

        openCardMenu("Ufficio Commerciali");
        fireEvent.click(screen.getByRole("menuitem", { name: "Assegna a…" }));
        expect(screen.getByRole("dialog")).toBeInTheDocument();

        fireEvent.click(screen.getByRole("radio", { name: /Sara Verdi/ }));
        fireEvent.click(screen.getByRole("button", { name: "Assegna" }));

        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        expect(screen.queryByText("Ufficio Commerciali")).not.toBeInTheDocument();
    });

    it("close action removes a chat from the unassigned panel", () => {
        renderScreen();

        openCardMenu("Promo mailing · otp-out test");
        fireEvent.click(screen.getByRole("menuitem", { name: "Chiudi" }));

        expect(screen.queryByText("Promo mailing · otp-out test")).not.toBeInTheDocument();
    });

    it("expanding a user card shows their assigned conversations", () => {
        renderScreen();
        expect(screen.queryByText("Lead #4821 · Tiziana")).not.toBeInTheDocument();

        const lauraCard = screen.getByText("Laura Bianchi").closest("[data-user-card]") as HTMLElement;
        fireEvent.click(within(lauraCard).getByRole("button", { name: "2 conversazioni" }));

        expect(screen.getByText("Lead #4821 · Tiziana")).toBeInTheDocument();
    });

    it("drop on a user card assigns the dragged chat", () => {
        renderScreen();

        const card = screen.getByText("Ufficio Commerciali").closest("[data-chat-card]") as HTMLElement;
        fireEvent.dragStart(card);
        const userCard = screen.getByText("Marco Rossi").closest("[data-user-card]") as HTMLElement;
        fireEvent.drop(userCard);

        expect(screen.queryByText("Ufficio Commerciali")).not.toBeInTheDocument();
    });
});
