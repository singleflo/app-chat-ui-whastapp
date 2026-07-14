import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SearchScreen } from "./SearchScreen";
import { ChatDataProvider } from "@/data/chat-data";

describe("SearchScreen", () => {
    it("renders the search input and matches store data for the default query", () => {
        render(
            <ChatDataProvider>
                <SearchScreen />
            </ChatDataProvider>,
        );

        expect(screen.getByDisplayValue("ordine")).toBeInTheDocument();
        expect(screen.getAllByText("Giulia Romano").length).toBeGreaterThan(0);
    });
});
