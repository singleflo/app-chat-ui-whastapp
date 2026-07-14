import { Trash2, Edit3, AlertTriangle, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Message } from "@/types/chat";

export function DeletedContent({ message }: { message: Message }) {
    void message;
    const { t } = useTranslation();
    return (
        <div className="flex items-center gap-1.5 px-1 py-0.5 text-[12px] text-(--fg-tertiary) italic">
            <Trash2 className="h-3 w-3" /> {t("bubble.special.deleted")}
        </div>
    );
}

export function EditedContent({ message }: { message: Message }) {
    void message;
    const { t } = useTranslation();
    return (
        <div className="flex items-center gap-1.5 px-1 py-0.5 text-[11px] text-(--fg-tertiary) italic">
            <Edit3 className="h-3 w-3" /> {t("bubble.meta.edited")}
        </div>
    );
}

export function FallbackContent({ message }: { message: Message }) {
    const { t } = useTranslation();
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
        <div className="flex w-[220px] max-w-full flex-col gap-1.5 rounded-md bg-(--bg-bubble-fallback) p-2">
            <div className="flex items-center gap-1.5 text-[12px] text-(--fg-warning)">
                <AlertTriangle className="h-3.5 w-3.5" /> {t("bubble.special.unsupportedType")}
            </div>
            <div className="text-[10px] text-(--fg-tertiary)">
                raw type: <code className="font-mono">{content.rawType}</code>
            </div>
            <pre className="max-h-24 overflow-auto rounded bg-black/10 p-1.5 font-mono text-[10px]">
                {raw}
            </pre>
            <button
                type="button"
                onClick={handleCopy}
                className="flex cursor-pointer items-center justify-center gap-1 self-start rounded border border-(--border-strong) px-2 py-0.5 text-[10px] transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
            >
                <Copy className="h-3 w-3" /> {t("bubble.special.copyPayload")}
            </button>
        </div>
    );
}
