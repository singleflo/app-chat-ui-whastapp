import {
    ArrowLeft,
    Bell,
    Eye,
    Send,
    Globe,
    Palette,
    Image as ImageIcon,
    Type,
    Volume2,
    Tag,
    Zap,
    Shield,
    Download,
    Bug,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function SettingsScreen() {
    const { t } = useTranslation();
    return (
        <div className="flex h-full flex-col bg-(--bg-panel)">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b border-(--border-strong) bg-(--bg-header) px-3">
                <button
                    type="button"
                    aria-label={t("settings.back")}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--fg-secondary) transition-all duration-200 ease-out hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="flex-1 text-sm font-semibold">{t("settings.title")}</h2>
            </header>
            <ScrollArea className="flex-1">
                <div className="mx-auto flex max-w-2xl flex-col gap-4 p-4">
                    <SettingsGroup title={t("settings.groups.appearance")} icon={Palette}>
                        <ThemeRow />
                        <Row
                            icon={ImageIcon}
                            label={t("settings.appearance.chatWallpaper")}
                            value={t("settings.appearance.chatWallpaperValue")}
                        />
                        <DensityRow />
                        <FontSizeRow />
                    </SettingsGroup>
                    <SettingsGroup title={t("settings.groups.notifications")} icon={Bell}>
                        <ToggleRow icon={Bell} label={t("settings.notifications.desktop")} defaultOn />
                        <ToggleRow icon={Volume2} label={t("settings.notifications.sound")} defaultOn />
                        <ToggleRow icon={Eye} label={t("settings.notifications.previews")} defaultOn />
                        <ToggleRow icon={Shield} label={t("settings.notifications.dnd")} />
                    </SettingsGroup>
                    <SettingsGroup title={t("settings.groups.privacy")} icon={Shield}>
                        <ToggleRow icon={Eye} label={t("settings.privacy.readReceipts")} defaultOn />
                        <ToggleRow icon={Send} label={t("settings.privacy.enterToSend")} defaultOn />
                    </SettingsGroup>
                    <SettingsGroup title={t("settings.groups.language")} icon={Globe}>
                        <Row icon={Globe} label={t("settings.language.label")} value="Italiano" />
                    </SettingsGroup>
                    <SettingsGroup title={t("settings.groups.cannedReplies")} icon={Zap}>
                        <CannedRow title="/saluto" body="Ciao {{nome}}! Come posso aiutarti?" />
                        <CannedRow
                            title="/spedizione"
                            body="Il tuo ordine {{numero}} sarà spedito entro 24h."
                        />
                        <CannedRow title="/orari" body="Siamo aperti lun–ven 9:00–18:00." />
                    </SettingsGroup>
                    <SettingsGroup title={t("settings.groups.labels")} icon={Tag}>
                        <LabelRow name="VIP" color="var(--fg-warning)" />
                        <LabelRow name="Nord-Est" color="var(--color-ack-blue)" />
                        <LabelRow name="B2C" color="var(--label-purple)" />
                        <LabelRow name="Lead" color="var(--label-orange)" />
                    </SettingsGroup>
                    <SettingsGroup title={t("settings.groups.advanced")} icon={Bug}>
                        <ToggleRow icon={Bug} label={t("settings.advanced.debugMode")} />
                        <ToggleRow icon={Download} label={t("settings.advanced.autoDownload")} defaultOn />
                        <Row
                            icon={Download}
                            label={t("settings.advanced.exportChat")}
                            value={t("settings.advanced.exportChatValue")}
                        />
                    </SettingsGroup>
                </div>
            </ScrollArea>
        </div>
    );
}

function SettingsGroup({
    title,
    icon: Icon,
    children,
}: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
}) {
    return (
        <div>
            <div className="mb-1.5 flex items-center gap-1.5 px-1 text-[11px] font-semibold tracking-wide text-(--fg-secondary) uppercase">
                <Icon className="h-3.5 w-3.5" /> {title}
            </div>
            <div className="divide-y divide-(--border-soft) overflow-visible rounded-lg border border-(--border-strong) bg-(--bg-panel)">
                {children}
            </div>
        </div>
    );
}

function Row({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value?: string;
}) {
    return (
        <div className="flex items-center gap-3 px-3 py-2.5">
            <Icon className="h-4 w-4 shrink-0 text-(--fg-tertiary)" />
            <span className="flex-1 text-sm">{label}</span>
            {value && <span className="text-xs text-(--fg-tertiary)">{value}</span>}
        </div>
    );
}

