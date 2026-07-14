import { NavLink, Route, Routes } from "react-router-dom";
import {
    Monitor,
    Smartphone,
    PanelRight,
    MessageSquare,
    Palette,
    Edit3,
    Phone,
    Search,
    Settings,
    Languages,
    Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
    DesktopSurface,
    MobileSurface,
    SidePanelSurface,
    QuickPopoverSurface,
} from "./routes/surfaces";
import { Home } from "./routes/Home";
import { ComposerShowcase } from "./routes/ComposerShowcase";
import { CallsShowcase } from "./routes/CallsShowcase";
import { SearchScreen } from "./routes/SearchScreen";
import { NewChatScreen } from "./routes/NewChatScreen";
import { StarredScreen } from "./routes/StarredScreen";
import { SettingsScreen } from "./routes/SettingsScreen";
import { RtlScreen } from "./routes/RtlScreen";
import { cn } from "./lib/utils";

const SURFACES = [
    { to: "/", label: "Indice", icon: MessageSquare, end: true },
    { to: "/desktop", label: "Desktop", icon: Monitor, end: false },
    { to: "/mobile", label: "Mobile", icon: Smartphone, end: false },
    { to: "/side-panel", label: "Side", icon: PanelRight, end: false },
    { to: "/quick-popover", label: "Popover", icon: MessageSquare, end: false },
] as const;

const SCREENS = [
    { to: "/composer-states", label: "Composer", icon: Edit3 },
    { to: "/calls", label: "Chiamate", icon: Phone },
    { to: "/search", label: "Ricerca", icon: Search },
    { to: "/new-chat", label: "Nuova", icon: MessageSquare },
    { to: "/starred", label: "Importanti", icon: Star },
    { to: "/settings", label: "Impostazioni", icon: Settings },
    { to: "/rtl", label: "RTL", icon: Languages },
] as const;

export function App() {
    const [theme, setTheme] = useState<"light" | "dark">(() => {
        const stored = localStorage.getItem("wa-theme");
        if (stored === "light" || stored === "dark") return stored;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("wa-theme", theme);
    }, [theme]);

    return (
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-(--bg-app) text-(--fg-primary)">
            <header className="flex h-14 shrink-0 items-center gap-1 border-b border-(--border-strong) bg-(--bg-panel) px-3 shadow-(--shadow-sm)">
                <div className="mr-2 flex items-center gap-2 font-semibold">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-(--accent) text-(--accent-fg) shadow-(--shadow-sm)">
                        <MessageSquare className="h-3.5 w-3.5" />
                    </div>
                    <span className="hidden sm:inline">WhatsApp Chat UI</span>
                    <span className="rounded-full bg-(--bg-panel-2) px-1.5 py-0.5 text-[10px] font-normal tracking-wide text-(--fg-tertiary) uppercase">
                        spec 1.3
                    </span>
                </div>
                <nav className="flex flex-1 flex-wrap items-center gap-1">
                    {SURFACES.map((s) => (
                        <NavLink
                            key={s.to}
                            to={s.to}
                            end={s.end}
                            className={({ isActive }) =>
                                cn(
                                    "flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95",
                                    isActive
                                        ? "bg-(--accent) text-(--accent-fg) shadow-(--shadow-sm)"
                                        : "text-(--fg-secondary) hover:bg-(--bg-hover) hover:text-(--fg-primary)"
                                )
                            }
                        >
                            <s.icon className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">{s.label}</span>
                        </NavLink>
                    ))}
                    <span className="mx-1 h-4 w-px bg-(--border-strong)" />
                    {SCREENS.map((s) => (
                        <NavLink
                            key={s.to}
                            to={s.to}
                            className={({ isActive }) =>
                                cn(
                                    "flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95",
                                    isActive
                                        ? "bg-(--accent) text-(--accent-fg) shadow-(--shadow-sm)"
                                        : "text-(--fg-secondary) hover:bg-(--bg-hover) hover:text-(--fg-primary)"
                                )
                            }
                        >
                            <s.icon className="h-3.5 w-3.5" />
                            <span className="hidden lg:inline">{s.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <button
                    type="button"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    title={`Passa al tema ${theme === "dark" ? "chiaro" : "scuro"}`}
                    className="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-(--fg-secondary) transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-(--bg-hover) hover:text-(--fg-primary) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                    aria-label="Cambia tema"
                >
                    <Palette className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{theme === "dark" ? "Light" : "Dark"}</span>
                </button>
            </header>

            <main className="flex-1 overflow-hidden">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/desktop" element={<DesktopSurface />} />
                    <Route path="/mobile" element={<MobileSurface />} />
                    <Route path="/side-panel" element={<SidePanelSurface />} />
                    <Route path="/quick-popover" element={<QuickPopoverSurface />} />
                    <Route path="/composer-states" element={<ComposerShowcase />} />
                    <Route path="/calls" element={<CallsShowcase />} />
                    <Route path="/search" element={<SearchScreen />} />
                    <Route path="/new-chat" element={<NewChatScreen />} />
                    <Route path="/starred" element={<StarredScreen />} />
                    <Route path="/settings" element={<SettingsScreen />} />
                    <Route path="/rtl" element={<RtlScreen />} />
                </Routes>
            </main>
        </div>
    );
}
