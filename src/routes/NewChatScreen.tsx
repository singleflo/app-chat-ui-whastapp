import { ArrowLeft, Search, UserPlus, FileText, Check, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, colorFromString, initials } from "@/lib/utils";
import { useState } from "react";

export function NewChatScreen() {
    const [phone, setPhone] = useState("");
    const [showPhoneInput, setShowPhoneInput] = useState(false);
    const isValidE164 = /^\+?[1-9]\d{6,14}$/.test(phone.replace(/[\s-]/g, ""));
    const outsideWindow = phone.length > 0 && isValidE164;

    const mockContacts = [
        { id: "nc1", name: "Anna Conti", phone: "+39 339 1234567" },
        { id: "nc2", name: "Paola Gino", phone: "+39 348 9876543" },
        { id: "nc3", name: "Mario Bossi", phone: "+39 335 1122334" },
        { id: "nc4", name: "Carla Neri", phone: "+39 02 7654321" },
    ];

    return (
        <div className="flex h-full flex-col bg-[var(--bg-panel)]">
            <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--border-strong)] bg-[var(--bg-header)] px-3">
                <button type="button" aria-label="Indietro" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--fg-secondary)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)] active:scale-[0.97]">
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <h2 className="flex-1 text-sm font-semibold">Nuova chat</h2>
            </header>
            <div className="shrink-0 px-3 py-2">
                <div className="flex items-center gap-2 rounded-lg bg-[var(--bg-panel-2)] px-3 py-1.5">
                    <Search className="h-3.5 w-3.5 text-[var(--fg-tertiary)]" />
                    <input type="text" placeholder="Cerca un contatto" className="flex-1 bg-transparent text-sm focus:outline-none" />
                </div>
            </div>
            <ScrollArea className="flex-1">
                <div className="flex flex-col">
                    <button type="button" onClick={() => setShowPhoneInput(!showPhoneInput)} aria-expanded={showPhoneInput}
                        className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-inset">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                            <UserPlus className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-[var(--accent)]">Nuovo numero</span>
                    </button>
                    {showPhoneInput && (
                        <div className="border-b border-[var(--border-soft)] bg-[var(--bg-panel-2)] px-3 py-3">
                            <label htmlFor="phone-input" className="mb-1 block text-[11px] uppercase tracking-wide text-[var(--fg-tertiary)]">Numero di telefono (E.164)</label>
                            <input id="phone-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+39 340 1234567"
                                className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--bg-panel)] px-2 py-1.5 text-sm focus:border-[var(--accent)] focus:outline-none" />
                            <div className="mt-1.5 flex items-center justify-between">
                                {phone.length === 0 ? (
                                    <span className="text-[11px] text-[var(--fg-tertiary)]">Formato internazionale +XX...</span>
                                ) : isValidE164 ? (
                                    <span className="flex items-center gap-1 text-[11px] text-[var(--accent)]"><Check className="h-3 w-3" /> Valido</span>
                                ) : (
                                    <span className="flex items-center gap-1 text-[11px] text-[var(--status-failed)]"><AlertCircle className="h-3 w-3" /> Formato non valido</span>
                                )}
                                <button type="button" disabled={!isValidE164}
                                    className={cn("flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)]", isValidE164 ? "cursor-pointer bg-[var(--accent)] text-[var(--accent-fg)] hover:bg-[var(--accent-hover)] active:scale-95" : "cursor-not-allowed bg-[var(--bg-panel)] text-[var(--fg-tertiary)]")}>
                                    Avvia
                                </button>
                            </div>
                            {outsideWindow && (
                                <div className="mt-2 flex items-center gap-1.5 rounded-md bg-[var(--bg-bubble-system)] px-2 py-1 text-[11px] text-[var(--fg-secondary)]">
                                    <FileText className="h-3 w-3" /> Fuori finestra 24h → avvio con template richiesto
                                </div>
                            )}
                        </div>
                    )}
                    {mockContacts.map((c) => (
                        <button key={c.id} type="button" className="flex cursor-pointer items-center gap-3 px-3 py-2.5 text-left transition-colors duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-inset">
                            <Avatar className="h-10 w-10"><AvatarFallback style={{ backgroundColor: colorFromString(c.name) }}>{initials(c.name)}</AvatarFallback></Avatar>
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-medium">{c.name}</div>
                                <div className="truncate text-[11px] text-[var(--fg-tertiary)]">{c.phone}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}
