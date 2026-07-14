import type { SurfaceVariant } from "./types";
import { SURFACE_CAPS } from "./types";
import { ConversationListShell } from "./ConversationListShell";
import { ChatColumnShell } from "./ChatColumnShell";
import { ContextPanelShell } from "./ContextPanelShell";
import { ChatOverlays, type OverlayState } from "./Overlays";
import { Lightbox, type LightboxState } from "./Lightbox";
import { useState, useCallback, useEffect } from "react";
import { PanelRightOpen } from "lucide-react";

const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-panel)]";
const iconBtn = `cursor-pointer transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] ${focusRing}`;
const resizeHandle = `w-1 shrink-0 cursor-col-resize border-0 bg-[var(--border-strong)] p-0 transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--accent)] active:bg-[var(--accent)] ${focusRing}`;
const LIST_MIN = 280;
const LIST_MAX = 600;
const CTX_MIN = 240;
const CTX_MAX = 480;

export function ChatApp({ variant }: { variant: SurfaceVariant }) {
    const caps = SURFACE_CAPS[variant];
    const [selectedConvId, setSelectedConvId] = useState("c1");
    const [stack, setStack] = useState<"list" | "chat" | "context">("chat");
    const [overlay, setOverlay] = useState<OverlayState>(null);
    const [lightbox, setLightbox] = useState<LightboxState>({ open: false, url: "", index: 0, total: 1 });

    useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent).detail as { url: string; caption?: string };
            setLightbox({ open: true, url: detail.url, caption: detail.caption, index: 0, total: 1 });
        };
        window.addEventListener("wa-lightbox-open", handler);
        return () => window.removeEventListener("wa-lightbox-open", handler);
    }, []);

    const handleSelect = (id: string) => {
        setSelectedConvId(id);
        setStack("chat");
    };

    const overlays = (
        <>
            <ChatOverlays
                state={overlay}
                onClose={() => setOverlay(null)}
                onConfirmDelete={() => setOverlay(null)}
                onConfirmNewChat={() => setOverlay(null)}
                onConfirmForward={() => setOverlay(null)}
            />
            <Lightbox
                state={lightbox}
                onClose={() => setLightbox((s) => ({ ...s, open: false }))}
                onPrev={() => setLightbox((s) => ({ ...s, index: Math.max(0, s.index - 1) }))}
                onNext={() => setLightbox((s) => ({ ...s, index: Math.min(s.total - 1, s.index + 1) }))}
            />
        </>
    );

    if (variant === "desktop") {
        return (
            <>
                <DesktopChatApp
                    selectedConvId={selectedConvId}
                    onSelect={handleSelect}
                    onNewChat={() => setOverlay({ type: "new-chat" })}
                />
                {overlays}
            </>
        );
    }

    return (
        <>
            <div className="flex h-full w-full flex-col overflow-hidden">
                {stack === "list" && (
                    <ConversationListShell onOpenChat={handleSelect} activeId={selectedConvId} onNewChat={() => setOverlay({ type: "new-chat" })} />
                )}
                {stack === "chat" && (
                    <ChatColumnShell
                        conversationId={selectedConvId}
                        readonly={!caps.showInput}
                        onBack={() => setStack("list")}
                        onOpenContext={() => caps.contextPanelCollapsible && setStack("context")}
                    />
                )}
                {stack === "context" && caps.contextPanelCollapsible && (
                    <ContextPanelShell conversationId={selectedConvId} onBack={() => setStack("chat")} />
                )}
            </div>
            {overlays}
        </>
    );
}

