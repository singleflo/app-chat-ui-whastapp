import {
    ArrowLeft,
    Phone,
    Video,
    Search,
    MoreVertical,
    Smile,
    Plus,
    Camera,
    Send,
    FileText,
    Check,
    CheckCheck,
    Clock,
    Bot,
    X,
    Pin,
    ChevronUp,
    Info,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, colorFromString, initials } from "@/lib/utils";
import { useConversation } from "@/data/chat-data";
import { MessageList } from "./MessageList";

const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel)";
const iconBtn = `cursor-pointer transition-all duration-200 ease-out active:scale-[0.97] ${focusRing}`;
const actionBtn = `cursor-pointer transition-all duration-200 ease-out active:scale-95 ${focusRing}`;

interface Props {
    conversationId?: string;
    readonly?: boolean;
    onBack?: () => void;
    onOpenContext?: () => void;
    contextCollapsed?: boolean;
}

const DEFAULT_CONV = "c1";

export function ChatColumnShell({
    conversationId = DEFAULT_CONV,
    readonly = false,
    onBack,
    onOpenContext,
    contextCollapsed,
}: Props) {
    const { t } = useTranslation();
    const conv = useConversation(conversationId);

    return (
        <div className="flex h-full flex-col">
            <ChatHeader
                conv={conv}
                onBack={onBack}
                onOpenContext={onOpenContext}
                showContextBtn={contextCollapsed}
            />
            <WindowBadgeBar conv={conv} />
            {conv?.isBotActive && (
                <BotBanner agentName={conv.botAgentName ?? t("chat.bot.defaultAgent")} />
            )}
            <PinnedMessagesBar />
            {conv?.linkedRecords && conv.linkedRecords.length > 0 && <RecordChipsBar conv={conv} />}
            <TeamPresenceBar />

            <MessageList conversationId={conversationId} />

            {!readonly && <ComposerShell conv={conv} />}
            {readonly && <ReadonlyComposerHint />}
        </div>
    );
}

/* ---------------- HEADER (A/R3) ---------------- */
function ChatHeader({
    conv,
    onBack,
    onOpenContext,
    showContextBtn,
}: {
    conv: ReturnType<typeof useConversation>;
    onBack?: () => void;
    onOpenContext?: () => void;
    showContextBtn?: boolean;
}) {
    const { t } = useTranslation();
    const name = conv?.name ?? "—";
    const phone = conv?.phone ?? "";
    return (
        <header className="flex h-14 shrink-0 items-center gap-2 overflow-hidden border-b border-(--border-strong) bg-(--bg-header) px-3">
            {onBack && (
                <button
                    type="button"
                    onClick={onBack}
                    className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-(--fg-secondary) hover:bg-(--bg-hover)",
                        iconBtn
                    )}
                    aria-label={t("chat.header.back")}
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
            )}
            <button
                type="button"
                onClick={onOpenContext}
                className={cn(
                    "flex min-w-0 flex-1 items-center gap-2.5 overflow-hidden rounded-lg text-left",
                    actionBtn
                )}
                aria-label={t("chat.header.openContext", { name })}
            >
                <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback
                        style={{ backgroundColor: conv?.avatarColor ?? colorFromString(name) }}
                    >
                        {initials(name)}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0 overflow-hidden">
                    <div className="truncate text-sm font-semibold">
                        {name}
                        {conv?.type === "group" && (
                            <span className="ml-1 text-[11px] font-normal text-(--fg-tertiary)">
                                {t("chat.header.participants", { n: conv.groupParticipants })}
                            </span>
                        )}
                    </div>
                    <div className="truncate text-[11px] text-(--fg-tertiary)">
                        {conv?.typing === "text"
                            ? t("chat.status.typing")
                            : conv?.typing === "audio"
                              ? t("chat.status.recordingAudio")
                              : t("chat.status.online", { phone })}
                    </div>
                </div>
            </button>
            <div className="flex shrink-0 items-center gap-0.5">
                <HeaderIcon label={t("chat.header.videoCall")}>
                    <Video className="h-4 w-4" />
                </HeaderIcon>
                <HeaderIcon label={t("chat.header.call")}>
                    <Phone className="h-4 w-4" />
                </HeaderIcon>
                <HeaderIcon label={t("chat.header.searchInChat")}>
                    <Search className="h-4 w-4" />
                </HeaderIcon>
                <HeaderIcon label={t("chat.header.moreOptions")}>
                    <MoreVertical className="h-4 w-4" />
                </HeaderIcon>
                {showContextBtn && (
                    <button
                        type="button"
                        onClick={onOpenContext}
                        className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full text-(--accent) hover:bg-(--bg-hover)",
                            iconBtn
                        )}
                        aria-label={t("chat.header.showContext")}
                    >
                        <Info className="h-4 w-4" />
                    </button>
                )}
            </div>
        </header>
    );
}

