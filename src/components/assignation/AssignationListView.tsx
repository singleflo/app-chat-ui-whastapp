import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn, initials, waitTimeLabel } from "@/lib/utils";
import { isUnassignedConversation } from "@/data/chat-data";
import type { AssignationCardAction } from "./ChatCard";
import type { Conversation, User } from "@/types/chat";

export function AssignationListView({
    conversations,
    users,
    onAction,
}: {
    conversations: readonly Conversation[];
    users: readonly User[];
    onAction: (chat: Conversation, action: AssignationCardAction) => void;
}) {
    const { t } = useTranslation();
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);

    const assigneeOf = (conv: Conversation): User | null =>
        users.find((u) => u.id === conv.assignedUserId) ?? null;

    return (
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-(--border-strong) bg-(--bg-panel)">
            <div className="flex h-9 shrink-0 items-center border-b border-(--border-strong) px-3 text-[11px] font-semibold uppercase tracking-wide text-(--fg-secondary)">
                {t("assignation.title")}
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => {
                    const closed = conv.state === "done";
                    const failed = conv.assignmentFailed === true;
                    const unassigned = isUnassignedConversation(conv);
                    const assignee = assigneeOf(conv);
                    return (
                        <div
                            key={conv.id}
                            data-chat-row
                            onContextMenu={(e) => {
                                e.preventDefault();
                                setOpenMenuId(conv.id);
                            }}
                            className={cn(
                                "flex items-center gap-3 border-b border-(--border-soft) px-3 py-2 transition-colors duration-200 ease-out last:border-b-0 hover:bg-(--bg-hover)",
                                closed && "opacity-70",
                            )}
                        >
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="truncate text-sm font-medium">{conv.name}</span>
                                    {closed && <Badge variant="outline">{t("assignation.closedBadge")}</Badge>}
                                    {failed && (
                                        <Badge variant="warning">{t("chat.list.assignmentFailed")}</Badge>
                                    )}
                                    {unassigned && !failed && (
                                        <Badge variant="warning">{t("chat.assignment.unassigned")}</Badge>
                                    )}
                                </div>
                                <div className="truncate text-xs text-(--fg-tertiary)">
                                    {conv.lastMessagePreview}
                                </div>
                            </div>

                            <span className="hidden w-32 shrink-0 truncate text-xs text-(--fg-tertiary) lg:block">
                                {conv.phone}
                            </span>

                            <span className="hidden w-36 shrink-0 items-center gap-1.5 md:flex">
                                {assignee ? (
                                    <>
                                        <span
                                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold text-white"
                                            style={{ backgroundColor: assignee.color }}
                                        >
                                            {initials(assignee.name)}
                                        </span>
                                        <span className="truncate text-xs">{assignee.name}</span>
                                    </>
                                ) : (
                                    <Badge variant="warning">{t("chat.assignment.unassigned")}</Badge>
                                )}
                            </span>

                            {conv.unread > 0 && <Badge variant="unread">{conv.unread}</Badge>}

                            <span className="w-8 shrink-0 text-right text-[10px] tabular-nums text-(--fg-tertiary)">
                                {waitTimeLabel(conv.lastMessageTs)}
                            </span>

                            <DropdownMenu
                                open={openMenuId === conv.id}
                                onOpenChange={(open) => !open && setOpenMenuId(null)}
                            >
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
                                    <DropdownMenuItem onSelect={() => onAction(conv, "open")}>
                                        {t("assignation.openChat")}
                                    </DropdownMenuItem>
                                    {unassigned && (
                                        <DropdownMenuItem onSelect={() => onAction(conv, "assign")}>
                                            {t("assignation.assignTo")}
                                        </DropdownMenuItem>
                                    )}
                                    {conv.assignedUserId && (
                                        <DropdownMenuItem onSelect={() => onAction(conv, "release")}>
                                            {t("assignation.release")}
                                        </DropdownMenuItem>
                                    )}
                                    {closed ? (
                                        <DropdownMenuItem onSelect={() => onAction(conv, "reopen")}>
                                            {t("assignation.reopenChat")}
                                        </DropdownMenuItem>
                                    ) : (
                                        <DropdownMenuItem onSelect={() => onAction(conv, "close")}>
                                            {t("assignation.closeChat")}
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    );
                })}
                {conversations.length === 0 && (
                    <div className="flex h-32 items-center justify-center text-sm text-(--fg-tertiary)">
                        {t("assignation.emptyList")}
                    </div>
                )}
            </div>
        </div>
    );
}
