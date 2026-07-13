import {
    ArrowLeft,
    Pencil,
    Phone,
    Mail,
    Globe,
    Tag,
    Zap,
    Bot,
    ChevronRight,
    ChevronDown,
    History,
    Image as ImageIcon,
    Star,
    CheckCircle2,
    Loader2,
    XCircle,
    PanelRightClose,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn, initials } from "@/lib/utils";
import {
    dataset,
    profileFor,
    attributesFor,
    automationRunsFor,
    activityFor,
    conversationById,
} from "@/data/dataset";
import type { ActivityEvent, AutomationRun } from "@/types/chat";
import { useState } from "react";

export function ContextPanelShell({
    conversationId = "c1",
    onBack,
    onCollapse,
}: {
    conversationId?: string;
    onBack?: () => void;
    onCollapse?: () => void;
}) {
    const profile = profileFor(conversationId);
    const conv = conversationById(conversationId);
    const attrs = attributesFor(conversationId);
    const runs = automationRunsFor(conversationId);
    const activity = activityFor(conversationId);

    return (
        <div className="flex h-full flex-col overflow-hidden">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b border-[var(--border-strong)] bg-[var(--bg-header)] px-3">
                {onBack && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)]"
                        aria-label="Indietro"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                )}
                <h2 className="flex-1 truncate text-xs font-semibold text-[var(--fg-primary)]">Contesto cliente</h2>
                <button
                    type="button"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)]"
                    aria-label="Modifica contatto"
                >
                    <Pencil className="h-3.5 w-3.5" />
                </button>
                {onCollapse && (
                    <button
                        type="button"
                        onClick={onCollapse}
                        className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)]"
                        aria-label="Collassa pannello"
                    >
                        <PanelRightClose className="h-3.5 w-3.5" />
                    </button>
                )}
            </header>

            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    {profile && <ProfileSection profile={profile} />}
                    <CustomFieldsSection attrs={attrs} />
                    <AutomationSection runs={runs} />
                    {conv?.linkedRecords && conv.linkedRecords.length > 0 && <LinkedRecordsSection conv={conv} />}
                    <ActivitySection activity={activity} />
                    <GallerySection />
                </div>
            </ScrollArea>
        </div>
    );
}

