import { useTranslation } from "react-i18next";
import {
    Clock,
    FileText,
    Image,
    MapPin,
    MessageCircle,
    MessageSquare,
    Mic,
    Megaphone,
    MoreVertical,
    Sticker,
    User,
    Video,
    Webhook,
    type LucideIcon,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AckIcon } from "@/components/bubbles/Bubble";
import { cn, fmtTime, initials, waitTimeLabel, windowRemainingMs } from "@/lib/utils";
import { isUnassignedConversation } from "@/data/chat-data";
import type { Conversation } from "@/types/chat";

export type AssignationCardAction = "open" | "assign" | "close" | "reopen" | "release";

const MEDIA_ICONS: Record<string, LucideIcon> = {
    image: Image,
    video: Video,
    audio: Mic,
    ptt: Mic,
    document: FileText,
    sticker: Sticker,
    location: MapPin,
    contacts: User,
    contact: User,
};

const CHANNEL_ICONS: Record<string, LucideIcon> = {
    ads: Megaphone,
    whatsapp: MessageCircle,
    api: Webhook,
};

function WindowBanner({ chat }: { chat: Conversation }) {
    const { t } = useTranslation();
    const remaining = windowRemainingMs(chat.lastMessageTs);
    if (remaining <= 0) {
        return (
            <div className="flex items-center gap-1.5 rounded-md bg-(--bg-panel-2) px-2 py-1 text-[10px] text-(--fg-tertiary)">
                <Clock className="h-3 w-3" aria-hidden />
                {t("assignation.windowExpired")}
            </div>
        );
    }
    const hours = Math.floor(remaining / 3_600_000);
    const minutes = Math.floor((remaining % 3_600_000) / 60000);
    return (
        <div className="flex items-center gap-1.5 rounded-md bg-(--accent-soft) px-2 py-1 text-[10px] font-medium text-(--accent-hover)">
            <Clock className="h-3 w-3" aria-hidden />
            {t("assignation.windowRemaining", { hours, minutes })}
        </div>
    );
}

export function ChatCard({
    chat,
    variant = "unassigned",
    draggable = false,
    onDragStart,
    onDragEnd,
    onAction,
}: {
    chat: Conversation;
    variant?: "unassigned" | "assigned";
    draggable?: boolean;
    onDragStart?: (chat: Conversation) => void;
    onDragEnd?: () => void;
    onAction?: (chat: Conversation, action: AssignationCardAction) => void;
}) {
    const { t } = useTranslation();
    const closed = chat.state === "done";
    const unassigned = isUnassignedConversation(chat);
    const MediaIcon = MEDIA_ICONS[chat.lastMessageType] ?? MessageSquare;
    const ChannelIcon = CHANNEL_ICONS[chat.channel ?? ""] ?? MessageCircle;

    return (
        <div
            data-chat-card
            draggable={draggable}
            onDragStart={(e) => {
                const dt = e.dataTransfer;
                if (dt) {
                    dt.effectAllowed = "move";
                    dt.setData("text/plain", chat.id);
                }
                onDragStart?.(chat);
            }}
            onDragEnd={() => onDragEnd?.()}
            className={cn(
                "flex w-[340px] max-w-full flex-col gap-2 rounded-lg border bg-(--bg-panel) px-2.5 py-2",
                closed ? "border-(--border-soft) opacity-70" : "border-(--border-strong)",
                draggable && "cursor-grab hover:border-(--accent)",
                variant === "assigned" && "w-full",
            )}
        >
            {/* Header banner: phone + menu (reference layout) */}
            <div className="flex items-center gap-2 rounded-md bg-(--bg-panel-2) px-2 py-1">
                <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-(--fg-secondary)">
                    {chat.phone}
                </span>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            aria-label={t("assignation.cardMenu")}
                            className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-(--fg-tertiary) transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-out hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:outline-none active:scale-95"
                        >
                            <MoreVertical className="h-3.5 w-3.5" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => onAction?.(chat, "open")}>
                            {t("assignation.openChat")}
                        </DropdownMenuItem>
                        {unassigned && (
                            <DropdownMenuItem onSelect={() => onAction?.(chat, "assign")}>
                                {t("assignation.assignTo")}
                            </DropdownMenuItem>
                        )}
                        {chat.assignedUserId && (
                            <DropdownMenuItem onSelect={() => onAction?.(chat, "release")}>
                                {t("assignation.release")}
                            </DropdownMenuItem>
                        )}
                        {closed ? (
                            <DropdownMenuItem onSelect={() => onAction?.(chat, "reopen")}>
                                {t("assignation.reopenChat")}
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem onSelect={() => onAction?.(chat, "close")}>
                                {t("assignation.closeChat")}
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Identity row: avatar + name (+badges) + channel + wait badge */}
            <div className="flex items-center gap-2">
                <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: chat.avatarColor }}
                >
                    {initials(chat.name)}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-medium">{chat.name}</span>
                        {closed && <Badge variant="outline">{t("assignation.closedBadge")}</Badge>}
                        {chat.unread > 0 && <Badge variant="unread">{chat.unread}</Badge>}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1 text-[10px] text-(--fg-tertiary)">
                        <ChannelIcon className="h-3 w-3" aria-hidden />
                        {chat.channel ?? "whatsapp"}
                    </span>
                </span>
                <span className="shrink-0 rounded-full bg-(--accent-soft) px-1.5 py-0.5 text-[10px] font-medium text-(--accent-hover) tabular-nums">
                    {waitTimeLabel(chat.lastMessageTs)}
                </span>
            </div>

            {/* Footer: ACK/media icon + received time + preview */}
            <div className="flex items-center gap-1.5 border-t border-(--border-soft) pt-1.5">
                {chat.lastMessageDirection === "out" ? (
                    <AckIcon status={chat.lastAck ?? "delivered"} />
                ) : (
                    <MediaIcon className="h-3 w-3 shrink-0 text-(--fg-tertiary)" />
                )}
                <span className="shrink-0 text-[10px] tabular-nums text-(--fg-tertiary)">
                    {fmtTime(chat.lastMessageTs)}
                </span>
                <span className="min-w-0 flex-1 truncate text-xs text-(--fg-secondary)">
                    {chat.lastMessagePreview}
                </span>
            </div>

            {/* 24h service window banner (unassigned cards only) */}
            {variant === "unassigned" && <WindowBanner chat={chat} />}
        </div>
    );
}
