/* eslint-disable react-refresh/only-export-components -- connector seam intentionally exports store APIs and hooks. */
// allow: SIZE_OK — connector seam intentionally centralizes store, provider, and hooks in one file.
import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    useSyncExternalStore,
    type ReactNode,
} from "react";
import { dataset } from "@/data/dataset";
import { isMessage } from "@/types/chat";
import type {
    AckStatus,
    ActivityEvent,
    Agent,
    AttributeSchema,
    AutomationRun,
    CallLog,
    ChatEntry,
    ContactProfile,
    Conversation,
    DemoDataset,
    Instance,
    Message,
    Template,
    User,
} from "@/types/chat";

export interface DataLoadError {
    readonly message: string;
}

export interface Paged<T> {
    readonly items: readonly T[];
    readonly loading: boolean;
    readonly refreshing: boolean;
    readonly loadingMore: boolean;
    readonly error: DataLoadError | null;
    readonly hasMore: boolean;
    readonly loadMore: () => Promise<void>;
    readonly refresh: () => Promise<void>;
}

export type TypingState = NonNullable<Conversation["typing"]> | null;

export type DataEvent =
    | { readonly type: "message.new"; readonly convId: string; readonly entry: ChatEntry }
    | { readonly type: "message.updated"; readonly convId: string; readonly entry: ChatEntry }
    | { readonly type: "message.deleted"; readonly convId: string; readonly id: string }
    | {
          readonly type: "message.ack";
          readonly convId: string;
          readonly ids: readonly string[];
          readonly ack: AckStatus;
      }
    | { readonly type: "conversation.upsert"; readonly conv: Conversation }
    | { readonly type: "conversation.deleted"; readonly id: string }
    | { readonly type: "typing.changed"; readonly convId: string; readonly typing: TypingState }
    | {
          readonly type: "conversation.assign";
          readonly convId: string;
          readonly userId: string | null;
          readonly ts: string;
      }
    | { readonly type: "conversation.close"; readonly convId: string; readonly ts: string }
    | { readonly type: "conversation.reopen"; readonly convId: string; readonly ts: string }
    | { readonly type: "activity.append"; readonly convId: string; readonly event: ActivityEvent };

export interface StoreState {
    readonly account: DemoDataset["account"];
    readonly users: readonly User[];
    readonly agents: readonly (Agent & { emoji: string })[];
    readonly instances: readonly Instance[];
    readonly conversations: Record<string, Conversation>;
    readonly convOrder: readonly string[];
    readonly messages: Record<string, readonly ChatEntry[]>;
    readonly sortKey: Record<string, number>;
    readonly typing: Record<string, TypingState>;
    readonly windows: Record<string, number>;
    readonly loadingMore: Record<string, boolean>;
    readonly refreshing: Record<string, boolean>;
    readonly calls: readonly CallLog[];
    readonly templates: readonly Template[];
    readonly contactsProfiles: readonly ContactProfile[];
    readonly attributesSchema: readonly AttributeSchema[];
    readonly attributesValues: DemoDataset["attributesValues"];
    readonly automationRuns: Record<string, readonly AutomationRun[]>;
    readonly activity: Record<string, readonly ActivityEvent[]>;
}

export interface ChatDataStore {
    readonly getState: () => StoreState;
    readonly subscribe: (cb: StoreListener) => () => void;
    readonly dispatch: (event: DataEvent) => void;
    readonly loadMore: (convId: string) => Promise<void>;
    readonly refresh: (convId: string) => Promise<void>;
    readonly sendText: (convId: string, text: string) => void;
}

type StoreListener = () => void;
type AttributeValues = Record<string, string | number | boolean | string[]>;
type MessagesSnapshotCache = {
    readonly full: readonly ChatEntry[];
    readonly windowSize: number;
    readonly loadingMore: boolean;
    readonly refreshing: boolean;
    readonly snapshot: Paged<ChatEntry>;
};
type ConversationsSnapshotCache = {
    readonly conversations: Record<string, Conversation>;
    readonly convOrder: readonly string[];
    readonly snapshot: Paged<Conversation>;
};
type AllMessagesCache = {
    readonly messages: Record<string, readonly ChatEntry[]>;
    readonly convOrder: readonly string[];
    readonly items: readonly ChatEntry[];
};

export const PAGE_SIZE = 30;
export const LOAD_MORE_LATENCY_MS = 350;

const EMPTY_ATTRIBUTES: AttributeValues = {};
const EMPTY_ACTIVITY: readonly ActivityEvent[] = [];
const EMPTY_AUTOMATION_RUNS: readonly AutomationRun[] = [];
// Stable empty reference: a fresh `[]` fallback would break useSyncExternalStore's
// getSnapshot identity check for conversations with no messages → infinite render loop.
const EMPTY_ENTRIES: readonly ChatEntry[] = [];