function HeaderIcon({ children, label }: { children: React.ReactNode; label?: string }) {
    return (
        <button
            type="button"
            aria-label={label}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--fg-secondary) transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
        >
            {children}
        </button>
    );
}

/* ---------------- WINDOW BADGE BAR (D5) ---------------- */
function WindowBadgeBar({ conv }: { conv: ReturnType<typeof useConversation> }) {
    const { t } = useTranslation();
    return (
        <div className="flex shrink-0 flex-wrap items-center justify-center gap-2 border-b border-(--border-soft) bg-(--bg-panel) px-3 py-1.5">
            {conv?.windowClosed ? (
                <Badge
                    variant="outline"
                    className="gap-1 border-(--window-closed) text-(--window-closed)"
                >
                    <Clock className="h-3 w-3" /> {t("chat.window.closedTemplateOnly")}
                </Badge>
            ) : (
                <Badge
                    variant="outline"
                    className="gap-1 border-(--window-open) text-(--window-open)"
                >
                    <Clock className="h-3 w-3" /> {t("chat.window.open")}
                </Badge>
            )}
            <AssignmentWidget conv={conv} />
            {conv?.officeHours && !conv.officeHours.active && (
                <Badge
                    variant="outline"
                    className="gap-1 border-(--window-warning) text-(--window-warning)"
                >
                    {t("chat.window.outsideHours")}
                </Badge>
            )}
        </div>
    );
}

function AssignmentWidget({ conv }: { conv: ReturnType<typeof useConversation> }) {
    const { t } = useTranslation();
    if (!conv) return null;
    if (conv.unassigned) {
        return (
            <Badge variant="outline" className="gap-1 border-(--unassigned) text-(--unassigned)">
                <span className="h-1.5 w-1.5 rounded-full bg-(--unassigned)" />{" "}
                {t("chat.assignment.unassigned")}
            </Badge>
        );
    }
    if (conv.assignedUserId) {
        const user =
            conv.assignedUserId === "u_laura"
                ? "Laura B."
                : conv.assignedUserId === "u_marco"
                  ? "Marco R."
                  : conv.assignedUserId;
        return (
            <Badge
                variant="outline"
                className="gap-1 border-(--assigned-other) text-(--assigned-other)"
            >
                <Avatar className="h-4 w-4">
                    <AvatarFallback style={{ backgroundColor: colorFromString(user), fontSize: 8 }}>
                        {initials(user)}
                    </AvatarFallback>
                </Avatar>
                {user}
            </Badge>
        );
    }
    return null;
}

/* ---------------- BOT BANNER (Q5) ---------------- */
function BotBanner({ agentName }: { agentName: string }) {
    const { t } = useTranslation();
    return (
        <div className="flex shrink-0 items-center justify-between gap-2 bg-(--bg-bubble-bot) px-3 py-1.5 text-xs text-(--fg-primary)">
            <span className="flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5 text-(--fg-link)" />
                <strong>{agentName}</strong> {t("chat.bot.managing")}
            </span>
            <button
                type="button"
                className={cn(
                    "rounded-md bg-(--accent) px-2 py-0.5 text-[10px] font-semibold text-(--accent-fg)",
                    actionBtn
                )}
            >
                {t("chat.bot.takeOver")}
            </button>
        </div>
    );
}

