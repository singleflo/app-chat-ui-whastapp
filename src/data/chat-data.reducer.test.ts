import { afterEach, describe, expect, it, vi } from "vitest";
import {
    LOAD_MORE_LATENCY_MS,
    createMessagesSnapshotSelector,
    createStore,
} from "@/data/chat-data";
import type { AckStatus, ChatEntry, Conversation, DemoDataset, Message, SystemPill } from "@/types/chat";

type MessageFixture = {
    readonly id: string;
    readonly convId?: string;
    readonly ts: string;
    readonly body?: string;
    readonly ack?: AckStatus;
};

function conversation(id: string, overrides: Partial<Conversation> = {}): Conversation {
    return {
        id,
        type: "individual",
        name: `Conversation ${id}`,
        phone: `+39${id}`,
        avatarColor: "hsl(120 50% 40%)",
        lastMessagePreview: "preview",
        lastMessageTs: "2026-01-01T00:00:00.000Z",
        lastMessageType: "text",
        lastMessageDirection: "in",
        unread: 0,
        state: "open",
        ...overrides,
    };
}

function textMessage(input: MessageFixture): Message {
    return {
        id: input.id,
        conversationId: input.convId ?? "a",
        ts: input.ts,
        direction: "in",
        content: { kind: "text", body: input.body ?? input.id },
        ack: input.ack,
    };
}

function isoMinute(index: number): string {
    return new Date(Date.UTC(2026, 0, 1, 0, index, 0)).toISOString();
}

function pill(id: string): SystemPill {
    return {
        id,
        kind: "system",
        variant: "date_separator",
        text: id,
    };
}

function seed(conversations: readonly Conversation[], messages: Record<string, readonly ChatEntry[]>): DemoDataset {
    return {
        account: { name: "Demo", phoneNumbers: [] },
        users: [],
        agents: [],
        conversations: [...conversations],
        messages: Object.fromEntries(Object.entries(messages).map(([id, entries]) => [id, [...entries]])),
        activity: {},
        calls: [],
        templates: [],
        contactsProfiles: [],
        attributesSchema: [],
        attributesValues: {},
        automationRuns: {},
        labels: [],
    };
}

async function settleLoadMore(promise: Promise<void>): Promise<void> {
    await vi.advanceTimersByTimeAsync(LOAD_MORE_LATENCY_MS);
    await promise;
}

afterEach(() => {
    vi.useRealTimers();
});