function Section({
    title,
    icon: Icon,
    children,
    defaultOpen = true,
}: {
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-[var(--border-soft)]">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex w-full cursor-pointer list-none items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)]"
            >
                <Icon className="h-3.5 w-3.5" />
                <span className="flex-1 text-left">{title}</span>
                {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </button>
            {open && <div className="px-3 pb-3">{children}</div>}
        </div>
    );
}

function ProfileSection({ profile }: { profile: NonNullable<ReturnType<typeof profileFor>> }) {
    return (
        <Section title="Profilo" icon={Tag}>
            <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14">
                    <AvatarFallback style={{ backgroundColor: profile.avatarColor, fontSize: 18 }}>
                        {initials(profile.name)}
                    </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                    <div className="text-sm font-semibold">{profile.name}</div>
                    {profile.pushName && profile.pushName !== profile.name && (
                        <div className="text-[11px] text-[var(--fg-tertiary)]">push_name: {profile.pushName}</div>
                    )}
                    <div className="mt-1 flex flex-wrap gap-1">
                        {profile.labels.map((l) => (
                            <Badge key={l.id} variant="outline" className="text-[10px]" style={{ borderColor: l.color, color: l.color }}>
                                {l.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
            <div className="mt-3 space-y-1.5 text-xs">
                {profile.phones.map((ph) => (
                    <div key={`${ph.label}-${ph.number}`} className="flex items-start gap-2">
                        <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--fg-tertiary)]" />
                        <div className="min-w-0">
                            <div className={cn("truncate", ph.verified && "font-medium")}>{ph.number}</div>
                            <div className="text-[10px] text-[var(--fg-tertiary)]">
                                {ph.label}
                                {ph.verified && <span className="ml-1 text-[var(--accent)]">✓ WhatsApp verificato</span>}
                            </div>
                        </div>
                    </div>
                ))}
                {profile.emails.map((e) => (
                    <div key={e} className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 shrink-0 text-[var(--fg-tertiary)]" />
                        <span className="truncate">{e}</span>
                    </div>
                ))}
                {profile.company && (
                    <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 shrink-0 text-[var(--fg-tertiary)]" />
                        <span>{profile.company}</span>
                    </div>
                )}
                {profile.language && (
                    <div className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 shrink-0 text-[var(--fg-tertiary)]" />
                        <span>{profile.language} · {profile.timezone}</span>
                    </div>
                )}
            </div>
        </Section>
    );
}

function CustomFieldsSection({ attrs }: { attrs: Record<string, string | number | boolean | string[]> }) {
    const schema = dataset.attributesSchema;
    const entries = schema.filter((s) => s.key in attrs);
    const hidden = schema.filter((s) => !(s.key in attrs));

    return (
        <Section title="Campi personalizzati" icon={Pencil}>
            <div className="space-y-1.5 text-xs">
                {entries.map((field) => {
                    const val = attrs[field.key];
                    return (
                        <FieldRow
                            key={field.key}
                            label={field.label}
                            value={Array.isArray(val) ? val.join(", ") : String(val)}
                            type={field.type}
                        />
                    );
                })}
                {hidden.length > 0 && (
                    <button type="button" className="mt-1 text-[10px] text-[var(--fg-link)] hover:underline">
                        Mostra altri ({hidden.length})
                    </button>
                )}
            </div>
        </Section>
    );
}

function FieldRow({ label, value, type }: { label: string; value: string; type: string }) {
    return (
        <div className="flex items-center justify-between gap-2 rounded-md border border-[var(--border-soft)] bg-[var(--bg-panel-2)] px-2 py-1">
            <div className="min-w-0">
                <div className="truncate text-[10px] uppercase text-[var(--fg-tertiary)]">{label}</div>
                <div className={cn("truncate", (value === "true" || value === "false") && "font-medium")}>
                    {value === "true" ? "✓" : value === "false" ? "✗" : value}
                </div>
            </div>
            <span className="shrink-0 rounded bg-[var(--bg-panel)] px-1 py-0.5 text-[9px] text-[var(--fg-tertiary)]">{type}</span>
        </div>
    );
}

function AutomationSection({ runs }: { runs: AutomationRun[] }) {
    return (
        <Section title="Ultime automazioni" icon={Zap}>
            {runs.length === 0 ? (
                <div className="text-[11px] text-[var(--fg-tertiary)]">Nessuna automazione eseguita</div>
            ) : (
                <ul className="space-y-1.5 text-xs">
                    {runs.map((run) => (
                        <RunRow key={run.id} run={run} />
                    ))}
                </ul>
            )}
        </Section>
    );
}

function RunRow({ run }: { run: AutomationRun }) {
    const Icon = run.icon === "🤖" ? Bot : Zap;
    return (
        <li className="flex items-center gap-2 rounded-md border border-[var(--border-soft)] bg-[var(--bg-panel-2)] px-2 py-1">
            <Icon className="h-3.5 w-3.5 shrink-0 text-[var(--fg-tertiary)]" />
            <div className="min-w-0 flex-1">
                <div className="truncate text-[var(--fg-primary)]">{run.name}</div>
                <div className="text-[10px] text-[var(--fg-tertiary)]">{run.ts.replace("T", " · ").replace(/\+.*$/, "")}</div>
            </div>
            {run.state === "done" && <CheckCircle2 className="h-3.5 w-3.5 text-[var(--fg-success)]" />}
            {run.state === "running" && <Loader2 className="h-3.5 w-3.5 animate-spin text-[var(--fg-link)]" />}
            {run.state === "failed" && <XCircle className="h-3.5 w-3.5 text-[var(--status-failed)]" />}
        </li>
    );
}

function LinkedRecordsSection({ conv }: { conv: NonNullable<ReturnType<typeof conversationById>> }) {
    return (
        <Section title="Record collegati" icon={Tag} defaultOpen={false}>
            <div className="flex flex-wrap gap-1.5 text-xs">
                {conv.linkedRecords?.map((r) => (
                    <button
                        type="button"
                        key={`${r.kind}-${r.id}`}
                        className="rounded-full border border-[var(--border-strong)] px-2 py-0.5 hover:bg-[var(--bg-hover)]"
                    >
                        {r.kind === "lead" && "🎯"}
                        {r.kind === "order" && "🧾"}
                        {r.kind === "ticket" && "🎫"} {r.kind} #{r.id}
                    </button>
                ))}
            </div>
        </Section>
    );
}

function ActivitySection({ activity }: { activity: ActivityEvent[] }) {
    return (
        <Section title={`Attività (${activity.length})`} icon={History} defaultOpen={false}>
            <ul className="space-y-1.5 text-xs">
                {activity.map((ev) => (
                    <li key={ev.id} className="flex gap-2 border-l-2 border-[var(--border-strong)] pl-2">
                        <div className="min-w-0 flex-1">
                            <span className="font-medium text-[var(--fg-primary)]">{ev.userName ?? "Sistema"}</span>{" "}
                            <span className="text-[var(--fg-secondary)]">{activityText(ev)}</span>
                            <div className="text-[10px] text-[var(--fg-tertiary)]">{ev.ts.replace("T", " · ").replace(/\+.*$/, "")}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </Section>
    );
}

function activityText(ev: ActivityEvent): string {
    switch (ev.type) {
        case "assigned": return `ha assegnato a ${ev.targetUserName ?? "?"}${ev.reason ? ` (${ev.reason})` : ""}`;
        case "unassigned": return "ha rilasciato la chat";
        case "auto_assigned": return "ha auto-assegnato la chat";
        case "auto_unassigned": return "ha auto-rilasciato la chat";
        case "reassigned_timeout": return "riassegnata per timeout";
        case "state_closed": return "ha chiuso la conversazione";
        case "state_reopened": return "ha riaperto la conversazione";
        case "state_reopened_auto": return "riaperta automaticamente (nuovo inbound)";
        case "offhours_reply": return "ha risposto fuori orario";
        case "queued_sent": return "messaggio in coda inviato";
        case "outbound_sent": return "ha inviato un messaggio";
        case "bot_takeover": return "è subentrata all'agente";
        case "bot_handoff": return "l'agente ha trasferito a un operatore";
        default: return ev.type;
    }
}

const GALLERY_TILES = [
    { id: "g1", angle: 0 },
    { id: "g2", angle: 60 },
    { id: "g3", angle: 120 },
    { id: "g4", angle: 180 },
    { id: "g5", angle: 240 },
    { id: "g6", angle: 300 },
] as const;

function GallerySection() {
    return (
        <Section title="Galleria condivisa" icon={ImageIcon} defaultOpen={false}>
            <div className="mb-2 flex gap-2 text-[10px]">
                <button type="button" className="font-semibold text-[var(--accent)]">Media (8)</button>
                <button type="button" className="text-[var(--fg-tertiary)]">Link (3)</button>
                <button type="button" className="text-[var(--fg-tertiary)]">Documenti (2)</button>
            </div>
            <div className="grid grid-cols-3 gap-1">
                {GALLERY_TILES.map((tile) => (
                    <div
                        key={tile.id}
                        className="aspect-square rounded bg-[var(--bg-panel-2)]"
                        style={{ backgroundImage: `linear-gradient(${tile.angle}deg, var(--bg-hover), var(--bg-active))` }}
                    />
                ))}
            </div>
            <button
                type="button"
                className="mt-2 flex w-full items-center justify-center gap-1 rounded-md border border-[var(--border-strong)] py-1 text-[10px] text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)]"
            >
                <Star className="h-3 w-3" /> Vedi importanti
            </button>
        </Section>
    );
}
