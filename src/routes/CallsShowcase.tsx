import {
    Phone,
    PhoneOff,
    Mic,
    MicOff,
    Volume2,
    Grid3x3,
    Minimize2,
    PhoneCall,
    PhoneMissed,
    PhoneIncoming,
    PhoneOutgoing,
    Clock,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, colorFromString, fmtDuration, initials } from "@/lib/utils";
import { dataset } from "@/data/dataset";
import { useState } from "react";

export function CallsShowcase() {
    return (
        <div className="h-full overflow-y-auto bg-(--bg-app) p-4 sm:p-8">
            <div className="mx-auto max-w-2xl space-y-6">
                <header>
                    <h1 className="text-2xl font-bold">Chiamate · sezione G / R8</h1>
                    <p className="mt-1 text-sm text-(--fg-secondary)">
                        IncomingBanner, ActiveCallScreen (fullscreen + minimized), CallLog,
                        CallButton header.
                    </p>
                </header>

                <Section
                    title="R8 · IncomingCallBanner"
                    spec="Overlay top ovunque: avatar, nome, Accetta/Rifiuta"
                >
                    <div className="relative h-48 overflow-hidden rounded-lg bg-(--bg-panel-2)">
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-(--fg-tertiary)">
                            ... app dietro ...
                        </div>
                        <IncomingCallBanner />
                    </div>
                </Section>

                <Section
                    title="R8 · ActiveCallScreen"
                    spec="Timer, mute, vivavoce, DTMF, minimizza, riaggancia"
                >
                    <ActiveCallScreen />
                </Section>

                <Section
                    title="R8 · Minimized pill"
                    spec="Pill flottante persistente durante navigazione tra chat"
                >
                    <div className="relative h-20 rounded-lg bg-(--bg-panel-2)">
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-(--fg-tertiary)">
                            ... chat dietro ...
                        </div>
                        <MinimizedPill />
                    </div>
                </Section>

                <Section
                    title="R8 · CallLog"
                    spec="Lista con filtri: tutte/perse, direzione+esito+durata, richiama"
                >
                    <CallLog />
                </Section>

                <Section title="R8 · CallButton header" spec="Abilitato · disabilitato con tooltip">
                    <div className="flex items-center gap-4 rounded-lg bg-(--bg-panel) px-4 py-3">
                        <div className="text-xs text-(--fg-secondary)">Abilitato:</div>
                        <button
                            type="button"
                            aria-label="Avvia chiamata"
                            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) transition-all duration-200 ease-out hover:bg-(--accent-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
                        >
                            <Phone className="h-4 w-4" />
                        </button>
                        <div className="text-xs text-(--fg-secondary)">Disabilitato:</div>
                        <button
                            type="button"
                            disabled
                            aria-label="Chiamata non disponibile"
                            className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-full bg-(--bg-panel-2) text-(--fg-tertiary)"
                            title="Permesso di chiamata non accordato"
                        >
                            <PhoneOff className="h-4 w-4" />
                        </button>
                        <div className="text-[11px] text-(--fg-tertiary)">
                            Permesso non accordato
                        </div>
                    </div>
                </Section>
            </div>
        </div>
    );
}

function Section({
    title,
    spec,
    children,
}: {
    title: string;
    spec: string;
    children: React.ReactNode;
}) {
    return (
        <div className="rounded-xl border border-(--border-strong) bg-(--bg-panel) p-4">
            <div className="mb-3">
                <div className="text-sm font-semibold">{title}</div>
                <div className="text-[11px] text-(--fg-tertiary)">{spec}</div>
            </div>
            {children}
        </div>
    );
}