let optimisticId = 0;
let activitySeq = 0;

class ChatDataError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ChatDataError";
    }
}

function assertNever(event: never): never {
    throw new ChatDataError(`Unhandled data event: ${JSON.stringify(event)}`);
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function parseMessageTime(ts: string): number {
    const value = Date.parse(ts);
    return Number.isFinite(value) ? value : 0;
}

function sortEntries(entries: readonly ChatEntry[], sortKey: Record<string, number>): readonly ChatEntry[] {
    return [...entries].sort((left, right) => (sortKey[left.id] ?? 0) - (sortKey[right.id] ?? 0));
}

function seedEntrySortKeys(entries: readonly ChatEntry[], sortKey: Record<string, number>): void {
    for (const entry of entries) {
        if (isMessage(entry)) {
            sortKey[entry.id] = parseMessageTime(entry.ts);
        }
    }

    entries.forEach((entry, index) => {
        if (isMessage(entry)) {
            return;
        }

        const previous = entries[index - 1];
        const previousKey = previous ? sortKey[previous.id] : undefined;
        if (previousKey !== undefined) {
            sortKey[entry.id] = previousKey;
            return;
        }

        const following = entries.slice(index + 1).find((candidate) => sortKey[candidate.id] !== undefined);
        sortKey[entry.id] = following ? sortKey[following.id] ?? 0 : 0;
    });
}

function createInitialState(seed: DemoDataset): StoreState {
    const conversations: Record<string, Conversation> = {};
    const convOrder: string[] = [];
    const messages: Record<string, readonly ChatEntry[]> = {};
    const sortKey: Record<string, number> = {};
    const typing: Record<string, TypingState> = {};
    const windows: Record<string, number> = {};
    const loadingMore: Record<string, boolean> = {};
    const refreshing: Record<string, boolean> = {};

    for (const conv of seed.conversations) {
        conversations[conv.id] = conv;
        convOrder.push(conv.id);
        typing[conv.id] = conv.typing ?? null;
        windows[conv.id] = PAGE_SIZE;
    }

    for (const [convId, entries] of Object.entries(seed.messages)) {
        seedEntrySortKeys(entries, sortKey);
        messages[convId] = sortEntries(entries, sortKey);
        windows[convId] = windows[convId] ?? PAGE_SIZE;
    }

    return {
        account: seed.account,
        users: seed.users,
        agents: seed.agents,
        instances: seed.instances,
        conversations,
        convOrder,
        messages,
        sortKey,
        typing,
        windows,
        loadingMore,
        refreshing,
        calls: seed.calls,
        templates: seed.templates,
        contactsProfiles: seed.contactsProfiles,
        attributesSchema: seed.attributesSchema,
        attributesValues: seed.attributesValues,
        automationRuns: seed.automationRuns,
        activity: seed.activity,
    };
}

function sortKeyForNewEntry(state: StoreState, convId: string, entry: ChatEntry): number {
    if (isMessage(entry)) {
        return parseMessageTime(entry.ts);
    }

    const entries = state.messages[convId] ?? [];
    const lastEntry = entries[entries.length - 1];
    return lastEntry ? state.sortKey[lastEntry.id] ?? 0 : 0;
}

function omitRecordKey<T>(record: Record<string, T>, key: string): Record<string, T> {
    if (!(key in record)) {
        return record;
    }

    const next = { ...record };
    delete next[key];
    return next;
}

function updateLoadingMore(state: StoreState, convId: string, loadingMore: boolean): StoreState {
    if ((state.loadingMore[convId] ?? false) === loadingMore) {
        return state;
    }

    return {
        ...state,
        loadingMore: { ...state.loadingMore, [convId]: loadingMore },
    };
}

function updateRefreshing(state: StoreState, convId: string, refreshing: boolean): StoreState {
    if ((state.refreshing[convId] ?? false) === refreshing) {
        return state;
    }

    return {
        ...state,
        refreshing: { ...state.refreshing, [convId]: refreshing },
    };
}

function growWindow(state: StoreState, convId: string): StoreState {
    const total = state.messages[convId]?.length ?? 0;
    const currentWindow = state.windows[convId] ?? PAGE_SIZE;
    const nextWindow = Math.min(total, currentWindow + PAGE_SIZE);

    if (nextWindow === currentWindow) {
        return state;
    }

    return {
        ...state,
        windows: { ...state.windows, [convId]: nextWindow },
    };
}

function withActivity(state: StoreState, convId: string, event: ActivityEvent): StoreState {
    return {
        ...state,
        activity: {
            ...state.activity,
            [convId]: [...(state.activity[convId] ?? EMPTY_ACTIVITY), event],
        },
    };
}

export function reducer(state: StoreState, event: DataEvent): StoreState {
    switch (event.type) {
        case "message.new": {
            const current = state.messages[event.convId] ?? [];
            if (current.some((entry) => entry.id === event.entry.id)) {
                return state;
            }

            const nextSortKey = {
                ...state.sortKey,
                [event.entry.id]: sortKeyForNewEntry(state, event.convId, event.entry),
            };
            return {
                ...state,
                messages: {
                    ...state.messages,
                    [event.convId]: sortEntries([...current, event.entry], nextSortKey),
                },
                sortKey: nextSortKey,
                typing: { ...state.typing, [event.convId]: null },
            };
        }
        case "message.updated": {
            const current = state.messages[event.convId] ?? [];
            if (!current.some((entry) => entry.id === event.entry.id)) {
                return state;
            }

            return {
                ...state,
                messages: {
                    ...state.messages,
                    [event.convId]: current.map((entry) =>
                        entry.id === event.entry.id ? event.entry : entry,
                    ),
                },
            };
        }
        case "message.deleted": {
            const current = state.messages[event.convId] ?? [];
            if (!current.some((entry) => entry.id === event.id)) {
                return state;
            }

            return {
                ...state,
                messages: {
                    ...state.messages,
                    [event.convId]: current.filter((entry) => entry.id !== event.id),
                },
                sortKey: omitRecordKey(state.sortKey, event.id),
            };
        }
        case "message.ack": {
            const current = state.messages[event.convId] ?? [];
            const ids = new Set(event.ids);
            let changed = false;
            const nextEntries = current.map((entry) => {
                if (!ids.has(entry.id) || !isMessage(entry) || entry.ack === event.ack) {
                    return entry;
                }

                changed = true;
                return { ...entry, ack: event.ack };
            });

            if (!changed) {
                return state;
            }

            return {
                ...state,
                messages: { ...state.messages, [event.convId]: nextEntries },
            };
        }
        case "conversation.upsert": {
            const current = state.conversations[event.conv.id];
            const nextConversation = current ? { ...current, ...event.conv } : event.conv;
            const isNew = current === undefined;

            return {
                ...state,
                conversations: { ...state.conversations, [event.conv.id]: nextConversation },
                convOrder: isNew ? [...state.convOrder, event.conv.id] : state.convOrder,
                typing: isNew
                    ? { ...state.typing, [event.conv.id]: event.conv.typing ?? null }
                    : state.typing,
                windows: isNew ? { ...state.windows, [event.conv.id]: PAGE_SIZE } : state.windows,
            };
        }
        case "conversation.deleted": {
            const hasConversation = state.conversations[event.id] !== undefined;
            const hasMessages = state.messages[event.id] !== undefined;
            if (!hasConversation && !hasMessages) {
                return state;
            }

            return {
                ...state,
                conversations: omitRecordKey(state.conversations, event.id),
                convOrder: state.convOrder.filter((id) => id !== event.id),
                messages: omitRecordKey(state.messages, event.id),
                typing: omitRecordKey(state.typing, event.id),
                windows: omitRecordKey(state.windows, event.id),
                loadingMore: omitRecordKey(state.loadingMore, event.id),
                refreshing: omitRecordKey(state.refreshing, event.id),
                activity: omitRecordKey(state.activity, event.id),
                automationRuns: omitRecordKey(state.automationRuns, event.id),
                attributesValues: omitRecordKey(state.attributesValues, event.id),
            };
        }
        case "conversation.assign": {
            const current = state.conversations[event.convId];
            if (!current) {
                return state;
            }

            const assigned = event.userId !== null;
            const nextConversation: Conversation = assigned
                ? {
                      ...current,
                      assignedUserId: event.userId,
                      assignedAt: event.ts,
                      unassigned: false,
                      assignmentFailed: false,
                  }
                : { ...current, assignedUserId: undefined, assignedAt: undefined, unassigned: true };

            return withActivity(
                { ...state, conversations: { ...state.conversations, [event.convId]: nextConversation } },
                event.convId,
                {
                    id: `act_assign_${++activitySeq}`,
                    ts: event.ts,
                    type: assigned ? "assigned" : "unassigned",
                    ...(assigned ? { targetUserId: event.userId } : {}),
                },
            );
        }
        case "conversation.close": {
            const current = state.conversations[event.convId];
            if (!current || current.state === "done") {
                return state;
            }

            return withActivity(
                {
                    ...state,
                    conversations: {
                        ...state.conversations,
                        [event.convId]: { ...current, state: "done", closedAt: event.ts },
                    },
                },
                event.convId,
                { id: `act_close_${++activitySeq}`, ts: event.ts, type: "state_closed" },
            );
        }
        case "conversation.reopen": {
            const current = state.conversations[event.convId];
            if (!current || current.state === "open") {
                return state;
            }

            return withActivity(
                {
                    ...state,
                    conversations: {
                        ...state.conversations,
                        [event.convId]: { ...current, state: "open", closedAt: undefined },
                    },
                },
                event.convId,
                { id: `act_reopen_${++activitySeq}`, ts: event.ts, type: "state_reopened" },
            );
        }
        case "activity.append": {
            if (!state.conversations[event.convId]) {
                return state;
            }

            return withActivity(state, event.convId, event.event);
        }
        case "typing.changed":
            if ((state.typing[event.convId] ?? null) === event.typing) {
                return state;
            }

            return {
                ...state,
                typing: { ...state.typing, [event.convId]: event.typing },
            };
        default:
            return assertNever(event);
    }
}

export function createStore(seed: DemoDataset): ChatDataStore {
    let state = createInitialState(seed);
    const listeners = new Set<StoreListener>();

    const emit = (): void => {
        for (const listener of listeners) {
            listener();
        }
    };

    const setState = (nextState: StoreState): void => {
        if (nextState === state) {
            return;
        }

        state = nextState;
        emit();
    };

    const store: ChatDataStore = {
        getState: () => state,
        subscribe: (cb) => {
            listeners.add(cb);
            return () => {
                listeners.delete(cb);
            };
        },
        dispatch: (event) => {
            setState(reducer(state, event));
        },
        loadMore: async (convId) => {
            const total = state.messages[convId]?.length ?? 0;
            const currentWindow = state.windows[convId] ?? PAGE_SIZE;
            if (currentWindow >= total || (state.loadingMore[convId] ?? false)) {
                return;
            }

            setState(updateLoadingMore(state, convId, true));
            await delay(LOAD_MORE_LATENCY_MS);
            setState(updateLoadingMore(growWindow(state, convId), convId, false));
        },
        refresh: async (convId) => {
            setState(updateRefreshing(state, convId, true));
            await delay(LOAD_MORE_LATENCY_MS);
            setState(updateRefreshing(state, convId, false));
        },
        sendText: (convId, text) => {
            optimisticId += 1;
            const entry: Message = {
                id: `optimistic-${Date.now()}-${optimisticId}`,
                conversationId: convId,
                ts: new Date().toISOString(),
                direction: "out",
                content: { kind: "text", body: text },
                ack: "pending",
            };

            store.dispatch({ type: "message.new", convId, entry });
        },
    };

    return store;
}

const noopLoad = (): Promise<void> => Promise.resolve();

export function createMessagesSnapshotSelector(
    store: ChatDataStore,
    convId: string,
): () => Paged<ChatEntry> {
    let cache: MessagesSnapshotCache | null = null;
    const loadMore = (): Promise<void> => store.loadMore(convId);
    const refresh = (): Promise<void> => store.refresh(convId);

    return () => {
        const state = store.getState();
        const full = state.messages[convId] ?? EMPTY_ENTRIES;
        const windowSize = state.windows[convId] ?? PAGE_SIZE;
        const loadingMore = state.loadingMore[convId] ?? false;
        const refreshing = state.refreshing[convId] ?? false;

        if (
            cache &&
            cache.full === full &&
            cache.windowSize === windowSize &&
            cache.loadingMore === loadingMore &&
            cache.refreshing === refreshing
        ) {
            return cache.snapshot;
        }

        const start = Math.max(0, full.length - windowSize);
        const snapshot: Paged<ChatEntry> = {
            items: full.slice(start),
            loading: false,
            refreshing,
            loadingMore,
            error: null,
            hasMore: windowSize < full.length,
            loadMore,
            refresh,
        };
        cache = { full, windowSize, loadingMore, refreshing, snapshot };
        return snapshot;
    };
}

function createConversationsSnapshotSelector(store: ChatDataStore): () => Paged<Conversation> {
    let cache: ConversationsSnapshotCache | null = null;

    return () => {
        const state = store.getState();
        if (
            cache &&
            cache.conversations === state.conversations &&
            cache.convOrder === state.convOrder
        ) {
            return cache.snapshot;
        }

        const snapshot: Paged<Conversation> = {
            items: state.convOrder.flatMap((id) => state.conversations[id] ?? []),
            loading: false,
            refreshing: false,
            loadingMore: false,
            error: null,
            hasMore: false,
            loadMore: noopLoad,
            refresh: noopLoad,
        };
        cache = { conversations: state.conversations, convOrder: state.convOrder, snapshot };
        return snapshot;
    };
}

function createAllMessagesSelector(store: ChatDataStore): () => readonly ChatEntry[] {
    let cache: AllMessagesCache | null = null;

    return () => {
        const state = store.getState();
        if (cache && cache.messages === state.messages && cache.convOrder === state.convOrder) {
            return cache.items;
        }

        const items = state.convOrder.flatMap((id) => state.messages[id] ?? []);
        cache = { messages: state.messages, convOrder: state.convOrder, items };
        return items;
    };
}

const ChatDataContext = createContext<ChatDataStore | null>(null);

declare global {
    interface Window {
        __chatStore?: ChatDataStore;
    }
}

export function ChatDataProvider({ children }: { readonly children: ReactNode }) {
    const [store] = useState(() => createStore(dataset));

    if (import.meta.env.DEV && typeof window !== "undefined") {
        window.__chatStore = store;
    }

    return <ChatDataContext.Provider value={store}>{children}</ChatDataContext.Provider>;
}

function useChatStore(): ChatDataStore {
    const store = useContext(ChatDataContext);
    if (store === null) {
        throw new ChatDataError("Chat data hooks must be used inside ChatDataProvider");
    }

    return store;
}

export function useMessages(convId: string): Paged<ChatEntry> {
    const store = useChatStore();
    const selector = useMemo(() => createMessagesSnapshotSelector(store, convId), [store, convId]);
    const getSnapshot = useCallback(() => selector(), [selector]);
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

export function useConversations(): Paged<Conversation> {
    const store = useChatStore();
    const selector = useMemo(() => createConversationsSnapshotSelector(store), [store]);
    const getSnapshot = useCallback(() => selector(), [selector]);
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

export function useConversation(convId: string): Conversation | null {
    const store = useChatStore();
    const getSnapshot = useCallback(() => store.getState().conversations[convId] ?? null, [store, convId]);
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

export function useAccount(): DemoDataset["account"] {
    const store = useChatStore();
    const getSnapshot = useCallback(() => store.getState().account, [store]);
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

export function useContactProfile(convId: string): ContactProfile | null {
    const store = useChatStore();
    const getSnapshot = useCallback(
        () => store.getState().contactsProfiles.find((profile) => profile.contactId === convId) ?? null,
        [store, convId],
    );
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

export function useAttributes(convId: string): AttributeValues {
    const store = useChatStore();
    const getSnapshot = useCallback(
        () => store.getState().attributesValues[convId] ?? EMPTY_ATTRIBUTES,
        [store, convId],
    );
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

export function useActivity(convId: string): readonly ActivityEvent[] {
    const store = useChatStore();
    const getSnapshot = useCallback(
        () => store.getState().activity[convId] ?? EMPTY_ACTIVITY,
        [store, convId],
    );
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

export function useAutomationRuns(convId: string): readonly AutomationRun[] {
    const store = useChatStore();
    const getSnapshot = useCallback(
        () => store.getState().automationRuns[convId] ?? EMPTY_AUTOMATION_RUNS,
        [store, convId],
    );
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

export function useChatActions(convId: string): { readonly sendText: (text: string) => void } {
    const store = useChatStore();
    return useMemo(
        () => ({
            sendText: (text: string) => store.sendText(convId, text),
        }),
        [store, convId],
    );
}

export function useCalls(): readonly CallLog[] {
    const store = useChatStore();
    const getSnapshot = useCallback(() => store.getState().calls, [store]);
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

export function useTemplates(): readonly Template[] {
    const store = useChatStore();
    const getSnapshot = useCallback(() => store.getState().templates, [store]);
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

export function useAllMessages(): readonly ChatEntry[] {
    const store = useChatStore();
    const selector = useMemo(() => createAllMessagesSelector(store), [store]);
    const getSnapshot = useCallback(() => selector(), [selector]);
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

export function useContactProfiles(): readonly ContactProfile[] {
    const store = useChatStore();
    const getSnapshot = useCallback(() => store.getState().contactsProfiles, [store]);
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}

export function useAttributesSchema(): readonly AttributeSchema[] {
    const store = useChatStore();
    const getSnapshot = useCallback(() => store.getState().attributesSchema, [store]);
    return useSyncExternalStore(store.subscribe, getSnapshot, getSnapshot);
}
