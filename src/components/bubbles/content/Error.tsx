import { AlertTriangle, RefreshCw, FileText } from "lucide-react";
import type { Message } from "@/types/chat";

export function ErrorContent({ message }: { message: Message }) {
    const content = message.content;
    if (content.kind !== "error") return null;
    return (
        <div className="flex w-[240px] max-w-full flex-col gap-1.5 rounded-md bg-[var(--bg-bubble-error)] p-2">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--status-failed)]">
                <AlertTriangle className="h-4 w-4" /> Errore {content.code}
            </div>
            <div className="text-[12px] text-[var(--fg-primary)]">{content.title}</div>
            {content.details && (
                <details className="text-[11px] text-[var(--fg-secondary)]">
                    <summary className="cursor-pointer">Dettagli tecnici</summary>
                    <pre className="mt-1 whitespace-pre-wrap rounded bg-black/10 p-1.5 font-mono text-[10px]">
                        {content.details}
                    </pre>
                </details>
            )}
            {content.actions && (
                <div className="mt-1 flex flex-wrap gap-1.5">
                    {content.actions.map((a) => (
                        <button
                            key={a.id}
                            type="button"
                            className={
                                "flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium " +
                                (a.variant === "primary"
                                    ? "bg-[var(--accent)] text-[var(--accent-fg)]"
                                    : "border border-[var(--border-strong)]")
                            }
                        >
                            {a.id === "retry" && <RefreshCw className="h-3 w-3" />}
                            {a.id === "template" && <FileText className="h-3 w-3" />}
                            {a.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
