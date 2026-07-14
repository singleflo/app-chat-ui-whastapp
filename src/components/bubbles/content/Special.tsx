import { Trash2, Edit3, AlertTriangle, Copy } from "lucide-react";
import type { Message } from "@/types/chat";

export function DeletedContent({ message }: { message: Message }) {
    void message;
    return (
        <div className="flex items-center gap-1.5 px-1 py-0.5 text-[12px] italic text-[var(--fg-tertiary)]">
            <Trash2 className="h-3 w-3" /> Questo messaggio è stato eliminato
        </div>
    );
}

export function EditedContent({ message }: { message: Message }) {
    void message;
    return (
        <div className="flex items-center gap-1.5 px-1 py-0.5 text-[11px] italic text-[var(--fg-tertiary)]">
            <Edit3 className="h-3 w-3" /> modificato
        </div>
    );
}

export function FallbackContent({ message }: { message: Message }) {
    const content = message.content;
    if (content.kind !== "fallback") return null;
    const raw = JSON.stringify(content.payload ?? {}, null, 2);
    const handleCopy = () => {
        try {
            navigator.clipboard?.writeText(raw);
        } catch {
            // mockup
        }
    };
    return (
        <div className="flex w-[220px] max-w-full flex-col gap-1.5 rounded-md bg-[var(--bg-bubble-fallback)] p-2">
            <div className="flex items-center gap-1.5 text-[12px] text-[var(--fg-warning)]">
                <AlertTriangle className="h-3.5 w-3.5" /> Tipo non supportato
            </div>
            <div className="text-[10px] text-[var(--fg-tertiary)]">
                raw type: <code className="font-mono">{content.rawType}</code>
            </div>
            <pre className="max-h-24 overflow-auto rounded bg-black/10 p-1.5 font-mono text-[10px]">{raw}</pre>
            <button
                type="button"
                onClick={handleCopy}
                className="flex items-center justify-center gap-1 self-start rounded border border-[var(--border-strong)] px-2 py-0.5 text-[10px] hover:bg-[var(--bg-hover)]"
            >
                <Copy className="h-3 w-3" /> Copia payload
            </button>
        </div>
    );
}
