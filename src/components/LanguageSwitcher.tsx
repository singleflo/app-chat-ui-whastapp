import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
    const { t, i18n } = useTranslation();

    return (
        <div className="relative group">
            <button
                type="button"
                className="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-(--fg-secondary) transition-all duration-200 ease-out hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                aria-label={t("common.language.label")}
            >
                <span title={t("common.language.label")}>
                    <Languages className="h-3.5 w-3.5" />
                </span>
                <span className="hidden sm:inline uppercase">{i18n.language}</span>
            </button>
            <div className="absolute right-0 top-full z-50 mt-1 hidden w-32 flex-col overflow-hidden rounded-md border border-(--border-strong) bg-(--bg-panel) p-1 shadow-(--shadow-md) group-hover:flex">
                {(["en", "it", "ar"] as const).map((lng) => (
                    <button
                        key={lng}
                        type="button"
                        onClick={() => void i18n.changeLanguage(lng)}
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
        </div>
    );
}
