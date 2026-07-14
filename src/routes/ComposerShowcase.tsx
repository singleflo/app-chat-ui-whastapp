import {
    Smile,
    Plus,
    Camera,
    Mic,
    Send,
    X,
    Lock,
    FileText,
    ChevronDown,
    Trash2,
    Pin,
    Image as ImageIcon,
    MapPin,
    User,
    Slash,
    WifiOff,
    Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const WAVEFORM_BARS = [40, 60, 80, 50, 70, 90, 40, 60, 30, 50, 70, 80, 40, 60, 50, 70, 40, 30].map(
    (value, n) => ({ id: `wf${n}`, value })
);
const EMOJI_SET = [
    "😀",
    "😂",
    "🥰",
    "😍",
    "🤔",
    "😎",
    "😢",
    "😡",
    "👍",
    "👎",
    "🙏",
    "👏",
    "🤝",
    "💪",
    "🎉",
    "🔥",
];

const BTN =
    "cursor-pointer transition-all duration-200 ease-out active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel)";
const ICON_BTN =
    "cursor-pointer transition-all duration-200 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel)";

export function ComposerShowcase() {
    const { t } = useTranslation();
    return (
        <div className="h-full overflow-y-auto bg-(--bg-app) p-4 sm:p-8">
            <div className="mx-auto max-w-2xl space-y-6">
                <header>
                    <h1 className="text-2xl font-bold">{t("composer.title")}</h1>
                    <p className="mt-1 text-sm text-(--fg-secondary)">{t("composer.subtitle")}</p>
                </header>
                <StateCard
                    label={t("composer.states.defaultLabel")}
                    spec={t("composer.states.defaultSpec")}
                >
                    <DefaultComposer />
                </StateCard>
                <StateCard
                    label={t("composer.states.replyLabel")}
                    spec={t("composer.states.replySpec")}
                >
                    <ReplyComposer />
                </StateCard>
                <StateCard
                    label={t("composer.states.blockedLabel")}
                    spec={t("composer.states.blockedSpec")}
                >
                    <BlockedComposer />
                </StateCard>
                <StateCard
                    label={t("composer.states.recordingLabel")}
                    spec={t("composer.states.recordingSpec")}
                >
                    <RecordingComposer />
                </StateCard>
                <StateCard
                    label={t("composer.states.noteLabel")}
                    spec={t("composer.states.noteSpec")}
                >
                    <InternalNoteComposer />
                </StateCard>
                <StateCard
                    label={t("composer.states.attachmentsLabel")}
                    spec={t("composer.states.attachmentsSpec")}
                >
                    <AttachmentsComposer />
                </StateCard>
                <StateCard
                    label={t("composer.states.emojiLabel")}
                    spec={t("composer.states.emojiSpec")}
                >
                    <EmojiPickerComposer />
                </StateCard>
                <StateCard
                    label={t("composer.states.cannedLabel")}
                    spec={t("composer.states.cannedSpec")}
                >
                    <CannedComposer />
                </StateCard>
                <StateCard
                    label={t("composer.states.offlineLabel")}
                    spec={t("composer.states.offlineSpec")}
                >
                    <OfflineComposer />
                </StateCard>
                <StateCard
                    label={t("composer.states.iceBreakersLabel")}
                    spec={t("composer.states.iceBreakersSpec")}
                >
                    <IceBreakersComposer />
                </StateCard>
            </div>
        </div>
    );
}

function StateCard({
    label,
    spec,
    children,
}: {
    label: string;
    spec: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-(--border-strong) bg-(--bg-panel) p-4 shadow-(--shadow-panel)">
            <div className="mb-2">
                <div className="text-sm font-semibold">{label}</div>
                <div className="text-[11px] text-(--fg-tertiary)">{spec}</div>
            </div>
            <div className="rounded-lg bg-(--bg-panel-2) p-3">{children}</div>
        </div>
    );
}

function ComposerShell({ children, note }: { children: React.ReactNode; note?: boolean }) {
    return (
        <div
            className={cn(
                "rounded-lg px-2 py-1.5 shadow-(--shadow-bubble)",
                note ? "bg-(--bg-bubble-internal-note)" : "bg-(--bg-panel)"
            )}
        >
            {children}
        </div>
    );
}

function DefaultComposer() {
    const { t } = useTranslation();
    return (
        <ComposerShell>
            <div className="flex items-end gap-2">
                <IconBtn aria-label={t("composer.actions.emoji")}>
                    <Smile className="h-5 w-5" />
                </IconBtn>
                <IconBtn aria-label={t("composer.actions.attach")}>
                    <Plus className="h-5 w-5" />
                </IconBtn>
                <textarea
                    rows={1}
                    placeholder={t("composer.placeholder")}
                    defaultValue=""
                    className="max-h-24 min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm text-(--fg-primary) placeholder:text-(--fg-tertiary) focus:outline-none"
                />
                <IconBtn aria-label={t("composer.actions.camera")}>
                    <Camera className="h-5 w-5" />
                </IconBtn>
                <button
                    type="button"
                    aria-label={t("composer.actions.recordAudio")}
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) transition-all duration-200 ease-out hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
                >
                    <Mic className="h-5 w-5" />
                </button>
            </div>
        </ComposerShell>
    );
}

