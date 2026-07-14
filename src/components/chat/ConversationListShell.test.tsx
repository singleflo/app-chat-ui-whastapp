import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConversationListShell } from "./ConversationListShell";
import { ChatDataProvider } from "@/data/chat-data";

describe("ConversationListShell", () => {
    it("renders account name and a fixture conversation from the store", () => {
        render(
            <ChatDataProvider>
                <ConversationListShell />
            </ChatDataProvider>,
        );

        expect(screen.getByText("Acme Srl")).toBeInTheDocument();
        expect(screen.getByText("Giulia Romano")).toBeInTheDocument();
    });
});
