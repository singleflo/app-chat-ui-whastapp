import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChatOverlays } from "./Overlays";
import { ChatDataProvider } from "@/data/chat-data";

const noop = () => {};

describe("ChatOverlays forward picker", () => {
    it("lists conversations from the store to forward to", () => {
        render(
            <ChatDataProvider>
                <ChatOverlays
                    state={{ type: "forward", messageId: "m1", excerpt: "test excerpt" }}
                    onClose={noop}
                    onConfirmDelete={noop}
                    onConfirmNewChat={noop}
                    onConfirmForward={noop}
                />
            </ChatDataProvider>,
        );

        expect(screen.getByText("Giulia Romano")).toBeInTheDocument();
    });
});
