import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ContextPanelShell } from "./ContextPanelShell";
import { ChatDataProvider } from "@/data/chat-data";

describe("ContextPanelShell", () => {
    it("renders the contact profile for the given conversation from the store", () => {
        render(
            <ChatDataProvider>
                <ContextPanelShell conversationId="c1" />
            </ChatDataProvider>,
        );

        expect(screen.getByText("Contesto cliente")).toBeInTheDocument();
        expect(screen.getByText("Giulia Romano")).toBeInTheDocument();
    });
});
