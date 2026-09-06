import { useTranslation } from "react-i18next";
import {
    FileText,
    Image,
    MapPin,
    MessageSquare,
    Mic,
    MoreVertical,
    Sticker,
    User,
    Video,
    type LucideIcon,
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AckIcon } from "@/components/bubbles/Bubble";
import { cn, waitTimeLabel } from "@/lib/utils";
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
                "group rounded-lg border bg-(--bg-panel) px-2.5 py-2",
                closed ? "border-(--border-soft) opacity-70" : "border-(--border-strong)",
                draggable && "cursor-grab hover:border-(--accent)",
            )}
        >
            <div className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{chat.name}</span>
                {closed && <Badge variant="outline">{t("assignation.closedBadge")}</Badge>}
                {chat.unread > 0 && <Badge variant="unread">{chat.unread}</Badge>}
                <span className="text-[10px] tabular-nums text-(--fg-tertiary)">
                    {waitTimeLabel(chat.lastMessageTs)}
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

            <div className="mt-1 truncate text-[10px] text-(--fg-tertiary)">{chat.phone}</div>

            <div className="mt-1 flex items-center gap-1.5">
                {chat.lastMessageDirection === "out" ? (
                    <AckIcon status={chat.lastAck ?? "delivered"} />
                ) : (
                    <MediaIcon className="h-3 w-3 shrink-0 text-(--fg-tertiary)" />
                )}
                <span className="min-w-0 flex-1 truncate text-xs text-(--fg-secondary)">
                    {chat.lastMessagePreview}
                </span>
            </div>

            {variant === "assigned" && (
                <div className="pointer-events-none absolute inset-0 rounded-lg ring-(--ring) transition-shadow duration-200 ease-out group-hover:shadow-(--shadow-sm) group-hover:ring-1" />
            )}
        </div>
    );
}