function ReplyComposer() {
    const { t } = useTranslation();
    return (
        <ComposerShell>
            <div className="mb-1 flex items-center gap-2 rounded-l border-l-[3px] border-(--accent) bg-(--bg-panel-2) px-2 py-1 text-[12px]">
                <div className="min-w-0 flex-1">
                    <div className="font-semibold text-(--accent)">Giulia Romano</div>
                    <div className="truncate text-(--fg-secondary)">
                        Ciao! Volevo confermare l'ordine #S00042…
                    </div>
                </div>
                <button
                    type="button"
                    aria-label={t("composer.actions.closeReply")}
                    className="cursor-pointer text-(--fg-tertiary) transition-all duration-200 ease-out hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
            <div className="flex items-end gap-2">
                <IconBtn aria-label={t("composer.actions.emoji")}>
                    <Smile className="h-5 w-5" />
                </IconBtn>
                <IconBtn aria-label={t("composer.actions.attach")}>
                    <Plus className="h-5 w-5" />
                </IconBtn>
                <textarea
                    rows={1}
                    placeholder={t("composer.placeholder")}
                    className="max-h-24 min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm focus:outline-none"
                />
                <button
                    type="button"
                    aria-label={t("composer.actions.send")}
                    className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) transition-all duration-200 ease-out hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </ComposerShell>
    );
}

function BlockedComposer() {
    const { t } = useTranslation();
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between rounded-md bg-(--bg-bubble-error) px-3 py-2 text-xs text-(--status-failed)">
                <span className="flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5" /> {t("composer.blocked.status")}
                </span>
                <button
                    type="button"
                    className={cn(
                        "flex items-center gap-1 rounded bg-(--accent) px-2 py-0.5 text-(--accent-fg) hover:bg-(--accent-hover)",
                        BTN
                    )}
                >
                    <FileText className="h-3 w-3" /> {t("composer.blocked.sendTemplate")}
                </button>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-(--bg-panel) px-3 py-2.5 opacity-50">
                <Lock className="h-4 w-4 text-(--fg-tertiary)" />
                <span className="text-sm text-(--fg-tertiary)">{t("composer.blocked.locked")}</span>
            </div>
        </div>
    );
}

