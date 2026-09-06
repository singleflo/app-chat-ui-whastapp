import * as React from "react";
import {
    Smile,
    Plus,
    Camera,
    Send,
    FileText,
    Image as ImageIcon,
    User,
    MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useConversation, useChatActions, useTemplates } from "@/data/chat-data";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { actionBtn, focusRing, iconBtn } from "./shared";


const EMOJIS = [
    "😀", "😂", "🥰", "😍", "🤔", "😎", "😢", "😡", "👍", "👎",
    "🙏", "👏", "🤝", "💪", "🎉", "🔥", "❤️", "✅", "📎", "📷",
];

interface ComposerProps {
    readonly conversationId: string;
}

export function Composer({ conversationId }: ComposerProps) {
    const { t } = useTranslation();
    const conv = useConversation(conversationId);
    const { sendText } = useChatActions(conversationId);
    const templates = useTemplates();

    const [text, setText] = React.useState("");
    const [tplOpen, setTplOpen] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const composerRef = React.useRef<HTMLDivElement>(null);
    const [boundary, setBoundary] = React.useState<HTMLElement | null>(null);

    const isWindowClosed = conv?.windowClosed;

    const adjustHeight = React.useCallback(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
        el.style.overflowY = el.scrollHeight > 120 ? "auto" : "hidden";
    }, []);

    React.useEffect(() => {
        adjustHeight();
    }, [adjustHeight]);

    // Popover collision boundary: keeps popovers inside the chat column (not past the mobile frame).
    React.useEffect(() => {
        setBoundary(composerRef.current?.closest<HTMLElement>("[data-chat-column]") ?? null);
    }, []);

    const handleSend = React.useCallback(() => {
        const trimmed = text.trim();
        if (trimmed) {
            sendText(trimmed);
            setText("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
        }
    }, [text, sendText]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const insertText = (toInsert: string) => {
        const el = textareaRef.current;
        if (!el) return;
        const start = el.selectionStart;
        const end = el.selectionEnd;
        const newText = text.substring(0, start) + toInsert + text.substring(end);
        setText(newText);
        
        // Restore focus and cursor position after React re-renders
        window.requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(start + toInsert.length, start + toInsert.length);
            adjustHeight();
        });
    };

    return (
        <div ref={composerRef} className="shrink-0 bg-(--bg-panel-2) px-3 py-2">
            {isWindowClosed && (
                <div className="mb-1.5 flex items-center justify-between rounded-md bg-(--bg-bubble-error) px-2 py-1 text-[11px] text-(--status-failed)">
                    <span>{t("chat.composer.windowClosed")}</span>
                    <button
                        type="button"
                        className={cn(
                            "rounded bg-(--accent) px-2 py-0.5 text-(--accent-fg) hover:opacity-90",
                            actionBtn
                        )}
                    >
                        {t("chat.composer.sendTemplate")}
                    </button>
                </div>
            )}
            <div className="flex items-end gap-1.5 rounded-lg bg-(--bg-panel) px-2 py-1.5 shadow-(--shadow-bubble)">
                <Popover>
                    <PopoverTrigger asChild>
                        <ComposerIcon label={t("chat.composer.emoji")}>
                            <Smile className="h-5 w-5" />
                        </ComposerIcon>
                    </PopoverTrigger>
                    <PopoverContent
                        side="top"
                        align="start"
                        collisionPadding={8}
                        collisionBoundary={boundary}
                        className="w-64 max-w-[var(--radix-popper-available-width)] p-2"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                        <div className="mb-2 text-xs font-semibold text-(--fg-secondary)">
                            {t("chat.composer.emojiTitle")}
                        </div>
                        <div className="grid grid-cols-5 gap-1">
                            {EMOJIS.map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    onClick={() => insertText(emoji)}
                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded hover:bg-(--bg-hover) text-lg"
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <ComposerIcon label={t("chat.composer.attachments")}>
                            <Plus className="h-5 w-5" />
                        </ComposerIcon>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="top"
                        collisionPadding={8}
                        collisionBoundary={boundary}
                        className="w-48"
                    >
                        <DropdownMenuItem>
                            <ImageIcon className="text-(--accent)" />
                            <span>{t("chat.composer.attach.photoVideo")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Camera className="text-(--destructive)" />
                            <span>{t("chat.composer.attach.camera")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <FileText className="text-(--window-open)" />
                            <span>{t("chat.composer.attach.document")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <User className="text-(--fg-link)" />
                            <span>{t("chat.composer.attach.contact")}</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <MapPin className="text-(--window-warning)" />
                            <span>{t("chat.composer.attach.location")}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Popover open={tplOpen} onOpenChange={setTplOpen}>
                    <PopoverTrigger asChild>
                        <ComposerIcon label={t("chat.composer.template")} highlight>
                            <FileText className="h-5 w-5" />
                        </ComposerIcon>
                    </PopoverTrigger>
                    <PopoverContent
                        side="top"
                        align="start"
                        collisionPadding={8}
                        collisionBoundary={boundary}
                        className="w-80 max-w-[var(--radix-popper-available-width)] p-0"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                        <div className="border-b border-(--border-strong) p-3 text-sm font-semibold text-(--fg-primary)">
                            {t("chat.composer.templateTitle")}
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                            {templates.length === 0 ? (
                                <div className="p-4 text-center text-sm text-(--fg-tertiary)">
                                    {t("chat.composer.templatesEmpty")}
                                </div>
                            ) : (
                                <div className="flex flex-col p-2">
                                    {templates.map((template) => (
                                        <button
                                            key={template.id}
                                            type="button"
                                            onClick={() => {
                                                insertText(template.body);
                                                setTplOpen(false);
                                            }}
                                            className="flex cursor-pointer flex-col gap-1 rounded-md p-2 text-left hover:bg-(--bg-hover) focus-visible:bg-(--bg-hover) focus-visible:outline-none"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="truncate text-sm font-medium text-(--fg-primary)">
                                                    {template.name}
                                                </span>
                                                <Badge variant="secondary" className="shrink-0 text-[10px]">
                                                    {t(`chat.composer.category.${template.category.toLowerCase()}`)}
                                                </Badge>
                                            </div>
                                            <span className="line-clamp-2 text-xs text-(--fg-secondary)">
                                                {template.body}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </PopoverContent>
                </Popover>

                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={text}
                    onChange={(e) => {
                        setText(e.target.value);
                        adjustHeight();
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={t("chat.composer.placeholder")}
                    className={cn(
                        "max-h-24 min-w-0 flex-1 resize-none rounded-md bg-transparent px-1 py-1 text-sm text-(--fg-primary) placeholder:text-(--fg-tertiary) focus:outline-none",
                        focusRing
                    )}
                />

                <ComposerIcon label={t("chat.composer.camera")}>
                    <Camera className="h-5 w-5" />
                </ComposerIcon>

                <button
                    type="button"
                    onClick={handleSend}
                    disabled={!text.trim()}
                    className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) hover:scale-105 disabled:opacity-50 disabled:hover:scale-100",
                        actionBtn
                    )}
                    aria-label={t("chat.composer.send")}
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

const ComposerIcon = React.forwardRef<
    HTMLButtonElement,
    {
        children: React.ReactNode;
        label?: string;
        highlight?: boolean;
    } & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, label, highlight, ...props }, ref) => {
    return (
        <button
            ref={ref}
            type="button"
            title={label}
            aria-label={label}
            className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                iconBtn,
                highlight
                    ? "text-(--accent) hover:bg-(--accent-soft)"
                    : "text-(--fg-secondary) hover:bg-(--bg-hover)"
            )}
            {...props}
        >
            {children}
        </button>
    );
});
ComposerIcon.displayName = "ComposerIcon";
