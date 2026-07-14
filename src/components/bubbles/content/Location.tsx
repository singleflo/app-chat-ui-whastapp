import { MapPin, Navigation, Send } from "lucide-react";
import { MediaPlaceholder } from "./Media";

export function LocationContent({
    lat,
    lng,
    name,
    address,
    staticMapUrl,
    locationRequest,
    addressRequest,
}: {
    lat?: number;
    lng?: number;
    name?: string;
    address?: string;
    staticMapUrl?: string;
    locationRequest?: boolean;
    addressRequest?: boolean;
}) {
    if (locationRequest) {
        return (
            <div className="flex w-[220px] max-w-full flex-col gap-2">
                <div className="text-sm">
                    Per favore condividi la tua posizione per consentirci di organizzare la
                    consegna.
                </div>
                <button
                    type="button"
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md bg-(--accent) px-3 py-1.5 text-[12px] font-medium text-(--accent-fg) transition-all duration-200 ease-out hover:bg-(--accent-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                >
                    <Send className="h-3.5 w-3.5" /> Invia posizione
                </button>
            </div>
        );
    }
    if (addressRequest) {
        return (
            <div className="flex w-[220px] max-w-full flex-col gap-2">
                <div className="text-sm">
                    Per completare l'ordine abbiamo bisogno del tuo indirizzo di spedizione.
                </div>
                <button
                    type="button"
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded-md border border-(--accent) px-3 py-1.5 text-[12px] font-medium text-(--accent) transition-all duration-200 ease-out hover:bg-(--bg-hover) focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-panel) focus-visible:outline-none active:scale-95"
                >
                    <Navigation className="h-3.5 w-3.5" /> Fornisci indirizzo
                </button>
            </div>
        );
    }
    return (
        <div className="flex w-[240px] max-w-full flex-col gap-1">
            <MediaPlaceholder
                url={staticMapUrl ?? `map:${lat},${lng}`}
                className="aspect-[2/1] w-full rounded-md"
            />
            <div className="flex items-start gap-1.5 p-1">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-(--accent)" />
                <div className="min-w-0">
                    {name && <div className="truncate text-[13px] font-medium">{name}</div>}
                    {address && (
                        <div className="truncate text-[11px] text-(--fg-secondary)">{address}</div>
                    )}
                    <div className="text-[10px] text-(--fg-tertiary)">
                        {lat?.toFixed(4)}, {lng?.toFixed(4)}
                    </div>
                </div>
            </div>
        </div>
    );
}
