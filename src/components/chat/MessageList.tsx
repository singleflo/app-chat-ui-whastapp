import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ChatEntryRenderer } from "@/components/bubbles/MessageRenderer";
import { useMessages } from "@/data/chat-data";
import { iconBtn } from "./shared";


interface MessageListProps {
    readonly conversationId: string;
}

export function MessageList({ conversationId }: MessageListProps) {
    const { t } = useTranslation();
    const { items, loadingMore, hasMore, loadMore } = useMessages(conversationId);
    const scrollRef = useRef<HTMLDivElement>(null);
    const prevScrollHeightRef = useRef<number>(0);
    const prevFirstItemIdRef = useRef<string | null>(null);
    const prevLastItemIdRef = useRef<string | null>(null);
    const [showFab, setShowFab] = useState(false);
    const [newCount, setNewCount] = useState(0);

    const prevConversationIdRef = useRef<string>(conversationId);

    useEffect(() => {
        void conversationId;
        setNewCount(0);
        const viewport = scrollRef.current?.querySelector(
            "[data-radix-scroll-area-viewport]"
        ) as HTMLElement | null;
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
            setShowFab(false);
        }
    }, [conversationId]);

    useLayoutEffect(() => {
        const viewport = scrollRef.current?.querySelector(
            "[data-radix-scroll-area-viewport]"
        ) as HTMLElement | null;
        if (!viewport) return;

        if (prevConversationIdRef.current !== conversationId) {
            prevFirstItemIdRef.current = null;
            prevLastItemIdRef.current = null;
            prevScrollHeightRef.current = viewport.scrollHeight;
            prevConversationIdRef.current = conversationId;
            return;
        }

        const currentFirstId = items[0]?.id ?? null;
        const currentLastId = items[items.length - 1]?.id ?? null;
        const prevFirstId = prevFirstItemIdRef.current;
        const prevLastId = prevLastItemIdRef.current;
        const prevScrollHeight = prevScrollHeightRef.current;
        const currentScrollHeight = viewport.scrollHeight;

        if (prevFirstId && currentFirstId !== prevFirstId && currentLastId === prevLastId) {
            // Prepend (older messages loaded)
            viewport.scrollTop += currentScrollHeight - prevScrollHeight;
        } else if (prevLastId && currentLastId !== prevLastId) {
            // Append (new message arrived)
            const atBottom = prevScrollHeight - viewport.scrollTop - viewport.clientHeight < 60;
            if (atBottom) {
                viewport.scrollTo({ top: currentScrollHeight, behavior: "smooth" });
            } else {
                setNewCount((c) => c + 1);
            }
        }

        prevFirstItemIdRef.current = currentFirstId;
        prevLastItemIdRef.current = currentLastId;
        prevScrollHeightRef.current = currentScrollHeight;
    }, [items, conversationId]);

    useEffect(() => {
        const viewport = scrollRef.current?.querySelector(
            "[data-radix-scroll-area-viewport]"
        ) as HTMLElement | null;
        if (!viewport) return;

        const onScroll = () => {
            const atBottom =
                viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 60;
            setShowFab(!atBottom);
            if (atBottom) {
                setNewCount(0);
            }
            if (viewport.scrollTop < 80 && hasMore && !loadingMore) {
                void loadMore();
            }
        };

        viewport.addEventListener("scroll", onScroll, { passive: true });
        return () => viewport.removeEventListener("scroll", onScroll);
    }, [hasMore, loadingMore, loadMore]);

    const scrollToBottom = () => {
        const viewport = scrollRef.current?.querySelector(
            "[data-radix-scroll-area-viewport]"
        ) as HTMLElement | null;
        if (viewport) {
            viewport.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
            setShowFab(false);
            setNewCount(0);
        }
    };

    return (
        <div className="chat-doodle-bg relative flex-1 overflow-hidden" ref={scrollRef}>
            <ScrollArea className="relative h-full">
                <div className="flex w-full min-w-0 flex-col gap-1 px-4 py-4">
                    {loadingMore && (
                        <div className="flex flex-col items-center justify-center gap-2 py-2">
                            <Skeleton className="h-6 w-32 rounded-full bg-(--bg-panel-2)/50" />
                            <span className="text-xs text-(--fg-tertiary)">
                                {t("chat.list.loadingMore")}
                            </span>
                        </div>
                    )}
                    {items.map((entry) => (
                        <ChatEntryRenderer key={entry.id} entry={entry} />
                    ))}
                </div>
            </ScrollArea>
            {newCount > 0 ? (
                <NewMessagesPill count={newCount} onClick={scrollToBottom} />
            ) : (
                showFab && <ScrollToBottomFab onClick={scrollToBottom} />
            )}
        </div>
    );
}

function NewMessagesPill({ count, onClick }: { count: number; onClick: () => void }) {
    const { t } = useTranslation();
    const text = t("chat.newMessages", { count });
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "absolute right-1/2 bottom-4 z-20 flex translate-x-1/2 items-center gap-1.5 rounded-full bg-(--accent) px-3 py-1.5 text-sm font-medium text-(--accent-fg) shadow-(--shadow-overlay)",
                iconBtn
            )}
            aria-label={text}
        >
            <span>{text}</span>
            <span title={t("chat.scroll.toBottom")}>
                <ChevronDown className="h-4 w-4" />
            </span>
        </button>
    );
}

function ScrollToBottomFab({ onClick }: { onClick: () => void }) {
    const { t } = useTranslation();
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "absolute right-4 bottom-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-(--bg-panel) shadow-(--shadow-overlay) hover:bg-(--bg-hover)",
                iconBtn
            )}
            aria-label={t("chat.scroll.toBottom")}
        >
            <span title={t("chat.scroll.toBottom")}>
                <ChevronDown className="h-4 w-4 text-(--fg-secondary)" />
            </span>
        </button>
    );
}
