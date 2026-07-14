import { AlertTriangle, RefreshCw, FileText } from "lucide-react";
import type { Message } from "@/types/chat";

export function ErrorContent({ message }: { message: Message }) {
    const content = message.content;
    if (content.kind !== "error") return null;
    return (
        <div className="flex w-[240px] max-w-full flex-col gap-1.5 rounded-md bg-(--bg-bubble-error) p-2">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-(--status-failed)">
                <AlertTriangle className="h-4 w-4" /> Errore {content.code}
            </div>
            <div className="text-[12px] text-(--fg-primary)">{content.title}</div>
            {content.details && (
                <details className="text-[11px] text-(--fg-secondary)">
                    <summary className="cursor-pointer">Dettagli tecnici</summary>
                    <pre className="mt-1 rounded bg-black/10 p-1.5 font-mono text-[10px] whitespace-pre-wrap">
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
                                "flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95 " +
                                (a.variant === "primary"
                                    ? "bg-(--accent) text-(--accent-fg) hover:bg-(--accent-hover)"
                                    : "border border-(--border-strong) hover:bg-(--bg-hover)")
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
