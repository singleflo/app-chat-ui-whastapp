import { useEffect, useRef, useState } from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

const LANGS = ["en", "it", "ar"] as const;

export function LanguageSwitcher() {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const onEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("keydown", onEsc);
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("keydown", onEsc);
        };
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={t("common.language.label")}
                className="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-(--fg-secondary) transition-all duration-200 ease-out hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
            >
                <span title={t("common.language.label")}>
                    <Languages className="h-3.5 w-3.5" />
                </span>
                <span className="hidden uppercase sm:inline">{i18n.language}</span>
            </button>
            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-1 flex w-32 flex-col overflow-hidden rounded-md border border-(--border-strong) bg-(--bg-panel) p-1 shadow-(--shadow-md)"
                >
                    {LANGS.map((lng) => (
                        <button
                            key={lng}
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                void i18n.changeLanguage(lng);
                                setOpen(false);
                            }}
                            className={`flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:outline-none ${
                                i18n.language === lng
                                    ? "bg-(--accent) text-(--accent-fg)"
                                    : "text-(--fg-secondary) hover:bg-(--bg-hover) hover:text-(--fg-primary)"
                            }`}
                        >
                            {t(`common.language.${lng}`)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
