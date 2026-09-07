import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn, initials } from "@/lib/utils";
import type { Conversation, User } from "@/types/chat";
import { ChatCard, type AssignationCardAction } from "./ChatCard";

export function UserCard({
    user,
    conversations,
    isCurrentUser = false,
    expanded,
    onToggleExpand,
    onDropUser,
    onChatDragStart,
    onChatDragEnd,
    onChatAction,
}: {
    user: User;
    conversations: readonly Conversation[];
    isCurrentUser?: boolean;
    expanded: boolean;
    onToggleExpand: () => void;
    onDropUser: (userId: string) => void;
    onChatDragStart: (chat: Conversation) => void;
    onChatDragEnd: () => void;
    onChatAction: (chat: Conversation, action: AssignationCardAction) => void;
}) {
    const { t } = useTranslation();
    const [dropHover, setDropHover] = useState(false);

    return (
        <div
            data-user-card
            onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
            }}
            onDragEnter={() => setDropHover(true)}
            onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setDropHover(false);
                }
            }}
            onDrop={(e) => {
                e.preventDefault();
                setDropHover(false);
                onDropUser(user.id);
            }}
            className={cn(
                "rounded-lg border bg-(--bg-panel) transition-colors duration-200 ease-out",
                dropHover ? "border-(--accent) bg-(--bg-active)" : "border-(--border-strong)",
            )}
        >
            <div className="flex items-center gap-2 px-2.5 py-2">
                <span className="relative shrink-0">
                    <span
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                        style={{ backgroundColor: user.color }}
                    >
                        {initials(user.name)}
                    </span>
                    {user.online && (
                        <span
                            aria-hidden
                            className="absolute -end-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-(--bg-panel) bg-(--fg-success)"
                        />
                    )}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                        <span className="truncate text-sm font-medium">{user.name}</span>
                        {isCurrentUser && (
                            <span className="rounded-full bg-(--accent-soft) px-1.5 py-0.5 text-[9px] font-medium text-(--fg-secondary)">
                                {t("assignation.youBadge")}
                            </span>
                        )}
                    </span>
                    <span className="block text-[10px] text-(--fg-tertiary)">
                        {t("assignation.assignedCount", { count: conversations.length })}
                    </span>
                </span>
                {conversations.length > 0 && (
                    <button
                        type="button"
                        onClick={onToggleExpand}
                        aria-expanded={expanded}
                        className="flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] text-(--fg-secondary) transition-colors duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:outline-none"
                    >
                        {expanded ? (
                            <ChevronDown className="h-3 w-3" />
                        ) : (
                            <ChevronRight className="h-3 w-3" />
                        )}
                        {t("assignation.conversationsCount", { count: conversations.length })}
                    </button>
                )}
            </div>

            {expanded && (
                <div className="flex flex-col gap-1 border-t border-(--border-soft) p-2">
                    {conversations.map((c) => (
                        <ChatCard
                            key={c.id}
                            chat={c}
                            variant="assigned"
                            draggable
                            onDragStart={onChatDragStart}
                            onDragEnd={onChatDragEnd}
                            onAction={onChatAction}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