function ToggleRow({
    icon: Icon,
    label,
    defaultOn,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    defaultOn?: boolean;
}) {
    const [on, setOn] = useState(!!defaultOn);
    return (
        <button
            type="button"
            onClick={() => setOn(!on)}
            aria-pressed={on}
            className="flex w-full cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition-colors duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:outline-none focus-visible:ring-inset"
        >
            <Icon className="h-4 w-4 shrink-0 text-(--fg-tertiary)" />
            <span className="flex-1 text-sm">{label}</span>
            <span
                className={cn(
                    "relative h-5 w-9 rounded-full transition-colors duration-200 ease-out",
                    on ? "bg-(--accent)" : "bg-(--bg-panel-2)"
                )}
            >
                <span
                    className={cn(
                        "absolute top-0.5 h-4 w-4 rounded-full bg-(--fg-on-accent) shadow-(--shadow-sm) transition-transform duration-200 ease-out",
                        on ? "translate-x-4" : "translate-x-0.5"
                    )}
                />
            </span>
        </button>
    );
}

function ThemeRow() {
    const { t } = useTranslation();
    const [theme, setTheme] = useState<"light" | "dark" | "auto">("light");
    return (
        <div className="flex items-center gap-3 px-3 py-2.5">
            <Palette className="h-4 w-4 shrink-0 text-(--fg-tertiary)" />
            <span className="flex-1 text-sm">{t("settings.theme.label")}</span>
            <div className="flex gap-1">
                {(["light", "dark", "auto"] as const).map((opt) => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => setTheme(opt)}
                        aria-pressed={theme === opt}
                        className={cn(
                            "cursor-pointer rounded-md px-2 py-0.5 text-[11px] font-medium capitalize transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95",
                            theme === opt
                                ? "bg-(--accent) text-(--accent-fg)"
                                : "bg-(--bg-panel-2) text-(--fg-secondary) hover:bg-(--bg-hover) hover:text-(--fg-primary)"
                        )}
                    >
                        {t(`settings.theme.${opt}`)}
                    </button>
                ))}
            </div>
        </div>
    );
}

function DensityRow() {
    const { t } = useTranslation();
    const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
    return (
        <div className="flex items-center gap-3 px-3 py-2.5">
            <Type className="h-4 w-4 shrink-0 text-(--fg-tertiary)" />
            <span className="flex-1 text-sm">{t("settings.density.label")}</span>
            <div className="flex gap-1">
                {(["comfortable", "compact"] as const).map((d) => (
                    <button
                        key={d}
                        type="button"
                        onClick={() => setDensity(d)}
                        aria-pressed={density === d}
                        className={cn(
                            "cursor-pointer rounded-md px-2 py-0.5 text-[11px] font-medium capitalize transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95",
                            density === d
                                ? "bg-(--accent) text-(--accent-fg)"
                                : "bg-(--bg-panel-2) text-(--fg-secondary) hover:bg-(--bg-hover) hover:text-(--fg-primary)"
                        )}
                    >
                        {t(`settings.density.${d}`)}
                    </button>
                ))}
            </div>
        </div>
    );
}

function FontSizeRow() {
    const { t } = useTranslation();
    const [size, setSize] = useState<"small" | "medium" | "large">("medium");
    return (
        <div className="flex items-center gap-3 px-3 py-2.5">
            <Type className="h-4 w-4 shrink-0 text-(--fg-tertiary)" />
            <span className="flex-1 text-sm">{t("settings.fontSize.label")}</span>
            <div className="flex gap-1">
                {(["small", "medium", "large"] as const).map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        aria-pressed={size === s}
                        className={cn(
                            "cursor-pointer rounded-md px-2 py-0.5 text-[11px] font-medium transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95",
                            size === s
                                ? "bg-(--accent) text-(--accent-fg)"
                                : "bg-(--bg-panel-2) text-(--fg-secondary) hover:bg-(--bg-hover) hover:text-(--fg-primary)"
                        )}
                    >
                        {t(`settings.fontSize.${s}`)}
                    </button>
                ))}
            </div>
        </div>
    );
}

function CannedRow({ title, body }: { title: string; body: string }) {
    const { t } = useTranslation();
    return (
        <div className="flex items-start gap-2 px-3 py-2">
            <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--accent)" />
            <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-(--accent)">{title}</div>
                <div className="truncate text-[11px] text-(--fg-secondary)">{body}</div>
            </div>
            <button
                type="button"
                className="cursor-pointer rounded text-[11px] text-(--fg-link) transition-all duration-200 ease-out hover:underline focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
            >
                {t("settings.edit")}
            </button>
        </div>
    );
}

function LabelRow({ name, color }: { name: string; color: string }) {
    const { t } = useTranslation();
    return (
        <div className="flex items-center gap-2 px-3 py-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="flex-1 text-xs">{name}</span>
            <button
                type="button"
                className="cursor-pointer rounded text-[11px] text-(--fg-link) transition-all duration-200 ease-out hover:underline focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
            >
                {t("settings.edit")}
            </button>
        </div>
    );
}
