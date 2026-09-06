import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChatDataProvider } from "@/data/chat-data";
import { AssignationScreen } from "./AssignationScreen";

function renderScreen() {
    return render(
        <ChatDataProvider>
            <AssignationScreen />
        </ChatDataProvider>,
    );
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
});
