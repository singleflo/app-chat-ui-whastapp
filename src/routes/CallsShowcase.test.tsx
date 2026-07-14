import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CallsShowcase } from "./CallsShowcase";
import { ChatDataProvider } from "@/data/chat-data";

describe("CallsShowcase", () => {
    it("renders the first store conversation in the call banner", () => {
        render(
            <ChatDataProvider>
                <CallsShowcase />
            </ChatDataProvider>,
        );

        expect(screen.getByText("Chiamate · sezione G / R8")).toBeInTheDocument();
        expect(screen.getAllByText("Giulia Romano").length).toBeGreaterThan(0);
    });
});
