import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlaskConical, LayoutGrid, List, Users } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn, initials, waitTimeLabel } from "@/lib/utils";
import {
    useAssignationActions,
    useAssignedConversationsByUser,
    useConversations,
    useInstances,
    useUnassignedChats,
    useUsers,
} from "@/data/chat-data";

const VIEW_KEY = "wa-assignation-view";
type ViewMode = "kanban" | "list";

function readStoredViewMode(): ViewMode {
    return localStorage.getItem(VIEW_KEY) === "list" ? "list" : "kanban";
}

export function AssignationScreen() {
    const { t } = useTranslation();
    const chats = useUnassignedChats();
    const users = useUsers();
    const instances = useInstances();
    const byUser = useAssignedConversationsByUser();
    const conversations = useConversations();
    const actions = useAssignationActions();

    const [searchChat, setSearchChat] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const [instanceId, setInstanceId] = useState<string | null>(null);
    const [showClosed, setShowClosed] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>(readStoredViewMode);

    const visibleChats = useMemo(
        () =>
            chats.filter((c) => {
                const q = searchChat.trim().toLowerCase();
                return (
                    (showClosed || c.state === "open") &&
                    (!instanceId || c.instanceId === instanceId) &&
                    (!q || c.name.toLowerCase().includes(q) || c.phone.includes(q))
                );
            }),
        [chats, showClosed, instanceId, searchChat],
    );

    const visibleUsers = useMemo(() => {
        const q = searchUser.trim().toLowerCase();
        return users.filter((u) => !q || u.name.toLowerCase().includes(q));
    }, [users, searchUser]);

    const switchView = useCallback((mode: ViewMode) => {
        setViewMode(mode);
        localStorage.setItem(VIEW_KEY, mode);
    }, []);

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

    return (
        <div className="flex h-full flex-col bg-(--bg-panel)">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b border-(--border-strong) bg-(--bg-header) px-3">
                <Users className="h-4 w-4 text-(--fg-tertiary)" />
                <h2 className="flex-1 text-sm font-semibold">{t("assignation.title")}</h2>
            </header>

            <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-(--border-strong) bg-(--bg-panel-2) px-3 py-2">
                <Input
                    value={searchChat}
                    onChange={(e) => setSearchChat(e.target.value)}
                    placeholder={t("assignation.searchChat")}
                    className="h-8 w-44"
                />
                <Input
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    placeholder={t("assignation.searchUser")}
                    className="h-8 w-40"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className={cn(
                                "cursor-pointer rounded-md px-2 py-1 text-xs transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel-2) focus-visible:outline-none active:scale-95",
                                instanceId
                                    ? "bg-(--accent) text-(--accent-fg)"
                                    : "bg-(--bg-panel) text-(--fg-secondary)",
                            )}
                        >
                            <span className="text-(--fg-tertiary)">{t("assignation.instanceLabel")}: </span>
                            {instanceName}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
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
                <button
                    type="button"
                    onClick={() => setShowClosed((v) => !v)}
                    aria-pressed={showClosed}
                    className={cn(
                        "cursor-pointer rounded-md px-2 py-1 text-xs transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel-2) focus-visible:outline-none active:scale-95",
                        showClosed
                            ? "bg-(--accent) text-(--accent-fg)"
                            : "bg-(--bg-panel) text-(--fg-secondary)",
                    )}
                >
                    {t("assignation.showClosed")}
                </button>

                <div className="ml-auto flex items-center gap-2">
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

                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={() => switchView("kanban")}
                            aria-pressed={viewMode === "kanban"}
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
            </div>

            <main className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-3 lg:flex-row">
                {viewMode === "kanban" ? (
                    <>
                        <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-(--border-strong) bg-(--bg-panel)">
                            <div className="flex h-9 shrink-0 items-center border-b border-(--border-strong) px-3 text-[11px] font-semibold uppercase tracking-wide text-(--fg-secondary)">
                                {t("assignation.usersPanelCount", { count: visibleUsers.length })}
                            </div>
                            <ScrollArea className="flex-1">
                                <div className="flex flex-col gap-1 p-2">
                                    {visibleUsers.map((u) => {
                                        const assignedCount = byUser.get(u.id)?.length ?? 0;
                                        return (
                                            <div
                                                key={u.id}
                                                className="flex items-center gap-2 rounded-md px-2 py-1.5"
                                            >
                                                <span
                                                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                                                    style={{ backgroundColor: u.color }}
                                                >
                                                    {initials(u.name)}
                                                </span>
                                                <span className="min-w-0 flex-1 truncate text-sm">
                                                    {u.name}
                                                </span>
                                                <span className="text-[11px] tabular-nums text-(--fg-tertiary)">
                                                    {assignedCount}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </section>

                        <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-lg border border-(--border-strong) bg-(--bg-panel)">
                            <div className="flex h-9 shrink-0 items-center border-b border-(--border-strong) px-3 text-[11px] font-semibold uppercase tracking-wide text-(--fg-secondary)">
                                {t("assignation.unassignedPanelCount", { count: visibleChats.length })}
                            </div>
                            <ScrollArea className="flex-1">
                                <div className="flex flex-col gap-1 p-2">
                                    {visibleChats.map((c) => (
                                        <div key={c.id} className="rounded-md px-2 py-1.5">
                                            <div className="flex items-center gap-2">
                                                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                                                    {c.name}
                                                </span>
                                                <span className="text-[10px] tabular-nums text-(--fg-tertiary)">
                                                    {waitTimeLabel(c.lastMessageTs)}
                                                </span>
                                            </div>
                                            <div className="truncate text-xs text-(--fg-tertiary)">
                                                {c.lastMessagePreview}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </section>
                    </>
                ) : (
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-(--border-strong) bg-(--bg-panel) text-sm text-(--fg-tertiary)">
                        {t("assignation.emptyList")}
                    </div>
                )}
            </main>
        </div>
    );
}
