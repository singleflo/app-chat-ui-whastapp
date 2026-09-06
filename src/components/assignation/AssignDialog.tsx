import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { cn, initials } from "@/lib/utils";
import type { Conversation, User } from "@/types/chat";

const TITLE_ID = "assign-dialog-title";

export function AssignDialog({
    conversation,
    users,
    onAssign,
    onClose,
}: {
    conversation: Conversation;
    users: readonly User[];
    onAssign: (userId: string) => void;
    onClose: () => void;
}) {
    const { t } = useTranslation();
    const dialogRef = useRef<HTMLDivElement>(null);
    const [selected, setSelected] = useState<string | null>(null);

    useEffect(() => {
        const previouslyFocused = document.activeElement as HTMLElement | null;
        const focusable = () =>
            Array.from(
                dialogRef.current?.querySelectorAll<HTMLElement>(
                    'button, [href], input, [tabindex]:not([tabindex="-1"])'
                ) ?? []
            ).filter((el) => !el.hasAttribute("disabled"));
        focusable()[0]?.focus();
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") return onClose();
            if (e.key !== "Tab") return;
            const items = focusable();
            if (items.length === 0) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            previouslyFocused?.focus();
        };
    }, [onClose]);

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center">
            <button
                type="button"
                onClick={onClose}
                aria-label={t("assignation.cancel")}
                className="absolute inset-0 cursor-pointer border-0 bg-(--scrim) p-0"
            />
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={TITLE_ID}
                className="relative z-10 mx-4 w-full max-w-sm overflow-hidden rounded-xl border border-(--border-strong) bg-(--bg-panel) shadow-(--shadow-overlay)"
            >
                <header className="flex items-center justify-between border-b border-(--border-strong) px-4 py-3">
                    <h3 id={TITLE_ID} className="text-sm font-semibold text-(--fg-primary)">
                        {t("assignation.assignDialogTitle")}
                    </h3>
                </header>

                <p className="truncate px-4 pt-3 text-xs text-(--fg-tertiary)">{conversation.name}</p>

                <div
                    role="radiogroup"
                    aria-label={t("assignation.assignDialogTitle")}
                    className="flex flex-col gap-1 p-3"
                >
                    {users.map((u) => (
                        <button
                            key={u.id}
                            type="button"
                            role="radio"
                            aria-checked={selected === u.id}
                            onClick={() => setSelected(u.id)}
                            className={cn(
                                "flex items-center gap-2 rounded-md px-2 py-2 text-left transition-colors duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:outline-none",
                                selected === u.id && "bg-(--bg-active)",
                            )}
                        >
                            <span
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-white"
                                style={{ backgroundColor: u.color }}
                            >
                                {initials(u.name)}
                            </span>
                            <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm">{u.name}</span>
                                {u.role && (
                                    <span className="block text-[10px] text-(--fg-tertiary)">{u.role}</span>
                                )}
                            </span>
                            {u.online && (
                                <span aria-hidden className="h-2 w-2 rounded-full bg-(--fg-success)" />
                            )}
                        </button>
                    ))}
                </div>

                <footer className="flex items-center justify-end gap-2 border-t border-(--border-strong) px-4 py-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-md bg-(--bg-panel-2) px-3 py-1.5 text-xs font-medium text-(--fg-secondary) transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-out hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                    >
                        {t("assignation.cancel")}
                    </button>
                    <button
                        type="button"
                        disabled={!selected}
                        onClick={() => selected && onAssign(selected)}
                        className="cursor-pointer rounded-md bg-(--accent) px-3 py-1.5 text-xs font-medium text-(--accent-fg) transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-out hover:bg-(--accent-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95 disabled:pointer-events-none disabled:opacity-50"
                    >
                        {t("assignation.confirm")}
                    </button>
                </footer>
            </div>
        </div>
    );
}
