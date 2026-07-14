import { Check, CheckCheck, AlertTriangle, Bot, Smartphone, Zap, Settings } from "lucide-react";
import type { ReactNode } from "react";
import type { AckStatus, Message, SenderAttribution } from "@/types/chat";
import { cn, fmtTime, initials } from "@/lib/utils";

export type BubbleTone = "default" | "note" | "error" | "fallback" | "deleted" | "bot";

export function AckIcon({ status }: { status?: AckStatus }) {
    if (status === "failed") return <span className="text-[var(--status-failed)]">✗</span>;
    if (status === "pending" || status === "composing")
        return <span className="text-[var(--fg-tertiary)]">⏱</span>;
    if (status === "sent") return <Check className="h-3.5 w-3.5 text-[var(--fg-tertiary)]" />;
    if (status === "delivered")
        return <CheckCheck className="h-3.5 w-3.5 text-[var(--fg-tertiary)]" />;
    if (status === "read" || status === "played")
        return <CheckCheck className="h-3.5 w-3.5" style={{ color: "var(--color-ack-blue)" }} />;
    return null;
}

export function SenderTag({ sender }: { sender?: SenderAttribution }) {
    if (!sender) return null;
    return (
        <div className="mb-1 flex items-center gap-1 text-[11px] font-semibold" style={{ color: sender.color }}>
            <span>{sender.name}</span>
            {sender.kind === "bot" && (
                <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full" style={{ backgroundColor: sender.color }}>
                    <Bot className="h-2 w-2 text-white" />
                </span>
            )}
            {sender.kind === "automation" && <Zap className="h-3 w-3" />}
            {sender.kind === "api" && sender.source && (
                <span className="rounded bg-black/10 px-1 text-[9px] opacity-70">📱 {sender.source}</span>
            )}
        </div>
    );
}

export function SenderAvatar({ sender, size = 28 }: { sender: SenderAttribution; size?: number }) {
    const style: React.CSSProperties = {
        width: size,
        height: size,
        fontSize: size * 0.36,
    };

    if (sender.kind === "bot") {
        return (
            <div
                className="flex shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                style={{ ...style, backgroundColor: sender.color }}
                title={sender.name}
            >
                <Bot className="h-3.5 w-3.5" />
            </div>
        );
    }

    if (sender.kind === "system") {
        return (
            <div
                className="flex shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                style={{ ...style, backgroundColor: sender.color }}
                title={sender.name}
            >
                <Settings className="h-3.5 w-3.5" />
            </div>
        );
    }

    if (sender.kind === "api") {
        return (
            <div
                className="flex shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                style={{ ...style, backgroundColor: sender.color }}
                title={sender.name}
            >
                <Smartphone className="h-3.5 w-3.5" />
            </div>
        );
    }

    if (sender.kind === "automation") {
        return (
            <div
                className="flex shrink-0 items-center justify-center rounded-full text-white shadow-sm"
                style={{ ...style, backgroundColor: sender.color }}
                title={sender.name}
            >
                <Zap className="h-3.5 w-3.5" />
            </div>
        );
    }

    return (
        <div
            className="flex shrink-0 items-center justify-center rounded-full font-medium text-white shadow-sm"
            style={{ ...style, backgroundColor: sender.color }}
            title={sender.name}
        >
            {initials(sender.name.replace("📝 ", "").replace("· bot", "").trim())}
        </div>
    );
}

export function ForwardedLabel({ frequently }: { frequently?: boolean }) {
    return (
        <div className="mb-1 flex items-center gap-1 text-[10px] italic text-[var(--fg-secondary)]">
            <span>↪</span> {frequently ? "Inoltrato molte volte" : "Inoltrato"}
        </div>
    );
}

export function Bubble({
    side,
    tone = "default",
    isStartOfGroup = true,
    hasReactions = false,
    className,
    children,
}: {
    side: "in" | "out";
    tone?: BubbleTone;
    isStartOfGroup?: boolean;
    hasReactions?: boolean;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div
            className={cn(
                "group relative max-w-[78%] rounded-[10px] px-2 py-1.5 text-sm shadow-[var(--shadow-bubble)] transition-shadow duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:shadow-[var(--shadow-md)]",
                side === "in"
                    ? "self-start animate-bubble-in bg-[var(--bg-bubble-in)]"
                    : "self-end animate-bubble-out bg-[var(--bg-bubble-out)]",
                tone === "note" && "self-end bg-[var(--bg-bubble-internal-note)] border border-[var(--fg-warning)]/40",
                tone === "error" && "self-end bg-[var(--bg-bubble-error)]",
                tone === "fallback" && "self-end bg-[var(--bg-bubble-fallback)]",
                tone === "deleted" && "self-start bg-[var(--bg-bubble-deleted)]",
                tone === "bot" && "self-end bg-[var(--bg-bubble-bot)] bot-bubble-pattern border border-[var(--fg-link)]/20",
                side === "in" && isStartOfGroup && "rounded-tl-[2px]",
                side === "out" && isStartOfGroup && "rounded-tr-[2px]",
                hasReactions && "mb-3",
                className
            )}
        >
            {children}
        </div>
    );
}

export function BubbleMeta({ ts, ack, edited }: { ts?: string; ack?: AckStatus; edited?: boolean }) {
    return (
        <div className="float-right ml-2 mt-1 flex items-center gap-1 text-[10px] text-[var(--fg-tertiary)] clear-both">
            {edited && <span className="italic">modificato</span>}
            {ts && <span>{fmtTime(ts)}</span>}
            <AckIcon status={ack} />
        </div>
    );
}

export function Reactions({ reactions }: { reactions?: Message["reactions"] }) {
    if (!reactions || reactions.length === 0) return null;
    return (
        <div className="absolute -bottom-2.5 right-2 z-10 flex gap-0.5">
            {reactions.map((r) => (
                <span
                    key={r.emoji}
                    className={cn(
                        "flex items-center gap-0.5 rounded-full border px-1.5 py-0.5 text-[10px] shadow-sm",
                        r.mine
                            ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                            : "border-[var(--border-strong)] bg-[var(--bg-panel)]"
                    )}
                    title={r.by.join(", ")}
                >
                    <span>{r.emoji}</span>
                    {r.count > 1 && <span>{r.count}</span>}
                </span>
            ))}
        </div>
    );
}

export function QuotedBlock({
    authorName,
    authorColor,
    excerpt,
    media,
}: {
    authorName: string;
    authorColor: string;
    excerpt: string;
    media?: { kind: string; label: string };
}) {
    return (
        <div
            className="mb-1.5 rounded-l border-l-[3px] px-2 py-1 text-[12px]"
            style={{
                borderColor: authorColor,
                backgroundColor: `color-mix(in srgb, ${authorColor} 15%, var(--bg-panel-2))`,
            }}
        >
            <div className="font-semibold" style={{ color: authorColor }}>
                {authorName}
            </div>
            <div className="truncate text-[var(--fg-secondary)]">
                {media ? (
                    <>
                        <span className="mr-1">{mediaIcon(media.kind)}</span>
                        {media.label}
                    </>
                ) : (
                    excerpt
                )}
            </div>
        </div>
    );
}

export function UnsupportedWarning() {
    return (
        <div className="flex items-center gap-1 text-[11px] text-[var(--fg-warning)]">
            <AlertTriangle className="h-3 w-3" /> Non supportato
        </div>
    );
}

function mediaIcon(kind: string) {
    switch (kind) {
        case "image": return "📷";
        case "video": return "🎥";
        case "audio": return "🎤";
        case "document": return "📄";
        default: return "📎";
    }
}
