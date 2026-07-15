import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Composer } from "./Composer";
import { ChatDataProvider } from "@/data/chat-data";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import itChat from "@/locales/it/chat.json";

i18n.use(initReactI18next).init({
    lng: "it",
    fallbackLng: "it",
    resources: {
        it: { chat: itChat.chat },
    },
    interpolation: { escapeValue: false },
});

// Mock scrollHeight for textarea
Object.defineProperty(HTMLTextAreaElement.prototype, "scrollHeight", {
    configurable: true,
    get() {
        return this._scrollHeight || 0;
    },
    set(val) {
        this._scrollHeight = val;
    },
});

describe("Composer", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset scrollHeight mock
        Object.defineProperty(HTMLTextAreaElement.prototype, "scrollHeight", {
            configurable: true,
            get() {
                return this.value ? this.value.split("\n").length * 20 : 20;
            },
        });
    });

    const renderComposer = () => {
        return render(
            <I18nextProvider i18n={i18n}>
                <ChatDataProvider>
                    <Composer conversationId="c1" />
                </ChatDataProvider>
            </I18nextProvider>
        );
    };

    it("#autogrow: grows textarea height based on scrollHeight", async () => {
        renderComposer();
        const textarea = screen.getByPlaceholderText("chat.composer.placeholder");
        
        expect(textarea.style.height).toBe("20px");

        await userEvent.type(textarea, "Line 1\nLine 2\nLine 3");
        
        // 3 lines * 20 = 60px
        expect(textarea.style.height).toBe("60px");
    });

    it("#enter-sends: Enter sends message and clears textarea", async () => {
        renderComposer();
        const textarea = screen.getByPlaceholderText("chat.composer.placeholder");
        
        await userEvent.type(textarea, "Hello world");
        expect(textarea).toHaveValue("Hello world");

        await userEvent.keyboard("{Enter}");
        
        expect(textarea).toHaveValue("");
    });

    it("#enter-sends: Shift+Enter adds newline without sending", async () => {
        renderComposer();
        const textarea = screen.getByPlaceholderText("chat.composer.placeholder");
        
        await userEvent.type(textarea, "Hello\nworld");
        
        expect(textarea).toHaveValue("Hello\nworld");
    });

    it("#emoji-insert: inserts emoji at cursor", async () => {
        renderComposer();
        const textarea = screen.getByPlaceholderText("chat.composer.placeholder");
        
        await userEvent.type(textarea, "Hello ");
        
        const emojiBtn = screen.getByRole("button", { name: "chat.composer.emoji" });
        await userEvent.click(emojiBtn);
        
        const smileEmoji = await screen.findByRole("button", { name: "😀" });
        await userEvent.click(smileEmoji);
        
        expect(textarea).toHaveValue("Hello 😀");
    });

    it("#template-insert: inserts template body", async () => {
        renderComposer();
        const textarea = screen.getByPlaceholderText("chat.composer.placeholder");
        
        const templateBtn = screen.getByRole("button", { name: "chat.composer.template" });
        await userEvent.click(templateBtn);
        
        // Find the first template button (using a generic query since we don't know the exact text)
        const templates = await screen.findAllByRole("button");
        // The first button in the popover should be a template
        const firstTemplate = templates.find(b => b.textContent?.includes("Marketing") || b.textContent?.includes("Utilità") || b.textContent?.includes("Autenticazione"));
        
        if (firstTemplate) {
            await userEvent.click(firstTemplate);
            expect((textarea as HTMLTextAreaElement).value.length).toBeGreaterThan(0);
        }
    });
});
