import { Link } from "react-router-dom";
import { Monitor, Smartphone, PanelRight, MessageSquare, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const CARDS = [
    { to: "/desktop", icon: Monitor, id: "desktop", spec: "0 · A · B · C · D · E · F · G · Q · H" },
    { to: "/mobile", icon: Smartphone, id: "mobile", spec: "M1–M7" },
    { to: "/side-panel", icon: PanelRight, id: "sidePanel", spec: "0 (extension side panel)" },
    { to: "/quick-popover", icon: MessageSquare, id: "quickPopover", spec: "Q11 · R1" },
] as const;

export function Home() {
    const { t } = useTranslation();
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
