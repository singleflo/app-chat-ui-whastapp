import { Search, MoreVertical, Smile, Plus, Mic, CheckCheck, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn, colorFromString } from "@/lib/utils";

export function RtlScreen() {
    return (
        <div className="flex h-full items-center justify-center bg-[var(--bg-app)] p-4">
            <div className="flex h-[700px] w-[400px] flex-col overflow-hidden rounded-lg border border-[var(--border-strong)] bg-[var(--bg-panel)] shadow-[var(--shadow-overlay)]" dir="rtl">
                <header className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--border-strong)] bg-[var(--bg-header)] px-3">
                    <Avatar className="h-9 w-9"><AvatarFallback style={{ backgroundColor: colorFromString("أحمد") }}>أح</AvatarFallback></Avatar>
                    <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold" dir="auto">أحمد العتيبي</div>
                        <div className="truncate text-[11px] text-[var(--fg-tertiary)]">آنترنت · آخر ظهور 14:28</div>
                    </div>
                    <div className="flex items-center gap-0.5">
                        <button type="button" aria-label="مكالمة فيديو" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--fg-secondary)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)] active:scale-[0.97]"><Video className="h-4 w-4" /></button>
                        <button type="button" aria-label="مكالمة صوتية" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--fg-secondary)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)] active:scale-[0.97]"><Phone className="h-4 w-4" /></button>
                        <button type="button" aria-label="بحث" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--fg-secondary)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)] active:scale-[0.97]"><Search className="h-4 w-4" /></button>
                        <button type="button" aria-label="المزيد" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-[var(--fg-secondary)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)] active:scale-[0.97]"><MoreVertical className="h-4 w-4" /></button>
                    </div>
                </header>
                <div className="chat-doodle-bg relative flex-1 overflow-hidden">
                    <ScrollArea className="relative h-full">
                        <div className="mx-auto flex max-w-md flex-col gap-1 p-4" dir="rtl">
                            <div className="mx-auto my-2 rounded-md bg-[var(--bg-bubble-system)] px-3 py-0.5 text-[11px] font-semibold text-[var(--fg-secondary)]">اليوم</div>
                            <RtlBubble side="in"><RtlText text="مرحبا! أريد الاستفسار عن الطلب رقم *#S00042*" /></RtlBubble>
                            <RtlBubble side="out" author="أنت">
                                <RtlText text="مرحبا أحمد! نعم، تم تأكيد طلبك. سيتم الشحن _غداً_ 📦" />
                                <RtlMeta ts="14:08" ack="read" />
                            </RtlBubble>
                            <RtlBubble side="in"><RtlText text="ممتاز! شكراً جزيلاً 👍" /></RtlBubble>
                            <div className="mx-auto my-1 rounded-md bg-[var(--bg-bubble-system)] px-2.5 py-1 text-[11px] text-[var(--fg-secondary)]">🔒 الرسائل مشفرة تماماً</div>
                            <RtlBubble side="out" author="أنت">
                                <RtlText text="إليك رابط التتبع: https://acme.it/track/S00042" />
                                <RtlMeta ts="14:10" ack="delivered" />
                            </RtlBubble>
                        </div>
                    </ScrollArea>
                </div>
                <div className="shrink-0 bg-[var(--bg-panel-2)] px-3 py-2" dir="rtl">
                    <div className="flex items-end gap-2 rounded-lg bg-[var(--bg-panel)] px-2 py-1.5">
                        <button type="button" aria-label="رموز تعبيرية" className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--fg-secondary)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)] active:scale-[0.97]"><Smile className="h-5 w-5" /></button>
                        <button type="button" aria-label="إرفاق" className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--fg-secondary)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--bg-hover)] hover:text-[var(--fg-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)] active:scale-[0.97]"><Plus className="h-5 w-5" /></button>
                        <textarea rows={1} dir="auto" placeholder="اكتب رسالة" className="max-h-24 min-w-0 flex-1 resize-none bg-transparent px-2 py-1 text-sm focus:outline-none" />
                        <button type="button" aria-label="تسجيل صوتي" className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--accent)] text-[var(--accent-fg)] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)] active:scale-[0.97]"><Mic className="h-5 w-5" /></button>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-4 left-4 rounded-lg bg-[var(--bg-panel)] px-3 py-2 text-[11px] text-[var(--fg-tertiary)] shadow-[var(--shadow-panel)]">
                <div className="font-semibold text-[var(--fg-secondary)]">RTL — Arabic demo</div>
                <div>dir="rtl" · bolla/ACK/swipe mirrored · dir="auto" su testo</div>
            </div>
        </div>
    );
}

function RtlBubble({ side, author, children }: { side: "in" | "out"; author?: string; children: React.ReactNode }) {
    return (
        <div className={cn("relative max-w-[78%] rounded-[10px] px-2 py-1.5 text-sm shadow-[var(--shadow-bubble)]", side === "in" ? "self-start bg-[var(--bg-bubble-in)] rounded-tr-[2px]" : "self-end bg-[var(--bg-bubble-out)] rounded-tl-[2px]")}>
            {author && <div className="mb-0.5 text-[11px] font-semibold text-[var(--accent)]">{author}</div>}
            {children}
        </div>
    );
}

function RtlText({ text }: { text: string }) {
    const parts = text.split(/(\*[^*]+\*|_[^_]+_)/g);
    return (
        <span className="whitespace-pre-wrap leading-snug text-[var(--fg-primary)]" dir="auto">
            {parts.map((p, i) => {
                const key = `rtl-${i}-${p.slice(0, 4)}`;
                if (p.startsWith("*") && p.endsWith("*")) return <strong key={key} className="font-semibold">{p.slice(1, -1)}</strong>;
                if (p.startsWith("_") && p.endsWith("_")) return <em key={key} className="italic">{p.slice(1, -1)}</em>;
                return <span key={key}>{p}</span>;
            })}
        </span>
    );
}

function RtlMeta({ ts, ack }: { ts: string; ack: "read" | "delivered" }) {
    return (
        <span className="float-left ml-2 mt-1 flex items-center gap-0.5 text-[11px] text-[var(--fg-tertiary)] tabular-nums">
            {ts}
            {ack === "read" && <CheckCheck className="h-3 w-3" style={{ color: "var(--color-ack-blue)" }} />}
            {ack === "delivered" && <CheckCheck className="h-3 w-3 text-[var(--fg-tertiary)]" />}
        </span>
    );
}
