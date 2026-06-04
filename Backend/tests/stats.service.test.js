import { beforeEach, describe, expect, it, vi } from "vitest";

const findOneAndUpdate = vi.fn();
const sort = vi.fn();
const find = vi.fn(() => ({ sort }));

vi.mock("../models/journalReport.model.js", () => ({
    default: { find }
}));

vi.mock("../models/userStats.model.js", () => ({
    default: { findOneAndUpdate }
}));

const { recalculateUserStats } = await import("../services/stats.service.js");

describe("stats recalculation", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("rebuilds totals, words, mood average, and streaks from entries", async () => {
        const userId = "507f1f77bcf86cd799439011";
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        sort.mockResolvedValue([
            {
                date: yesterday,
                chat: "one two",
                gemini_response: {
                    calmness_score: 10,
                    anxious_score: 0,
                    productivity_score: 10,
                    sadness_score: 0,
                    happiness_score: 10
                }
            },
            {
                date: today,
                chat: "three four five",
                gemini_response: {
                    calmness_score: 5,
                    anxious_score: 5,
                    productivity_score: 5,
                    sadness_score: 5,
                    happiness_score: 5
                }
            }
        ]);

        await recalculateUserStats(userId);

        expect(find).toHaveBeenCalledWith({ userId });
        expect(findOneAndUpdate).toHaveBeenCalledWith(
            { userId },
            expect.objectContaining({
                totalEntries: 2,
                totalWords: 5,
                longestStreak: 2,
                currentStreak: 2,
                avgMoodScore: 5.5
            }),
            { upsert: true, returnDocument: "after" }
        );
    });

    it("sets current streak to zero when the latest entry is older than yesterday", async () => {
        const userId = "507f1f77bcf86cd799439011";
        sort.mockResolvedValue([
            {
                date: new Date(2026, 0, 1),
                chat: "one two",
                gemini_response: {}
            },
            {
                date: new Date(2026, 0, 2),
                chat: "three four",
                gemini_response: {}
            }
        ]);

        await recalculateUserStats(userId);

        expect(findOneAndUpdate).toHaveBeenCalledWith(
            { userId },
            expect.objectContaining({
                longestStreak: 2,
                currentStreak: 0
            }),
            { upsert: true, returnDocument: "after" }
        );
    });

    it("resets stats when all journal entries are deleted", async () => {
        const userId = "507f1f77bcf86cd799439011";
        sort.mockResolvedValue([]);

        await recalculateUserStats(userId);

        expect(findOneAndUpdate).toHaveBeenCalledWith(
            { userId },
            expect.objectContaining({
                totalEntries: 0,
                totalWords: 0,
                longestStreak: 0,
                currentStreak: 0,
                avgMoodScore: 0,
                lastEntryDate: null
            }),
            { upsert: true, returnDocument: "after" }
        );
    });
});
