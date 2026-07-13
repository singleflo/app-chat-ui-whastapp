import { NavLink, Route, Routes } from "react-router-dom";
import { Monitor, Smartphone, PanelRight, MessageSquare, Palette, Edit3, Phone, Search, Settings, Languages, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { DesktopSurface, MobileSurface, SidePanelSurface, QuickPopoverSurface } from "./routes/surfaces";
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
        <div className="flex h-screen w-screen flex-col overflow-hidden bg-[var(--bg-app)] text-[var(--fg-primary)]">
            <header className="flex h-12 shrink-0 items-center gap-1 border-b border-[var(--border-strong)] bg-[var(--bg-panel)] px-3">
                <div className="mr-2 flex items-center gap-2 font-semibold">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-fg)]">
                        <MessageSquare className="h-3.5 w-3.5" />
                    </div>
                    <span className="hidden sm:inline">WhatsApp Chat UI</span>
                    <span className="text-[10px] font-normal uppercase tracking-wide text-[var(--fg-tertiary)]">spec 1.3</span>
                </div>
                <nav className="flex flex-1 flex-wrap items-center gap-1">
                    {SURFACES.map((s) => (
                        <NavLink key={s.to} to={s.to} end={s.end}
                            className={({ isActive }) => cn(
                                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                                isActive ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)]"
                            )}>
                            <s.icon className="h-3.5 w-3.5" />
                            <span className="hidden md:inline">{s.label}</span>
                        </NavLink>
                    ))}
                    <span className="mx-1 h-4 w-px bg-[var(--border-strong)]" />
                    {SCREENS.map((s) => (
                        <NavLink key={s.to} to={s.to}
                            className={({ isActive }) => cn(
                                "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                                isActive ? "bg-[var(--accent)] text-[var(--accent-fg)]" : "text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)]"
                            )}>
                            <s.icon className="h-3.5 w-3.5" />
                            <span className="hidden lg:inline">{s.label}</span>
                        </NavLink>
                    ))}
                </nav>
                <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--fg-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)]"
                    aria-label="Cambia tema">
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
