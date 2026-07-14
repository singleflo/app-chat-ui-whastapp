import { describe, it, expect } from "vitest";
import { dataset } from "@/data/dataset";

describe("fixture", () => {
    it("every-entry-has-id", () => {
        const entries = Object.values(dataset.messages).flat();
        for (const entry of entries) {
            const id = (entry as { id?: unknown }).id;
            expect(typeof id, `entry without id: ${JSON.stringify(entry)}`).toBe("string");
        }
    });
});
