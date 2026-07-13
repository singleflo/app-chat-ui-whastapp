import { ArrowLeft, Bell, Eye, Send, Globe, Palette, Image as ImageIcon, Type, Volume2, Tag, Zap, Shield, Download, Bug } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function SettingsScreen() {
    return (
        <div className="flex h-full flex-col bg-[var(--bg-panel)]">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--border-strong)] bg-[var(--bg-header)] px-3">
                <button type="button" className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)]">
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="flex-1 text-sm font-semibold">Impostazioni</h2>
            </header>
            <ScrollArea className="flex-1">
                <div className="flex flex-col gap-4 p-4">
                    <SettingsGroup title="Aspetto" icon={Palette}>
                        <ThemeRow />
                        <Row icon={ImageIcon} label="Sfondo chat" value="Pattern doodle" />
                        <DensityRow />
                        <FontSizeRow />
                    </SettingsGroup>
                    <SettingsGroup title="Notifiche" icon={Bell}>
                        <ToggleRow icon={Bell} label="Notifiche desktop" defaultOn />
                        <ToggleRow icon={Volume2} label="Suono nuovo messaggio" defaultOn />
                        <ToggleRow icon={Eye} label="Anteprime contenuto" defaultOn />
                        <ToggleRow icon={Shield} label="Modalità non disturbare" />
                    </SettingsGroup>
                    <SettingsGroup title="Privacy" icon={Shield}>
                        <ToggleRow icon={Eye} label="Invia conferme di lettura" defaultOn />
                        <ToggleRow icon={Send} label="Invio con tasto Invio" defaultOn />
                    </SettingsGroup>
                    <SettingsGroup title="Lingua" icon={Globe}>
                        <Row icon={Globe} label="Lingua interfaccia" value="Italiano" />
                    </SettingsGroup>
                    <SettingsGroup title="Risposte rapide" icon={Zap}>
                        <CannedRow title="/saluto" body="Ciao {{nome}}! Come posso aiutarti?" />
                        <CannedRow title="/spedizione" body="Il tuo ordine {{numero}} sarà spedito entro 24h." />
                        <CannedRow title="/orari" body="Siamo aperti lun–ven 9:00–18:00." />
                    </SettingsGroup>
                    <SettingsGroup title="Etichette" icon={Tag}>
                        <LabelRow name="VIP" color="#f9a825" />
                        <LabelRow name="Nord-Est" color="#1cb1d6" />
                        <LabelRow name="B2C" color="#7e57c2" />
                        <LabelRow name="Lead" color="#ef6c00" />
                    </SettingsGroup>
                    <SettingsGroup title="Avanzate" icon={Bug}>
                        <ToggleRow icon={Bug} label="Modalità debug (payload raw)" />
                        <ToggleRow icon={Download} label="Auto-download media" defaultOn />
                        <Row icon={Download} label="Esporta conversazione" value="Solo se host abilita" />
                    </SettingsGroup>
                </div>
            </ScrollArea>
        </div>
    );
}

function SettingsGroup({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
    return (
        <div>
            <div className="mb-1.5 flex items-center gap-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--fg-secondary)]">
                <Icon className="h-3.5 w-3.5" /> {title}
            </div>
            <div className="overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--bg-panel)] divide-y divide-[var(--border-soft)]">{children}</div>
        </div>
    );
}

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value?: string }) {
    return (
        <div className="flex items-center gap-3 px-3 py-2.5">
            <Icon className="h-4 w-4 shrink-0 text-[var(--fg-tertiary)]" />
            <span className="flex-1 text-sm">{label}</span>
            {value && <span className="text-xs text-[var(--fg-tertiary)]">{value}</span>}
        </div>
    );
}

function ToggleRow({ icon: Icon, label, defaultOn }: { icon: React.ComponentType<{ className?: string }>; label: string; defaultOn?: boolean }) {
    const [on, setOn] = useState(!!defaultOn);
    return (
        <button type="button" onClick={() => setOn(!on)} className="flex w-full items-center gap-3 px-3 py-2.5 text-left">
            <Icon className="h-4 w-4 shrink-0 text-[var(--fg-tertiary)]" />
            <span className="flex-1 text-sm">{label}</span>
            <span className={cn("relative h-5 w-9 rounded-full transition-colors", on ? "bg-[var(--accent)]" : "bg-[var(--bg-panel-2)]")}>
                <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform", on ? "translate-x-4" : "translate-x-0.5")} />
            </span>
        </button>
    );
}

function ThemeRow() {
    const [theme, setTheme] = useState<"light" | "dark" | "auto">("light");
    return (
        <div className="flex items-center gap-3 px-3 py-2.5">
            <Palette className="h-4 w-4 shrink-0 text-[var(--fg-tertiary)]" />
            <span className="flex-1 text-sm">Tema</span>
            <div className="flex gap-1">
                {(["light", "dark", "auto"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setTheme(t)}
                        className={cn("rounded-md px-2 py-0.5 text-[11px] font-medium capitalize", theme === t ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "bg-[var(--bg-panel-2)] text-[var(--fg-secondary)]")}>
                        {t === "auto" ? "Auto" : t === "light" ? "Light" : "Dark"}
                    </button>
                ))}
            </div>
        </div>
    );
}

function DensityRow() {
    const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
    return (
        <div className="flex items-center gap-3 px-3 py-2.5">
            <Type className="h-4 w-4 shrink-0 text-[var(--fg-tertiary)]" />
            <span className="flex-1 text-sm">Densità</span>
            <div className="flex gap-1">
                {(["comfortable", "compact"] as const).map((d) => (
                    <button key={d} type="button" onClick={() => setDensity(d)}
                        className={cn("rounded-md px-2 py-0.5 text-[11px] font-medium capitalize", density === d ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "bg-[var(--bg-panel-2)] text-[var(--fg-secondary)]")}>
                        {d === "comfortable" ? "Comoda" : "Compatta"}
                    </button>
                ))}
            </div>
        </div>
    );
}

function FontSizeRow() {
    const [size, setSize] = useState<"small" | "medium" | "large">("medium");
    return (
        <div className="flex items-center gap-3 px-3 py-2.5">
            <Type className="h-4 w-4 shrink-0 text-[var(--fg-tertiary)]" />
            <span className="flex-1 text-sm">Dimensione font messaggi</span>
            <div className="flex gap-1">
                {(["small", "medium", "large"] as const).map((s) => (
                    <button key={s} type="button" onClick={() => setSize(s)}
                        className={cn("rounded-md px-2 py-0.5 text-[11px] font-medium", size === s ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "bg-[var(--bg-panel-2)] text-[var(--fg-secondary)]")}>
                        {s === "small" ? "P" : s === "medium" ? "M" : "G"}
                    </button>
                ))}
            </div>
        </div>
    );
}

function CannedRow({ title, body }: { title: string; body: string }) {
    return (
        <div className="flex items-start gap-2 px-3 py-2">
            <Zap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
            <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-[var(--accent)]">{title}</div>
                <div className="truncate text-[11px] text-[var(--fg-secondary)]">{body}</div>
            </div>
            <button type="button" className="text-[10px] text-[var(--fg-link)]">Modifica</button>
        </div>
    );
}

function LabelRow({ name, color }: { name: string; color: string }) {
    return (
        <div className="flex items-center gap-2 px-3 py-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="flex-1 text-xs">{name}</span>
            <button type="button" className="text-[10px] text-[var(--fg-link)]">Modifica</button>
        </div>
    );
}
