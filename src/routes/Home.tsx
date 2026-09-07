import { Link } from "react-router-dom";
import { Monitor, Smartphone, PanelRight, MessageSquare, Users, ArrowRight, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn, } from "@/lib/utils";
import { useDesign } from "@/lib/design";

const CARDS = [
    { to: "/desktop", icon: Monitor, id: "desktop", spec: "0 · A · B · C · D · E · F · G · Q · H" },
    { to: "/mobile", icon: Smartphone, id: "mobile", spec: "M1–M7" },
    { to: "/side-panel", icon: PanelRight, id: "sidePanel", spec: "0 (extension side panel)" },
    { to: "/quick-popover", icon: MessageSquare, id: "quickPopover", spec: "Q11 · R1" },
    { to: "/assignation", icon: Users, id: "assignation", spec: "Team inbox" },
] as const;

const DESIGNS = [
    { id: "whatsapp", name: "WhatsApp", canvas: "#eae6df", accent: "#00a884" },
    { id: "linear", name: "Linear", canvas: "#010102", accent: "#5e6ad2" },
    { id: "intercom", name: "Intercom", canvas: "#f5f1ec", accent: "#111111" },
    { id: "slack", name: "Slack", canvas: "#f4ede4", accent: "#4a154b" },
] as const;

export function Home() {
    const { t } = useTranslation();
    const [design, setDesign] = useDesign();
    return (
        <div className="h-full overflow-y-auto bg-(--bg-app) px-4 py-8 transition-colors duration-200 sm:px-8">
            <div className="mx-auto max-w-5xl">
                <header className="animate-slide-up mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-(--fg-primary) sm:text-3xl">
                        {t("home.heading")}
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-(--fg-secondary)">
                        {t("home.subtitleBefore")}{" "}
                        <code className="rounded bg-(--bg-panel-2) px-1 py-0.5 text-xs text-(--fg-primary)">
                            specifica-ui-whatsapp-clone-100.md
                        </code>{" "}
                        {t("home.subtitleAfter")}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                        {[
                            "React 18",
                            "TypeScript strict",
                            "Tailwind v4",
                            "shadcn/ui",
                            "Vite",
                            "MV3-safe",
                        ].map((tag) => (
                            <span
                                key={tag}
                                className="rounded-full border border-(--border-strong) bg-(--bg-panel) px-2 py-0.5 text-(--fg-secondary)"
                            >
                                {tag}
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
                                {t(`home.cards.${c.id}.title`)}
                            </h3>
                            <code className="self-start rounded bg-(--bg-panel-2) px-1.5 py-0.5 text-[10px] text-(--fg-secondary)">
                                {c.spec}
                            </code>
                            <p className="text-sm leading-relaxed text-(--fg-secondary)">
                                {t(`home.cards.${c.id}.desc`)}
                            </p>
                        </Link>
                    ))}
                </div>

                <section className="animate-slide-up mt-8">
                    <h2 className="text-lg font-semibold tracking-tight text-(--fg-primary)">
                        {t("home.design.title")}
                    </h2>
                    <p className="mt-1 text-sm text-(--fg-secondary)">
                        {t("home.design.desc")}
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-4">
                        {DESIGNS.map((d) => {
                            const active = design === d.id;
                            return (
                                <button
                                    key={d.id}
                                    type="button"
                                    onClick={() => setDesign(d.id)}
                                    aria-pressed={active}
                                    className={cn(
                                        "flex cursor-pointer flex-col gap-2 rounded-xl border bg-(--bg-panel) p-3 text-left transition-[background-color,color,box-shadow,transform,border-color] duration-200 ease-out hover:border-(--accent) hover:shadow-(--shadow-sm) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-app) focus-visible:outline-none active:scale-[0.98]",
                                        active && "border-(--accent) ring-1 ring-(--ring)",
                                    )}
                                >
                                    <span className="flex items-center gap-1.5">
                                        <span
                                            className="h-5 w-5 rounded-full border border-(--border-strong)"
                                            style={{ backgroundColor: d.canvas }}
                                            aria-hidden
                                        />
                                        <span
                                            className="-ml-3 h-5 w-5 rounded-full border-2 border-(--bg-panel)"
                                            style={{ backgroundColor: d.accent }}
                                            aria-hidden
                                        />
                                        <span className="ml-1 text-sm font-medium text-(--fg-primary)">
                                            {d.name}
                                        </span>
                                    </span>
                                    <span
                                        className={cn(
                                            "flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide",
                                            active ? "text-(--accent)" : "text-(--fg-tertiary)",
                                        )}
                                    >
                                        {active && <Check className="h-3 w-3" aria-hidden />}
                                        {active ? t("home.design.active") : "\u00A0"}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <footer className="mt-8 text-xs text-(--fg-tertiary)">
                    {t("home.footerBefore")}{" "}
                    <code className="rounded bg-(--bg-panel) px-1 py-0.5">
                        fixtures/demo-dataset.json
                    </code>{" "}
                    {t("home.footerAfter")}
                </footer>
            </div>
        </div>
    );
}
