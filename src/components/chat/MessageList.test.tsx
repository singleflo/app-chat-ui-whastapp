import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MessageList } from "./MessageList";
import { ChatDataProvider, useChatActions } from "@/data/chat-data";

// Stub geometry
beforeEach(() => {
    let scrollTop = 0;
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", { configurable: true, value: 1000 });
    Object.defineProperty(HTMLElement.prototype, "clientHeight", { configurable: true, value: 500 });
    Object.defineProperty(HTMLElement.prototype, "scrollTop", {
        configurable: true,
        get() { return scrollTop; },
        set(val) { scrollTop = val; }
    });
    HTMLElement.prototype.scrollTo = vi.fn(function(this: HTMLElement, optionsOrX?: ScrollToOptions | number, y?: number) {
        if (typeof optionsOrX === "object" && optionsOrX?.top !== undefined) {
            this.scrollTop = optionsOrX.top;
        } else if (typeof y === "number") {
            this.scrollTop = y;
        }
    }) as unknown as typeof HTMLElement.prototype.scrollTo;
});

afterEach(() => {
    vi.restoreAllMocks();
});

function Harness({ convId }: { convId: string }) {
    const { sendText } = useChatActions(convId);
    return (
        <div className="h-[500px] flex flex-col">
            <button type="button" onClick={() => sendText("Hello new message")}>Send</button>
            <MessageList conversationId={convId} />
        </div>
    );
}

describe("MessageList", () => {
    it("autoscroll-when-at-bottom", async () => {
        render(
            <ChatDataProvider>
                <Harness convId="c1" />
            </ChatDataProvider>
        );
        
        const viewport = document.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement;
        expect(viewport).not.toBeNull();
        
        // Wait for initial render
        await waitFor(() => {
            expect(viewport.scrollHeight).toBe(1000);
        });
        
        viewport.scrollTop = 500; // at bottom (1000 - 500 - 500 = 0 < 60)
        fireEvent.scroll(viewport);
        
        fireEvent.click(screen.getByText("Send"));
        
        await screen.findByText("Hello new message");
        expect(screen.queryByText(/nuov. messagg/i)).not.toBeInTheDocument();
        expect(viewport.scrollTo).toHaveBeenCalledWith({ top: 1000, behavior: "smooth" });
    });

    it("new-pill-when-scrolled-up", async () => {
        render(
            <ChatDataProvider>
                <Harness convId="c1" />
            </ChatDataProvider>
        );
        
        const viewport = document.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement;
        
        await waitFor(() => {
            expect(viewport.scrollHeight).toBe(1000);
        });
        
        viewport.scrollTop = 0; // scrolled up (1000 - 0 - 500 = 500 > 60)
        fireEvent.scroll(viewport);
        
        fireEvent.click(screen.getByText("Send"));
        
        await screen.findByText("Hello new message");
        const pill = await screen.findByText(/nuov. messagg/i);
        expect(pill).toBeInTheDocument();
        
        fireEvent.click(pill);
        expect(screen.queryByText(/nuov. messagg/i)).not.toBeInTheDocument();
        expect(viewport.scrollTo).toHaveBeenCalledWith({ top: 1000, behavior: "smooth" });
    });

    it("loadmore-anchor-preserved", async () => {
        render(
            <ChatDataProvider>
                <MessageList conversationId="c1" />
            </ChatDataProvider>
        );
        
        const viewport = document.querySelector("[data-radix-scroll-area-viewport]") as HTMLElement;
        
        await waitFor(() => {
            expect(viewport.scrollHeight).toBe(1000);
        });
        
        viewport.scrollTop = 50; // near top
        fireEvent.scroll(viewport);
        
        // Wait for loading indicator
        await screen.findByText("Carica messaggi precedenti…");
        
        // Change scrollHeight to simulate new items added
        Object.defineProperty(HTMLElement.prototype, "scrollHeight", { configurable: true, value: 1500 });
        
        // Loading indicator should be gone
        await waitFor(() => {
            expect(screen.queryByText("Carica messaggi precedenti…")).not.toBeInTheDocument();
        });
        
        // ScrollTop should be adjusted: 50 + (1500 - 1000) = 550
        expect(viewport.scrollTop).toBe(550);
    });
});
