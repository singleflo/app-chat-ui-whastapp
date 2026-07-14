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
                    Per favore condividi la tua posizione per consentirci di organizzare la consegna.
                </div>
                <button
                    type="button"
                    className="flex items-center justify-center gap-1.5 rounded-md bg-[var(--accent)] px-3 py-1.5 text-[12px] font-medium text-[var(--accent-fg)]"
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
                    className="flex items-center justify-center gap-1.5 rounded-md border border-[var(--accent)] px-3 py-1.5 text-[12px] font-medium text-[var(--accent)]"
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
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                <div className="min-w-0">
                    {name && <div className="truncate text-[13px] font-medium">{name}</div>}
                    {address && <div className="truncate text-[11px] text-[var(--fg-secondary)]">{address}</div>}
                    <div className="text-[10px] text-[var(--fg-tertiary)]">
                        {lat?.toFixed(4)}, {lng?.toFixed(4)}
                    </div>
                </div>
            </div>
        </div>
    );
}