function RecordingComposer() {
    const { t } = useTranslation();
    return (
        <div className="flex items-center gap-3 rounded-lg bg-(--bg-panel) px-3 py-2.5">
            <span className="text-(--status-failed)">●</span>
            <span className="font-mono text-sm tabular-nums">0:08</span>
            <div className="flex h-6 flex-1 items-center gap-0.5">
                {WAVEFORM_BARS.map((bar) => (
                    <span
                        key={bar.id}
                        className="w-0.5 rounded-full bg-(--accent)"
                        style={{ height: `${bar.value}%` }}
                    />
                ))}
            </div>
            <span className="text-[11px] text-(--fg-tertiary)">
                {t("composer.recording.slideToCancel")}
            </span>
            <button
                type="button"
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full bg-(--status-failed)/10 text-(--status-failed) hover:bg-(--status-failed)/20",
                    ICON_BTN
                )}
                aria-label={t("composer.actions.cancel")}
            >
                <Trash2 className="h-4 w-4" />
            </button>
            <button
                type="button"
                className={cn(
                    "flex items-center gap-1 rounded bg-(--bg-panel-2) px-2 py-1 text-[11px] text-(--fg-secondary) hover:bg-(--bg-hover)",
                    BTN
                )}
            >
                <Pin className="h-3 w-3" /> {t("composer.recording.lock")}
            </button>
            <button
                type="button"
                className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) hover:bg-(--accent-hover)",
                    ICON_BTN
                )}
                aria-label={t("composer.actions.send")}
            >
                <Send className="h-4 w-4" />
            </button>
        </div>
    );
}

function InternalNoteComposer() {
    const { t } = useTranslation();
    const [tab, setTab] = useState<"message" | "note">("note");
    return (
        <ComposerShell note={tab === "note"}>
            <div className="mb-1 flex gap-1 border-b border-(--border-soft) pb-1">
                <button
                    type="button"
                    onClick={() => setTab("message")}
                    aria-pressed={tab === "message"}
                    className={cn(
                        "rounded-md px-3 py-1 text-xs font-medium",
                        BTN,
                        tab === "message"
                            ? "bg-(--bg-panel) text-(--fg-primary)"
                            : "text-(--fg-tertiary) hover:bg-(--bg-hover)"
                    )}
                >
                    {t("composer.note.tabMessage")}
                </button>
                <button
                    type="button"
                    onClick={() => setTab("note")}
                    aria-pressed={tab === "note"}
                    className={cn(
                        "rounded-md px-3 py-1 text-xs font-medium",
                        BTN,
                        tab === "note"
                            ? "bg-(--fg-warning)/20 text-(--fg-warning)"
                            : "text-(--fg-tertiary) hover:bg-(--bg-hover)"
                    )}
                >
                    {t("composer.note.tabNote")}
                </button>
            </div>
            <div className="flex items-end gap-2">
                <IconBtn>
                    <Smile className="h-5 w-5" />
                </IconBtn>
                <textarea
                    rows={1}
                    placeholder={
                        tab === "note" ? t("composer.note.placeholder") : t("composer.placeholder")
                    }
                    className="max-h-24 min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm focus:outline-none"
                />
                <button
                    type="button"
                    aria-label={t("composer.actions.send")}
                    className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) hover:bg-(--accent-hover)",
                        ICON_BTN
                    )}
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
            {tab === "note" && (
                <div className="mt-1 text-[11px] text-(--fg-warning) italic">
                    {t("composer.note.disclaimer")}
                </div>
            )}
        </ComposerShell>
    );
}

function AttachmentsComposer() {
    const { t } = useTranslation();
    return (
        <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-(--bg-panel) p-3">
                {[
                    { icon: ImageIcon, key: "photoVideo", color: "var(--accent)" },
                    { icon: Camera, key: "camera", color: "var(--fg-link)" },
                    { icon: FileText, key: "document", color: "var(--fg-warning)" },
                    { icon: User, key: "contact", color: "var(--accent)" },
                    { icon: MapPin, key: "location", color: "var(--fg-link)" },
                    { icon: Pin, key: "locationRequest", color: "var(--fg-warning)" },
                ].map((item) => (
                    <button
                        key={item.key}
                        type="button"
                        className={cn(
                            "flex flex-col items-center gap-1.5 rounded-lg p-2 hover:bg-(--bg-hover)",
                            BTN
                        )}
                    >
                        <div
                            className="flex h-10 w-10 items-center justify-center rounded-full"
                            style={{
                                backgroundColor: `color-mix(in srgb, ${item.color} 15%, transparent)`,
                                color: item.color,
                            }}
                        >
                            <item.icon className="h-5 w-5" />
                        </div>
                        <span className="text-[11px] text-(--fg-secondary)">
                            {t(`composer.attachments.${item.key}`)}
                        </span>
                    </button>
                ))}
            </div>
            <ComposerShell>
                <div className="flex items-end gap-2">
                    <IconBtn aria-label={t("composer.actions.closeAttachments")}>
                        <ChevronDown className="h-5 w-5 rotate-45" />
                    </IconBtn>
                    <textarea
                        rows={1}
                        placeholder={t("composer.placeholder")}
                        className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm focus:outline-none"
                    />
                    <button
                        type="button"
                        aria-label={t("composer.actions.recordAudio")}
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) hover:bg-(--accent-hover)",
                            ICON_BTN
                        )}
                    >
                        <Mic className="h-5 w-5" />
                    </button>
                </div>
            </ComposerShell>
        </div>
    );
}

