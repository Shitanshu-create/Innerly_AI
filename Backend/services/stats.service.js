import journalReportModel from "../models/journalReport.model.js";
import UserStats from "../models/userStats.model.js";

const toDayKey = (date) => new Date(date).toISOString().split("T")[0];

const scoreAverage = (entry) => {
    const scores = entry.gemini_response || {};
    return (
        (scores.calmness_score || 0)
        + (scores.anxious_score || 0)
        + (scores.productivity_score || 0)
        + (scores.sadness_score || 0)
        + (scores.happiness_score || 0)
    ) / 5;
};

async function recalculateUserStats(userId) {
    const entries = await journalReportModel.find({ userId }).sort({ date: 1 });

    if (entries.length === 0) {
        await UserStats.findOneAndUpdate(
            { userId },
            {
                totalEntries: 0,
                totalWords: 0,
                longestStreak: 0,
                currentStreak: 0,
                avgMoodScore: 0,
                lastEntryDate: null
            },
            { upsert: true, returnDocument: "after" }
        );
        return;
    }

    const totalWords = entries.reduce((sum, entry) => {
        return sum + entry.chat.trim().split(/\s+/).filter(Boolean).length;
    }, 0);

    const avgMoodScore = entries.reduce((sum, entry) => sum + scoreAverage(entry), 0) / entries.length;
    const dayKeys = [...new Set(entries.map((entry) => toDayKey(entry.date)))];
    let longestStreak = 0;
    let activeStreak = 0;
    let previousDate = null;

    for (const dayKey of dayKeys) {
        const [year, month, day] = dayKey.split("-").map(Number);
        const currentDate = new Date(year, month - 1, day);

        if (previousDate) {
            const diffDays = Math.round((currentDate - previousDate) / (24 * 60 * 60 * 1000));
            activeStreak = diffDays === 1 ? activeStreak + 1 : 1;
        } else {
            activeStreak = 1;
        }

        longestStreak = Math.max(longestStreak, activeStreak);
        previousDate = currentDate;
    }

    const latestEntry = entries[entries.length - 1];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const latestEntryDay = new Date(latestEntry.date);
    latestEntryDay.setHours(0, 0, 0, 0);

    const diffFromToday = Math.round((today - latestEntryDay) / (24 * 60 * 60 * 1000));
    const currentStreak = diffFromToday <= 1 ? activeStreak : 0;

    await UserStats.findOneAndUpdate(
        { userId },
        {
            totalEntries: entries.length,
            totalWords,
            longestStreak,
            currentStreak,
            avgMoodScore,
            lastEntryDate: latestEntry.date
        },
        { upsert: true, returnDocument: "after" }
    );
}

export { recalculateUserStats };