describe("chat data reducer/store", () => {
    it("#dedup-by-id", () => {
        const store = createStore(seed([conversation("a")], { a: [] }));
        const entry = textMessage({ id: "m1", ts: "2026-01-01T10:00:00.000Z" });

        store.dispatch({ type: "message.new", convId: "a", entry });
        store.dispatch({ type: "message.new", convId: "a", entry });

        expect(store.getState().messages["a"]?.map((item) => item.id)).toEqual(["m1"]);
    });

    it("#sort-by-ts", () => {
        const m1 = textMessage({ id: "m1", ts: "2026-01-01T10:00:00.000Z" });
        const m3 = textMessage({ id: "m3", ts: "2026-01-01T12:00:00.000Z" });
        const store = createStore(seed([conversation("a")], { a: [m1, m3] }));

        store.dispatch({
            type: "message.new",
            convId: "a",
            entry: textMessage({ id: "m2", ts: "2026-01-01T11:00:00.000Z" }),
        });

        expect(store.getState().messages["a"]?.map((item) => item.id)).toEqual(["m1", "m2", "m3"]);
    });

    it("#pill-anchor-stable", () => {
        const p1 = pill("p1");
        const m1 = textMessage({ id: "m1", ts: "2026-01-01T10:00:00.000Z" });
        const m3 = textMessage({ id: "m3", ts: "2026-01-01T12:00:00.000Z" });
        const store = createStore(seed([conversation("a")], { a: [p1, m1, m3] }));

        store.dispatch({
            type: "message.new",
            convId: "a",
            entry: textMessage({ id: "m2", ts: "2026-01-01T11:00:00.000Z" }),
        });

        expect(store.getState().messages["a"]?.map((item) => item.id)).toEqual(["p1", "m1", "m2", "m3"]);
    });

    it("#upsert-conversation", () => {
        const store = createStore(seed([conversation("a", { pinned: true })], { a: [] }));

        store.dispatch({ type: "conversation.upsert", conv: conversation("b") });
        store.dispatch({ type: "conversation.upsert", conv: conversation("a", { name: "Updated" }) });

        expect(store.getState().convOrder).toEqual(["a", "b"]);
        expect(store.getState().conversations["a"]).toMatchObject({ name: "Updated", pinned: true });
    });

    it("#conversation-deleted", () => {
        const store = createStore(
            seed([conversation("a"), conversation("b")], {
                a: [textMessage({ id: "a1", ts: "2026-01-01T10:00:00.000Z" })],
                b: [textMessage({ id: "b1", convId: "b", ts: "2026-01-01T10:00:00.000Z" })],
            }),
        );

        store.dispatch({ type: "conversation.deleted", id: "a" });

        expect(store.getState().convOrder).toEqual(["b"]);
        expect(store.getState().conversations["a"]).toBeUndefined();
        expect(store.getState().messages["a"]).toBeUndefined();
    });

    it("#typing-off-on-new", () => {
        const store = createStore(seed([conversation("a")], { a: [] }));

        store.dispatch({ type: "typing.changed", convId: "a", typing: "text" });
        store.dispatch({
            type: "message.new",
            convId: "a",
            entry: textMessage({ id: "m1", ts: "2026-01-01T10:00:00.000Z" }),
        });

        expect(store.getState().typing["a"]).toBeNull();
    });

    it("#loadmore-reverse-slicing", async () => {
        vi.useFakeTimers();
        const entries = Array.from({ length: 65 }, (_, index) =>
            textMessage({
                id: `m${String(index + 1).padStart(3, "0")}`,
                ts: isoMinute(index),
            }),
        );
        const store = createStore(seed([conversation("a")], { a: entries }));
        const read = createMessagesSnapshotSelector(store, "a");

        expect(read().items.map((entry) => entry.id)).toEqual(entries.slice(35).map((entry) => entry.id));

        const promise = store.loadMore("a");
        await settleLoadMore(promise);

        expect(read().items.map((entry) => entry.id)).toEqual(entries.slice(5).map((entry) => entry.id));
    });

    it("#hasmore-computation", async () => {
        vi.useFakeTimers();
        const entries = Array.from({ length: 31 }, (_, index) =>
            textMessage({
                id: `m${index + 1}`,
                ts: isoMinute(index),
            }),
        );
        const store = createStore(seed([conversation("a")], { a: entries }));
        const read = createMessagesSnapshotSelector(store, "a");

        expect(read().hasMore).toBe(true);

        const promise = store.loadMore("a");
        await settleLoadMore(promise);

        expect(read().hasMore).toBe(false);
    });

    it("#reference-stability", () => {
        const store = createStore(
            seed([conversation("a"), conversation("b")], {
                a: [textMessage({ id: "a1", ts: "2026-01-01T10:00:00.000Z" })],
                b: [textMessage({ id: "b1", convId: "b", ts: "2026-01-01T10:00:00.000Z" })],
            }),
        );
        const readA = createMessagesSnapshotSelector(store, "a");
        const first = readA();

        store.dispatch({
            type: "message.new",
            convId: "b",
            entry: textMessage({ id: "b2", convId: "b", ts: "2026-01-01T11:00:00.000Z" }),
        });

        expect(readA()).toBe(first);
    });

    it("#empty-conv-snapshot-stable", () => {
        const store = createStore(seed([conversation("a"), conversation("empty")], { a: [] }));
        const read = createMessagesSnapshotSelector(store, "empty");

        const first = read();
        const second = read();

        expect(second).toBe(first);
        expect(second.items).toBe(first.items);
        expect(first.items).toEqual([]);
        expect(first.hasMore).toBe(false);
    });

    it("#message-ack-batch", () => {
        const store = createStore(
            seed([conversation("a")], {
                a: [
                    textMessage({ id: "a", ts: "2026-01-01T10:00:00.000Z", ack: "sent" }),
                    textMessage({ id: "b", ts: "2026-01-01T11:00:00.000Z", ack: "sent" }),
                ],
            }),
        );

        store.dispatch({ type: "message.ack", convId: "a", ids: ["a", "b"], ack: "read" });

        expect(store.getState().messages["a"]?.map((entry) => ("content" in entry ? entry.ack : null))).toEqual([
            "read",
            "read",
        ]);
    });
});
