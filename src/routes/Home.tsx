import { Link } from "react-router-dom";
import { Monitor, Smartphone, PanelRight, MessageSquare, ArrowRight } from "lucide-react";

const CARDS = [
    {
        to: "/desktop",
        icon: Monitor,
        title: "Desktop · 3 pannelli",
        spec: "0 · A · B · C · D · E · F · G · Q · H",
        desc: "Lista conversazioni (380px) + Chat attiva + Drawer/Context panel (340px a comparsa). Layout completo con tutti i tipi di bolle R4 1–27.",
    },
    {
        to: "/mobile",
        icon: Smartphone,
        title: "Mobile · stack",
        spec: "M1–M7",
        desc: "Stack navigation Lista → Chat → Drawer. Gesture, safe areas, bottom-sheet, haptics. 1:1 con WhatsApp mobile.",
    },
    {
        to: "/side-panel",
        icon: PanelRight,
        title: "Side panel · 380px",
        spec: "0 (extension side panel)",
        desc: "Colonna singola identica al mobile. Simula il side panel MV3 dell'estensione Chrome (~360–400px).",
    },
    {
        to: "/quick-popover",
        icon: MessageSquare,
        title: "Quick Popover · 380×580",
        spec: "Q11 · R1",
        desc: "Mini-chat in popover con trigger doppio badge (verde/ambra), tab Assegnate/Non assegnate, ChatWindow auto-contenuto.",
    },
] as const;

export function Home() {
    return (
        <div className="h-full overflow-y-auto bg-(--bg-app) px-4 py-8 transition-colors duration-200 sm:px-8">
            <div className="mx-auto max-w-5xl">
                <header className="animate-slide-up mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-(--fg-primary) sm:text-3xl">
                        WhatsApp Chat UI · Mockup navigabile
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-(--fg-secondary)">
                        Implementazione completa della specifica{" "}
                        <code className="rounded bg-(--bg-panel-2) px-1 py-0.5 text-xs text-(--fg-primary)">
                            specifica-ui-whatsapp-clone-100.md
                        </code>{" "}
                        (v1.3). Sezioni coperte: 0, A–T. 4 superfici, 27 tipi di bolle, composer
                        multi-stato, drawer info, Context panel CRM, Team inbox, chiamate, schermate
                        secondarie, light/dark, RTL.
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                        {[
                            "React 18",
                            "TypeScript strict",
                            "Tailwind v4",
                            "shadcn/ui",
                            "Vite",
                            "MV3-safe",
                        ].map((t) => (
                            <span
                                key={t}
                                className="rounded-full border border-(--border-strong) bg-(--bg-panel) px-2 py-0.5 text-(--fg-secondary)"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                </header>

                <div className="grid gap-4 sm:grid-cols-2">
                    {CARDS.map((c, i) => (
                        <Link
                            key={c.to}
                            to={c.to}
                            style={{ animationDelay: `${i * 50}ms` }}
                            className="group animate-slide-up flex cursor-pointer flex-col gap-3 rounded-xl border border-(--border-strong) bg-(--bg-panel) p-5 shadow-(--shadow-sm) transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-(--accent) hover:shadow-(--shadow-lg) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-app) focus-visible:outline-none"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--accent-soft) text-(--accent) transition-transform duration-300 ease-spring group-hover:scale-110">
                                    <c.icon className="h-5 w-5" />
                                </div>
                                <ArrowRight className="h-4 w-4 text-(--fg-tertiary) transition-all duration-300 group-hover:translate-x-1 group-hover:text-(--accent)" />
                            </div>
                            <h3 className="text-base font-semibold text-(--fg-primary)">
                                {c.title}
                            </h3>
                            <code className="self-start rounded bg-(--bg-panel-2) px-1.5 py-0.5 text-[10px] text-(--fg-secondary)">
                                {c.spec}
                            </code>
                            <p className="text-sm leading-relaxed text-(--fg-secondary)">
                                {c.desc}
                            </p>
                        </Link>
                    ))}
                </div>

                <footer className="mt-8 text-xs text-(--fg-tertiary)">
                    Dati da{" "}
                    <code className="rounded bg-(--bg-panel) px-1 py-0.5">
                        fixtures/demo-dataset.json
                    </code>{" "}
                    (sezione T). Tutto bundle-local, zero CDN.
                </footer>
            </div>
        </div>
    );
}