function EmojiPickerComposer() {
    const { t } = useTranslation();
    return (
        <div className="space-y-2">
            <div className="rounded-lg bg-(--bg-panel) p-2 shadow-(--shadow-bubble)">
                <div className="mb-2 flex items-center gap-2 rounded-md bg-(--bg-panel-2) px-2 py-1">
                    <Smile className="h-3.5 w-3.5 text-(--fg-tertiary)" />
                    <input
                        type="text"
                        placeholder={t("composer.emoji.searchPlaceholder")}
                        className="flex-1 bg-transparent text-xs focus:outline-none"
                    />
                    <span className="text-[11px] text-(--fg-tertiary)">🖐️</span>
                </div>
                <div className="flex gap-1 border-b border-(--border-soft) pb-1 text-[11px]">
                    <button
                        type="button"
                        aria-label={t("composer.emoji.ariaRecent")}
                        className={cn("rounded bg-(--bg-hover) px-1.5 py-0.5 text-(--accent)", BTN)}
                    >
                        {t("composer.emoji.recent")}
                    </button>
                    <button
                        type="button"
                        aria-label={t("composer.emoji.categorySmileys")}
                        className={cn(
                            "rounded px-1.5 py-0.5 text-(--fg-tertiary) hover:bg-(--bg-hover)",
                            BTN
                        )}
                    >
                        😎
                    </button>
                    <button
                        type="button"
                        aria-label={t("composer.emoji.categoryAnimals")}
                        className={cn(
                            "rounded px-1.5 py-0.5 text-(--fg-tertiary) hover:bg-(--bg-hover)",
                            BTN
                        )}
                    >
                        🐻
                    </button>
                    <button
                        type="button"
                        aria-label={t("composer.emoji.categoryFood")}
                        className={cn(
                            "rounded px-1.5 py-0.5 text-(--fg-tertiary) hover:bg-(--bg-hover)",
                            BTN
                        )}
                    >
                        🍔
                    </button>
                    <button
                        type="button"
                        aria-label={t("composer.emoji.categorySport")}
                        className={cn(
                            "rounded px-1.5 py-0.5 text-(--fg-tertiary) hover:bg-(--bg-hover)",
                            BTN
                        )}
                    >
                        ⚽
                    </button>
                    <button
                        type="button"
                        aria-label={t("composer.emoji.categoryObjects")}
                        className={cn(
                            "rounded px-1.5 py-0.5 text-(--fg-tertiary) hover:bg-(--bg-hover)",
                            BTN
                        )}
                    >
                        💡
                    </button>
                </div>
                <div className="grid grid-cols-8 gap-0.5 pt-1.5 text-lg">
                    {EMOJI_SET.map((e) => (
                        <button
                            key={e}
                            type="button"
                            aria-label={t("composer.emoji.ariaEmoji", { emoji: e })}
                            className={cn("rounded p-1 hover:bg-(--bg-hover)", ICON_BTN)}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </div>
            <ComposerShell>
                <div className="flex items-end gap-2">
                    <IconBtn aria-label={t("composer.actions.commands")}>
                        <Slash className="h-5 w-5" />
                    </IconBtn>
                    <textarea
                        rows={1}
                        placeholder={t("composer.placeholder")}
                        className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm focus:outline-none"
                    />
                    <button
                        type="button"
                        aria-label={t("composer.actions.recordAudio")}
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) hover:bg-(--accent-hover)",
                            ICON_BTN
                        )}
                    >
                        <Mic className="h-5 w-5" />
                    </button>
                </div>
            </ComposerShell>
        </div>
    );
}

