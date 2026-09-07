import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
    ArrowDown,
    ArrowUp,
    FlaskConical,
    LayoutGrid,
    List,
    Users,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { currentUser } from "@/data/dataset";
import {
    useAssignationActions,
    useAssignedConversationsByUser,
    useConversations,
    useInstances,
    useUnassignedChats,
    useUsers,
} from "@/data/chat-data";
import { AssignationListView } from "@/components/assignation/AssignationListView";
import { AssignDialog } from "@/components/assignation/AssignDialog";
import { ChatCard, type AssignationCardAction } from "@/components/assignation/ChatCard";
import { UserCard } from "@/components/assignation/UserCard";
import type { Conversation } from "@/types/chat";

const VIEW_KEY = "wa-assignation-view";
type ViewMode = "kanban" | "list";
const CHANNELS = ["ads", "whatsapp"] as const;

function readStoredViewMode(): ViewMode {
    return localStorage.getItem(VIEW_KEY) === "list" ? "list" : "kanban";
}

export function AssignationScreen() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const chats = useUnassignedChats();
    const users = useUsers();
    const instances = useInstances();
    const byUser = useAssignedConversationsByUser();
    const conversations = useConversations();
    const actions = useAssignationActions();

    const [searchChat, setSearchChat] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const [instanceId, setInstanceId] = useState<string | null>(null);
    const [channel, setChannel] = useState<string | null>(null);
    const [showClosed, setShowClosed] = useState(false);
    const [waitFirst, setWaitFirst] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>(readStoredViewMode);
    const [dragChat, setDragChat] = useState<Conversation | null>(null);
    const [assignDialog, setAssignDialog] = useState<Conversation | null>(null);
    const [expandedUsers, setExpandedUsers] = useState<ReadonlySet<string>>(new Set());

    const matchesFilters = useCallback(
        (conv: Conversation) =>
            (showClosed || conv.state === "open") &&
            (!instanceId || conv.instanceId === instanceId),
        [showClosed, instanceId],
    );

    const visibleChats = useMemo(() => {
        const q = searchChat.trim().toLowerCase();
        const items = chats.filter(
            (c) =>
                matchesFilters(c) &&
                (!channel || c.channel === channel) &&
                (!q || c.name.toLowerCase().includes(q) || c.phone.includes(q)),
        );
        return [...items].sort((a, b) => {
            const ta = Date.parse(a.lastMessageTs) || 0;
            const tb = Date.parse(b.lastMessageTs) || 0;
            // wait-first = oldest last-message first; recent-first = newest first
            return waitFirst ? ta - tb : tb - ta;
        });
    }, [chats, matchesFilters, channel, searchChat, waitFirst]);

    const visibleUsers = useMemo(() => {
        const q = searchUser.trim().toLowerCase();
        return users.filter((u) => !q || u.name.toLowerCase().includes(q));
    }, [users, searchUser]);

    const conversationsOf = useCallback(
        (userId: string) =>
            (byUser.get(userId) ?? []).filter((c) => {
                const q = searchChat.trim().toLowerCase();
                return (
                    matchesFilters(c) &&
                    (!q || c.name.toLowerCase().includes(q) || c.phone.includes(q))
                );
            }),
        [byUser, matchesFilters, searchChat],
    );

    const visibleAll = useMemo(() => {
        const q = searchChat.trim().toLowerCase();
        return conversations.items.filter(
            (c) =>
                matchesFilters(c) &&
                (!channel || c.channel === channel) &&
                (!q || c.name.toLowerCase().includes(q) || c.phone.includes(q)),
        );
    }, [conversations.items, matchesFilters, channel, searchChat]);

    const switchView = useCallback((mode: ViewMode) => {
        setViewMode(mode);
        localStorage.setItem(VIEW_KEY, mode);
    }, []);

    const toggleUserExpanded = useCallback((userId: string) => {
        setExpandedUsers((prev) => {
            const next = new Set(prev);
            if (next.has(userId)) {
                next.delete(userId);
            } else {
                next.add(userId);
            }
            return next;
        });
    }, []);

    const handleChatDragStart = useCallback((chat: Conversation) => setDragChat(chat), []);
    const handleChatDragEnd = useCallback(() => setDragChat(null), []);

    const handleDropOnUser = useCallback(
        (userId: string) => {
            if (dragChat) {
                actions.assign(dragChat.id, userId);
            }
            setDragChat(null);
        },
        [actions, dragChat],
    );

    const handleCardAction = useCallback(
        (chat: Conversation, action: AssignationCardAction) => {
            switch (action) {
                case "open":
                    navigate("/");
                    break;
                case "assign":
                    setAssignDialog(chat);
                    break;
                case "close":
                    actions.close(chat.id);
                    break;
                case "reopen":
                    actions.reopen(chat.id);
                    break;
                case "release":
                    actions.assign(chat.id, null);
                    break;
            }
        },
        [actions, navigate],
    );

    const simulateIncoming = () => {
        const target = visibleChats.find((c) => c.state === "open") ?? visibleChats[0];
        if (target) {
            actions.simulateIncoming(target.id);
        }
    };

    const simulateReassign = () => {
        const assigned = conversations.items.filter((c) => c.assignedUserId && c.state === "open");
        const current = assigned[0];
        if (!current?.assignedUserId) {
            return;
        }
        const others = users.filter((u) => u.id !== current.assignedUserId);
        if (others.length === 0) {
            return;
        }
        actions.assign(current.id, others[Math.floor(Math.random() * others.length)].id);
    };

    const instanceName = instanceId
        ? instances.find((i) => i.id === instanceId)?.name ?? t("assignation.instanceAll")
        : t("assignation.instanceAll");

    const pillButton = (active: boolean) =>
        cn(
            "cursor-pointer rounded-md px-2 py-1 text-xs transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel-2) focus-visible:outline-none active:scale-95",
            active ? "bg-(--accent) text-(--accent-fg)" : "bg-(--bg-panel) text-(--fg-secondary)",
        );

    return (
        <div className="relative flex h-full flex-col bg-(--bg-panel)">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b border-(--border-strong) bg-(--bg-header) px-3">
                <Users className="h-4 w-4 text-(--fg-tertiary)" />
                <h2 className="flex-1 text-sm font-semibold">{t("assignation.title")}</h2>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button type="button" className={pillButton(!!instanceId)}>
                            <span className="text-(--fg-tertiary)">
                                {t("assignation.instanceLabel")}:{" "}
                            </span>
                            {instanceName}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => setInstanceId(null)}>
                            {t("assignation.instanceAll")}
                        </DropdownMenuItem>
                        {instances.map((inst) => (
                            <DropdownMenuItem key={inst.id} onSelect={() => setInstanceId(inst.id)}>
                                {inst.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex cursor-pointer items-center gap-1.5 rounded-md bg-(--bg-panel) px-2 py-1 text-xs text-(--fg-secondary) transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-out hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel-2) focus-visible:outline-none active:scale-95"
                        >
                            <FlaskConical className="h-3.5 w-3.5" />
                            {t("assignation.simulateLabel")}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={simulateIncoming}>
                            {t("assignation.simulateIncoming")}
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={simulateReassign}>
                            {t("assignation.simulateReassign")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            <main
                className={cn(
                    "flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-3 lg:flex-row",
                    dragChat && "ring-1 ring-(--ring) ring-inset",
                )}
            >
                {/* Users panel — 30% on lg */}
                <section
                    className={cn(
                        "flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border border-(--border-strong) bg-(--bg-panel) lg:h-auto lg:w-[30%] lg:shrink-0",
                        dragChat && "opacity-80",
                    )}
                >
                    <div className="flex shrink-0 flex-col gap-2 border-b border-(--border-strong) px-3 py-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-(--fg-secondary)">
                            {t("assignation.usersPanelCount", { count: visibleUsers.length })}
                        </span>
                        <Input
                            value={searchUser}
                            onChange={(e) => setSearchUser(e.target.value)}
                            placeholder={t("assignation.searchUser")}
                            className="h-8"
                        />
                    </div>
                    <ScrollArea className="min-h-0 flex-1">
                        <div className="flex flex-col gap-2 p-2">
                            {visibleUsers.map((u) => (
                                <UserCard
                                    key={u.id}
                                    user={u}
                                    conversations={conversationsOf(u.id)}
                                    isCurrentUser={u.id === currentUser.id}
                                    expanded={expandedUsers.has(u.id)}
                                    onToggleExpand={() => toggleUserExpanded(u.id)}
                                    onDropUser={handleDropOnUser}
                                    onChatDragStart={handleChatDragStart}
                                    onChatDragEnd={handleChatDragEnd}
                                    onChatAction={handleCardAction}
                                />
                            ))}
                            {visibleUsers.length === 0 && (
                                <div className="flex h-24 items-center justify-center text-sm text-(--fg-tertiary)">
                                    {t("assignation.emptyList")}
                                </div>
                            )}
                            <div className="py-1 text-center text-[10px] text-(--fg-tertiary)">
                                {t("assignation.endOfList")}
                            </div>
                        </div>
                    </ScrollArea>
                </section>

                {/* Unassigned chats panel — 70% on lg */}
                <section
                    className={cn(
                        "flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-(--border-strong) bg-(--bg-panel)",
                        dragChat && "opacity-80",
                    )}
                >
                    {/* Panel header: title + wait sort + closed toggle */}
                    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-(--border-strong) px-3 py-2">
                        <span className="text-sm font-semibold">
                            {t("assignation.unassignedPanelCount", { count: visibleChats.length })}
                        </span>
                        <button
                            type="button"
                            onClick={() => setWaitFirst((v) => !v)}
                            aria-pressed={waitFirst}
                            className={cn(pillButton(false), "flex items-center gap-1")}
                        >
                            {waitFirst ? (
                                <ArrowDown className="h-3 w-3" />
                            ) : (
                                <ArrowUp className="h-3 w-3" />
                            )}
                            {t("assignation.sortByWait")}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowClosed((v) => !v)}
                            aria-pressed={showClosed}
                            className={pillButton(showClosed)}
                        >
                            {t("assignation.showClosed")}
                        </button>
                    </div>

                    {/* Filter row: channel + search + view toggle */}
                    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-(--border-strong) bg-(--bg-panel-2) px-3 py-2">
                        <span className="text-[11px] text-(--fg-tertiary)">
                            {t("assignation.channelLabel")}
                        </span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button type="button" className={pillButton(!!channel)}>
                                    {channel ?? t("assignation.channelAll")}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuItem onSelect={() => setChannel(null)}>
                                    {t("assignation.channelAll")}
                                </DropdownMenuItem>
                                {CHANNELS.map((ch) => (
                                    <DropdownMenuItem key={ch} onSelect={() => setChannel(ch)}>
                                        {ch}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Input
                            value={searchChat}
                            onChange={(e) => setSearchChat(e.target.value)}
                            placeholder={t("assignation.searchChat")}
                            className="h-8 w-44"
                        />
                        <div className="ml-auto flex gap-1">
                            <button
                                type="button"
                                onClick={() => switchView("kanban")}
                                aria-pressed={viewMode === "kanban"}
                                aria-label={t("assignation.viewKanban")}
                                className={cn(
                                    "flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel-2) focus-visible:outline-none active:scale-95",
                                    viewMode === "kanban"
                                        ? "bg-(--accent) text-(--accent-fg)"
                                        : "bg-(--bg-panel) text-(--fg-secondary) hover:bg-(--bg-hover) hover:text-(--fg-primary)",
                                )}
                            >
                                <LayoutGrid className="h-3.5 w-3.5" />
                                {t("assignation.viewKanban")}
                            </button>
                            <button
                                type="button"
                                onClick={() => switchView("list")}
                                aria-pressed={viewMode === "list"}
                                aria-label={t("assignation.viewList")}
                                className={cn(
                                    "flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel-2) focus-visible:outline-none active:scale-95",
                                    viewMode === "list"
                                        ? "bg-(--accent) text-(--accent-fg)"
                                        : "bg-(--bg-panel) text-(--fg-secondary) hover:bg-(--bg-hover) hover:text-(--fg-primary)",
                                )}
                            >
                                <List className="h-3.5 w-3.5" />
                                {t("assignation.viewList")}
                            </button>
                        </div>
                    </div>

                    {viewMode === "kanban" ? (
                        <ScrollArea className="min-h-0 flex-1">
                            <div className="flex flex-wrap items-start gap-2 p-2">
                                {visibleChats.map((c) => (
                                    <ChatCard
                                        key={c.id}
                                        chat={c}
                                        draggable
                                        onDragStart={handleChatDragStart}
                                        onDragEnd={handleChatDragEnd}
                                        onAction={handleCardAction}
                                    />
                                ))}
                                {visibleChats.length === 0 && (
                                    <div className="flex h-24 w-full items-center justify-center text-sm text-(--fg-tertiary)">
                                        {t("assignation.emptyList")}
                                    </div>
                                )}
                                <div className="w-full py-1 text-center text-[10px] text-(--fg-tertiary)">
                                    {t("assignation.endOfList")}
                                </div>
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <AssignationListView
                                conversations={visibleAll}
                                users={users}
                                onAction={handleCardAction}
                            />
                            <div className="py-1 text-center text-[10px] text-(--fg-tertiary)">
                                {t("assignation.endOfList")}
                            </div>
                        </div>
                    )}
                </section>
            </main>

            {assignDialog && (
                <AssignDialog
                    conversation={assignDialog}
                    users={users}
                    onAssign={(userId) => {
                        actions.assign(assignDialog.id, userId);
                        setAssignDialog(null);
                    }}
                    onClose={() => setAssignDialog(null)}
                />
            )}
        </div>
    );
}