function IncomingCallBanner() {
    const conv = dataset.conversations[0];
    return (
        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 bg-(--bg-panel) px-4 py-3 shadow-(--shadow-overlay)">
            <div className="flex items-center gap-2.5">
                <Avatar className="h-10 w-10">
                    <AvatarFallback style={{ backgroundColor: conv.avatarColor }}>
                        {initials(conv.name)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <div className="text-sm font-semibold">{conv.name}</div>
                    <div className="text-[11px] text-(--fg-tertiary)">
                        Chiamata in arrivo · WhatsApp Voice
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="flex cursor-pointer items-center gap-1.5 rounded-full bg-(--status-failed) px-3 py-1.5 text-xs font-medium text-(--fg-on-accent) transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                >
                    <PhoneOff className="h-3.5 w-3.5" /> Rifiuta
                </button>
                <button
                    type="button"
                    className="flex animate-pulse cursor-pointer items-center gap-1.5 rounded-full bg-(--accent) px-3 py-1.5 text-xs font-medium text-(--accent-fg) transition-all duration-200 ease-out hover:bg-(--accent-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                >
                    <Phone className="h-3.5 w-3.5" /> Accetta
                </button>
            </div>
        </div>
    );
}

function ActiveCallScreen() {
    const [muted, setMuted] = useState(false);
    const [speaker, setSpeaker] = useState(true);
    const [showDtmf, setShowDtmf] = useState(false);
    const conv = dataset.conversations[0];

    return (
        <div className="flex flex-col items-center gap-4 rounded-xl bg-gradient-to-b from-(--bg-panel) to-(--bg-app) p-6">
            <Avatar className="h-20 w-20">
                <AvatarFallback style={{ backgroundColor: conv.avatarColor, fontSize: 24 }}>
                    {initials(conv.name)}
                </AvatarFallback>
            </Avatar>
            <div className="text-center">
                <div className="text-lg font-semibold">{conv.name}</div>
                <div className="text-sm text-(--fg-tertiary)">
                    Chiamata vocale ·{" "}
                    <span className="font-mono tabular-nums">{fmtDuration(154)}</span>
                </div>
            </div>

            {showDtmf && (
                <div className="grid grid-cols-3 gap-1.5">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((k) => (
                        <button
                            key={k}
                            type="button"
                            aria-label={`Tasto ${k}`}
                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-(--bg-panel-2) text-sm font-medium transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                        >
                            {k}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex items-center gap-3">
                <CallControl
                    active={muted}
                    onClick={() => setMuted(!muted)}
                    icon={muted ? MicOff : Mic}
                    label={muted ? "Unmute" : "Mute"}
                />
                <CallControl
                    active={speaker}
                    onClick={() => setSpeaker(!speaker)}
                    icon={Volume2}
                    label="Vivavoce"
                />
                <CallControl
                    active={showDtmf}
                    onClick={() => setShowDtmf(!showDtmf)}
                    icon={Grid3x3}
                    label="Tastierino"
                />
                <CallControl active={false} onClick={() => {}} icon={Minimize2} label="Minimizza" />
                <button
                    type="button"
                    className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-(--status-failed) text-(--fg-on-accent) transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
                    aria-label="Riaggancia"
                >
                    <PhoneOff className="h-6 w-6" />
                </button>
            </div>
        </div>
    );
}

function CallControl({
    active,
    onClick,
    icon: Icon,
    label,
}: {
    active: boolean;
    onClick: () => void;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className="flex cursor-pointer flex-col items-center gap-1 rounded-lg transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
            aria-label={label}
        >
            <span
                className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-200",
                    active
                        ? "bg-(--fg-primary) text-(--bg-panel)"
                        : "bg-(--bg-panel-2) text-(--fg-primary)"
                )}
            >
                <Icon className="h-5 w-5" />
            </span>
            <span className="text-[11px] text-(--fg-tertiary)">{label}</span>
        </button>
    );
}

function MinimizedPill() {
    const conv = dataset.conversations[0];
    return (
        <div className="absolute right-3 bottom-3 flex items-center gap-2 rounded-full bg-(--accent) py-1.5 pr-3 pl-1.5 text-(--accent-fg) shadow-(--shadow-overlay)">
            <Avatar className="h-7 w-7 border-2 border-(--accent-fg)/30">
                <AvatarFallback style={{ backgroundColor: conv.avatarColor, fontSize: 10 }}>
                    {initials(conv.name)}
                </AvatarFallback>
            </Avatar>
            <span className="text-xs font-medium">{conv.name}</span>
            <span className="font-mono text-xs tabular-nums opacity-80">{fmtDuration(154)}</span>
        </div>
    );
}

function CallLog() {
    return (
        <div className="rounded-lg border border-(--border-strong) bg-(--bg-panel)">
            <div className="flex gap-2 border-b border-(--border-soft) px-3 py-2 text-[11px]">
                <button
                    type="button"
                    aria-pressed="true"
                    className="cursor-pointer rounded font-semibold text-(--accent) transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                >
                    Tutte ({dataset.calls.length})
                </button>
                <button
                    type="button"
                    aria-pressed="false"
                    className="cursor-pointer rounded text-(--fg-tertiary) transition-all duration-200 ease-out hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                >
                    Perse (1)
                </button>
            </div>
            {dataset.calls.map((call) => {
                const conv = dataset.conversations.find((c) => c.id === call.conversationId);
                const name = conv?.name ?? "Sconosciuto";
                const Icon =
                    call.outcome === "missed"
                        ? PhoneMissed
                        : call.direction === "in"
                          ? PhoneIncoming
                          : PhoneOutgoing;
                const color =
                    call.outcome === "missed"
                        ? "var(--status-failed)"
                        : call.direction === "in"
                          ? "var(--accent)"
                          : "var(--fg-link)";
                return (
                    <div
                        key={call.id}
                        className="flex items-center gap-3 border-b border-(--border-soft) px-3 py-2 last:border-0"
                    >
                        <Avatar className="h-9 w-9">
                            <AvatarFallback
                                style={{
                                    backgroundColor: conv?.avatarColor ?? colorFromString(name),
                                    fontSize: 11,
                                }}
                            >
                                {initials(name)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                            <div
                                className="truncate text-sm font-medium"
                                style={{
                                    color:
                                        call.outcome === "missed"
                                            ? "var(--status-failed)"
                                            : undefined,
                                }}
                            >
                                {name}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-(--fg-tertiary)">
                                <Icon className="h-3 w-3" style={{ color }} />
                                {call.outcome === "missed"
                                    ? "Persa"
                                    : call.direction === "in"
                                      ? "In arrivo"
                                      : "In uscita"}
                                {call.durationSec > 0 && (
                                    <>
                                        <Clock className="ml-1 h-3 w-3" />{" "}
                                        {fmtDuration(call.durationSec)}
                                    </>
                                )}
                                <span className="ml-1">
                                    · {call.startedAt.replace("T", " · ").replace(/:00\+.*$/, "")}
                                </span>
                            </div>
                        </div>
                        <button
                            type="button"
                            aria-label={`Richiama ${name}`}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-(--accent) transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-[0.97]"
                        >
                            <PhoneCall className="h-4 w-4" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
