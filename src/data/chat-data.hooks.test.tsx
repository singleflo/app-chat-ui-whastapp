import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChatDataProvider, useChatActions, useConversations, useMessages } from "@/data/chat-data";
import { dataset } from "@/data/dataset";
import { isMessage } from "@/types/chat";
import type { ChatEntry } from "@/types/chat";

const OPTIMISTIC_TEXT = "hello connector seam";

function firstFixtureConversation() {
    const first = dataset.conversations[0];
    if (first === undefined) {
        throw new Error("Fixture must contain at least one conversation");
    }

    return first;
}

function ConversationsConsumer() {
    const conversations = useConversations();
    return <div>{conversations.items[0]?.name}</div>;
}

function isPendingText(entry: ChatEntry): boolean {
    return (
        isMessage(entry) &&
        entry.direction === "out" &&
        entry.ack === "pending" &&
        entry.content.kind === "text" &&
        entry.content.body === OPTIMISTIC_TEXT
    );
}

function SendTextConsumer({ convId }: { readonly convId: string }) {
    const messages = useMessages(convId);
    const actions = useChatActions(convId);
    const visible = messages.items.some(isPendingText);

    return (
        <div>
            <button type="button" onClick={() => actions.sendText(OPTIMISTIC_TEXT)}>
                send
            </button>
            <div data-testid="optimistic-status">{visible ? "pending-visible" : "pending-missing"}</div>
        </div>
    );
}

describe("chat data hooks", () => {
    it("#provider-smoke", () => {
        const first = firstFixtureConversation();

        render(
            <ChatDataProvider>
                <ConversationsConsumer />
            </ChatDataProvider>,
        );

        expect(screen.getByText(first.name)).toBeInTheDocument();
    });

    it("#sendtext-optimistic", () => {
        const first = firstFixtureConversation();

        render(
            <ChatDataProvider>
                <SendTextConsumer convId={first.id} />
            </ChatDataProvider>,
        );

        expect(screen.getByTestId("optimistic-status")).toHaveTextContent("pending-missing");

        fireEvent.click(screen.getByRole("button", { name: "send" }));

        expect(screen.getByTestId("optimistic-status")).toHaveTextContent("pending-visible");
    });
});
