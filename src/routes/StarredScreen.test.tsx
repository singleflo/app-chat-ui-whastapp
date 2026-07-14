import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StarredScreen } from "./StarredScreen";
import { ChatDataProvider } from "@/data/chat-data";

describe("StarredScreen", () => {
    it("renders starred/demo messages resolved against the store", () => {
        render(
            <ChatDataProvider>
                <StarredScreen />
            </ChatDataProvider>,
        );

        expect(screen.getByText("Messaggi importanti")).toBeInTheDocument();
        expect(screen.getAllByText("Giulia Romano").length).toBeGreaterThan(0);
    });
});