/* ---------------- PINNED BAR (C) ---------------- */
function PinnedMessagesBar() {
    const { t } = useTranslation();
    return (
        <div className="flex shrink-0 items-center gap-2 border-b border-(--border-soft) bg-(--bg-panel) px-3 py-1.5 text-[11px] text-(--fg-secondary)">
            <Pin className="h-3 w-3 text-(--fg-tertiary)" />
            <span className="truncate">{t("chat.pinned.sample")}</span>
            <button
                type="button"
                className={cn("ml-auto flex items-center justify-center rounded-full", iconBtn)}
                aria-label={t("chat.pinned.next")}
            >
                <ChevronUp className="h-3 w-3" />
            </button>
        </div>
    );
}

/* ---------------- RECORD CHIPS (Q7) ---------------- */
function RecordChipsBar({ conv }: { conv: NonNullable<ReturnType<typeof useConversation>> }) {
    const { t } = useTranslation();
    return (
        <div className="flex shrink-0 items-center gap-1.5 px-3 py-1 text-[10px] text-(--fg-secondary)">
            <span className="opacity-60">{t("chat.records.linked")}</span>
            {conv.linkedRecords?.map((r) => (
                <span
                    key={`${r.kind}-${r.id}`}
                    className="rounded-full border border-(--border-strong) px-1.5 py-0.5"
                >
                    {r.kind === "lead" && "🎯"}
                    {r.kind === "order" && "🧾"}
                    {r.kind === "ticket" && "🎫"} {r.kind} #{r.id}
                </span>
            ))}
        </div>
    );
}

/* ---------------- TEAM PRESENCE (Q10) ---------------- */
function TeamPresenceBar() {
    const { t } = useTranslation();
    return (
        <div className="flex shrink-0 items-center gap-1.5 px-3 py-0.5 text-[10px] text-(--fg-tertiary)">
            <div className="flex -space-x-1">
                <Avatar className="h-4 w-4 border border-(--bg-panel)">
                    <AvatarFallback
                        style={{ backgroundColor: colorFromString("Laura B"), fontSize: 7 }}
                    >
                        LB
                    </AvatarFallback>
                </Avatar>
                <Avatar className="h-4 w-4 border border-(--bg-panel)">
                    <AvatarFallback
                        style={{ backgroundColor: colorFromString("Marco R"), fontSize: 7 }}
                    >
                        MR
                    </AvatarFallback>
                </Avatar>
            </div>
            {t("chat.team.typing", { name: "Laura" })}
        </div>
    );
}

/* ---------------- COMPOSER (R5/E1-E11) ---------------- */
function ComposerShell({ conv }: { conv: ReturnType<typeof useConversation> }) {
    const { t } = useTranslation();
    const isWindowClosed = conv?.windowClosed;
    return (
        <div className="shrink-0 bg-(--bg-panel-2) px-3 py-2">
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
                <ComposerIcon label={t("chat.composer.emoji")}>
                    <Smile className="h-5 w-5" />
                </ComposerIcon>
                <ComposerIcon label={t("chat.composer.attachments")}>
                    <Plus className="h-5 w-5" />
                </ComposerIcon>
                <ComposerIcon label={t("chat.composer.template")} highlight>
                    <FileText className="h-5 w-5" />
                </ComposerIcon>
                <textarea
                    rows={1}
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
                    className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) hover:scale-105",
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

function ComposerIcon({
    children,
    label,
    highlight,
}: {
    children: React.ReactNode;
    label?: string;
    highlight?: boolean;
}) {
    return (
        <button
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
        >
            {children}
        </button>
    );
}

function ReadonlyComposerHint() {
    const { t } = useTranslation();
    return (
        <div className="flex shrink-0 items-center justify-center gap-2 border-t border-(--border-strong) bg-(--bg-panel-2) px-3 py-2 text-xs text-(--fg-tertiary)">
            <X className="h-3 w-3" /> {t("chat.readonly.hint")}
        </div>
    );
}

export { Check, CheckCheck };
