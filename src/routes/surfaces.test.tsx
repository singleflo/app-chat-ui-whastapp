import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QuickPopoverSurface } from "./surfaces";
import { ChatDataProvider } from "@/data/chat-data";

describe("QuickPopoverSurface", () => {
    it("renders assigned conversations from the store in the quick panel", () => {
        render(
            <ChatDataProvider>
                <QuickPopoverSurface />
            </ChatDataProvider>,
        );

        expect(screen.getAllByText("Giulia Romano").length).toBeGreaterThan(0);
    });
});