function CannedComposer() {
    const { t } = useTranslation();
    return (
        <div className="space-y-2">
            <div className="rounded-lg bg-(--bg-panel) p-2 shadow-(--shadow-bubble)">
                <div className="mb-1.5 text-[11px] tracking-wide text-(--fg-tertiary) uppercase">
                    {t("composer.canned.title")}
                </div>
                {[
                    { title: "/saluto", body: "Ciao {{nome}}! Come posso aiutarti?" },
                    {
                        title: "/spedizione",
                        body: "Il tuo ordine {{numero}} sarà spedito entro 24h.",
                    },
                    { title: "/orari", body: "Siamo aperti lun–ven 9:00–18:00." },
                ].map((c) => (
                    <button
                        key={c.title}
                        type="button"
                        className={cn(
                            "block w-full rounded-md px-2 py-1.5 text-left hover:bg-(--bg-hover)",
                            BTN
                        )}
                    >
                        <div className="text-xs font-medium text-(--accent)">{c.title}</div>
                        <div className="truncate text-[11px] text-(--fg-secondary)">{c.body}</div>
                    </button>
                ))}
            </div>
            <ComposerShell>
                <div className="flex items-end gap-2">
                    <IconBtn aria-label={t("composer.actions.commands")}>
                        <Slash className="h-5 w-5 text-(--accent)" />
                    </IconBtn>
                    <textarea
                        rows={1}
                        defaultValue="/"
                        className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm text-(--accent) focus:outline-none"
                    />
                    <button
                        type="button"
                        aria-label={t("composer.actions.recordAudio")}
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) hover:bg-(--accent-hover)",
                            ICON_BTN
                        )}
                    >
                        <Mic className="h-5 w-5" />
                    </button>
                </div>
            </ComposerShell>
        </div>
    );
}

function OfflineComposer() {
    const { t } = useTranslation();
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-md bg-(--bg-bubble-system) px-3 py-1.5 text-xs text-(--fg-secondary)">
                <WifiOff className="h-3.5 w-3.5" /> {t("composer.offline.queued", { count: 1 })}
            </div>
            <ComposerShell>
                <div className="flex items-end gap-2">
                    <IconBtn>
                        <Smile className="h-5 w-5" />
                    </IconBtn>
                    <IconBtn>
                        <Plus className="h-5 w-5" />
                    </IconBtn>
                    <textarea
                        rows={1}
                        placeholder={t("composer.placeholder")}
                        className="min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm focus:outline-none"
                    />
                    <button
                        type="button"
                        aria-label={t("composer.actions.send")}
                        className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) hover:bg-(--accent-hover)",
                            ICON_BTN
                        )}
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
            </ComposerShell>
        </div>
    );
}

function IceBreakersComposer() {
    const { t } = useTranslation();
    return (
        <div className="flex flex-wrap gap-2">
            {["catalog", "appointment", "operator", "location", "faq"].map((key) => (
                <button
                    key={key}
                    type="button"
                    className={cn(
                        "flex items-center gap-1.5 rounded-full border border-(--accent) bg-(--accent-soft) px-3 py-1.5 text-xs font-medium text-(--accent) hover:bg-(--accent) hover:text-(--accent-fg)",
                        BTN
                    )}
                >
                    <Sparkles className="h-3 w-3" /> {t(`composer.iceBreakers.${key}`)}
                </button>
            ))}
        </div>
    );
}

function IconBtn({
    children,
    "aria-label": ariaLabel,
}: {
    children: React.ReactNode;
    "aria-label"?: string;
}) {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-(--fg-secondary) transition-all duration-200 ease-out hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
        >
            {children}
        </button>
    );
}