function DesktopChatApp({
    selectedConvId,
    onSelect,
    onNewChat,
}: {
    selectedConvId: string;
    onSelect: (id: string) => void;
    onNewChat: () => void;
}) {
    const [listWidth, setListWidth] = useState(380);
    const [contextWidth, setContextWidth] = useState(340);
    const [contextOpen, setContextOpen] = useState(true);

    const useResizable = (
        setWidth: (w: number) => void,
        min: number,
        max: number,
        invert = false
    ) => {
        return useCallback(
            (e: React.MouseEvent) => {
                e.preventDefault();
                const startX = e.clientX;
                const refWidth = invert ? contextWidth : listWidth;
                const startWidth = invert ? -refWidth : refWidth;
                const onMove = (ev: MouseEvent) => {
                    const delta = ev.clientX - startX;
                    const newWidth = invert
                        ? Math.min(max, Math.max(min, -startWidth - delta))
                        : Math.min(max, Math.max(min, startWidth + delta));
                    setWidth(newWidth);
                };
                const onUp = () => {
                    document.removeEventListener("mousemove", onMove);
                    document.removeEventListener("mouseup", onUp);
                    document.body.style.cursor = "";
                    document.body.style.userSelect = "";
                };
                document.addEventListener("mousemove", onMove);
                document.addEventListener("mouseup", onUp);
                document.body.style.cursor = "col-resize";
                document.body.style.userSelect = "none";
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [setWidth, min, max, invert]
        );
    };

    const onResizeList = useResizable(setListWidth, LIST_MIN, LIST_MAX);
    const onResizeContext = useResizable(setContextWidth, CTX_MIN, CTX_MAX, true);

    const keyResize =
        (width: number, setWidth: (w: number) => void, min: number, max: number, invert = false) =>
        (e: React.KeyboardEvent) => {
            if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
            e.preventDefault();
            const dir = (e.key === "ArrowRight" ? 1 : -1) * (invert ? -1 : 1);
            const step = (e.shiftKey ? 32 : 8) * dir;
            setWidth(Math.min(max, Math.max(min, width + step)));
        };

    return (
        <div className="flex h-full w-full overflow-hidden">
            <aside
                className="flex shrink-0 flex-col border-r border-[var(--border-strong)] bg-[var(--bg-panel)] overflow-hidden"
                style={{ width: listWidth }}
            >
                <ConversationListShell onOpenChat={onSelect} activeId={selectedConvId} onNewChat={onNewChat} />
            </aside>

            {/* biome-ignore lint/a11y/useSemanticElements: interactive resize splitter must stay a focusable button, not a static <hr> */}
            <button
                type="button"
                onMouseDown={onResizeList}
                onKeyDown={keyResize(listWidth, setListWidth, LIST_MIN, LIST_MAX)}
                role="separator"
                aria-orientation="vertical"
                aria-valuenow={Math.round(listWidth)}
                aria-valuemin={LIST_MIN}
                aria-valuemax={LIST_MAX}
                className={resizeHandle}
                aria-label="Ridimensiona lista"
            />

            <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
                <ChatColumnShell
                    conversationId={selectedConvId}
                    onOpenContext={() => setContextOpen(true)}
                    contextCollapsed={!contextOpen}
                />
            </section>

            {contextOpen && (
                <>
                    {/* biome-ignore lint/a11y/useSemanticElements: interactive resize splitter must stay a focusable button, not a static <hr> */}
                    <button
                        type="button"
                        onMouseDown={onResizeContext}
                        onKeyDown={keyResize(contextWidth, setContextWidth, CTX_MIN, CTX_MAX, true)}
                        role="separator"
                        aria-orientation="vertical"
                        aria-valuenow={Math.round(contextWidth)}
                        aria-valuemin={CTX_MIN}
                        aria-valuemax={CTX_MAX}
                        className={resizeHandle}
                        aria-label="Ridimensiona pannello contesto"
                    />
                    <aside
                        className="flex shrink-0 flex-col border-l border-[var(--border-strong)] bg-[var(--bg-panel)] overflow-hidden"
                        style={{ width: contextWidth }}
                    >
                        <ContextPanelShell
                            conversationId={selectedConvId}
                            onCollapse={() => setContextOpen(false)}
                        />
                    </aside>
                </>
            )}

            {!contextOpen && (
                <button
                    type="button"
                    onClick={() => setContextOpen(true)}
                    className={`absolute right-3 top-16 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-panel)] text-[var(--fg-secondary)] shadow-[var(--shadow-overlay)] hover:text-[var(--accent)] ${iconBtn}`}
                    aria-label="Apri pannello contesto"
                >
                    <PanelRightOpen className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
