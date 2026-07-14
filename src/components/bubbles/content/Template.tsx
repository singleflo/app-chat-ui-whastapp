import { useEffect, useState } from "react";
import { Gift, Copy, Check } from "lucide-react";
import type { MessageContent } from "@/types/chat";
import { Markdown } from "../Markdown";
import { MediaPlaceholder } from "./Media";
import { TemplateButtonRow } from "./Interactive";

type TemplateContentPayload = Extract<MessageContent, { kind: "template" }>;

export function TemplateContent({ template }: { template: TemplateContentPayload }) {
    const [copied, setCopied] = useState(false);
    const lto = template.limitedTimeOffer;
    const otp = template.otp;

    const handleCopyCode = (code: string) => {
        try {
            navigator.clipboard?.writeText(code);
        } catch {
            // mockup
        }
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className="relative flex w-[280px] max-w-full max-w-[340px] flex-col gap-1.5">
            <TemplateBadge name={template.name} language={template.language} />

            {template.header?.image && (
                <MediaPlaceholder url={template.header.image} className="aspect-video w-full rounded-md" />
            )}
            {template.header?.text && (
                <div className="flex items-center gap-1.5 text-[14px] font-semibold">
                    {lto && <Gift className="h-4 w-4 text-[var(--fg-warning)]" />}
                    {template.header.text}
                </div>
            )}

            {otp && (
                <div className="rounded-md bg-[var(--bg-panel-2)] py-1.5 text-center font-mono text-2xl tracking-widest text-[var(--accent)]">
                    {otp.code}
                </div>
            )}
            {!otp && (
                <div className="text-[13px]">
                    <Markdown text={template.body} />
                </div>
            )}

            {template.footer && (
                <div className="text-[10px] text-[var(--fg-tertiary)]">{template.footer}</div>
            )}

            {lto && (
                <LtoBanner code={lto.code} expiresAt={lto.expiresAt} expired={lto.expired} onCopy={handleCopyCode} copied={copied} />
            )}

            {template.buttons && template.buttons.length > 0 && (
                <div className="mt-1 flex flex-col divide-y divide-[var(--border-strong)] border-t border-[var(--border-strong)]">
                    {template.buttons.slice(0, 3).map((b) => (
                        <TemplateButtonRow key={`tb-${b.kind}-${b.title}`} button={b} />
                    ))}
                    {template.buttons.length > 3 && (
                        <button type="button" className="py-1.5 text-[12px] font-medium text-[var(--accent)]">
                            Vedi tutte le opzioni ({template.buttons.length})
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

function TemplateBadge({ name, language }: { name: string; language: string }) {
    return (
        <div className="flex items-center gap-1 text-[10px] text-[var(--fg-tertiary)]">
            <span className="rounded bg-[var(--bg-panel-2)] px-1 py-0.5">
                Template · {name} · {language}
            </span>
        </div>
    );
}

function LtoBanner({
    code,
    expiresAt,
    expired,
    onCopy,
    copied,
}: {
    code: string;
    expiresAt: string;
    expired?: boolean;
    onCopy: (c: string) => void;
    copied: boolean;
}) {
    const remaining = useCountdown(expiresAt);
    if (expired) {
        return <div className="rounded-md bg-[var(--bg-bubble-error)] px-2 py-1 text-[11px] text-[var(--status-failed)]">Offerta scaduta</div>;
    }
    return (
        <div className="flex items-center justify-between gap-2 rounded-md bg-[var(--bg-bubble-automation)] px-2 py-1">
            <div className="text-[11px]">
                <div className="font-semibold text-[var(--fg-warning)]">⏰ Scade tra</div>
                <div className="font-mono tabular-nums">{formatRemaining(remaining)}</div>
            </div>
            <button
                type="button"
                onClick={() => onCopy(code)}
                className="flex items-center gap-1 rounded border border-[var(--border-strong)] px-2 py-0.5 text-[11px] font-medium"
            >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {code}
            </button>
        </div>
    );
}

function useCountdown(expiresAt: string) {
    const target = new Date(expiresAt).getTime();
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(id);
    }, []);
    return Math.max(0, target - now);
}

function formatRemaining(ms: number) {
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
