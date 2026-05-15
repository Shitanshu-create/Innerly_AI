import generateJournalReport, { generateGlobalInsights } from "../services/journal.service.js";
import journalReportModel from "../models/journalReport.model.js";
import UserStats from "../models/userStats.model.js";
import InsightsCache from "../models/insightsCache.model.js";

/**
 * @desc Generate a journal report based on the provided journal entry.
 */
async function generateJournalReportController(req, res) {
    try {
        if (!req.body.chat) {
            return res.status(400).json({ message: "Journal entry (chat) is required" });
        }

        let journalReportByAi;

        /* If AI is disabled by the user, skip the Gemini API call to preserve privacy */
        if (req.body.aiActive === false) {
            journalReportByAi = {
                reflection: ["Private Entry - AI Analysis disabled"],
                gemini_response: {
                    calmness_score: 0,
                    anxious_score: 0,
                    productivity_score: 0,
                    sadness_score: 0,
                    happiness_score: 0
                }
            };
        } else {
            journalReportByAi = await generateJournalReport({
                chat: req.body.chat
            });
        }

        /* Parse media images if provided */
        const media = [];
        if (req.body.uploadedFiles && Array.isArray(req.body.uploadedFiles)) {
            req.body.uploadedFiles.forEach(file => {
                if (file.data) {
                    /* Convert base64 to buffer */
                    const base64Data = file.data.split(',')[1] || file.data;
                    media.push({
                        data: Buffer.from(base64Data, 'base64'),
                        contentType: file.type || 'application/octet-stream',
                        filename: file.name
                    });
                }
            });
        }

        const journalReport = await journalReportModel.create({
            userId: req.user.Id, /* Associate with logged-in user */
            date: new Date(),
            chat: req.body.chat,
            title: req.body.title || "Untethered Thoughts",
            reflection: journalReportByAi.reflection,
            media: media,
            gemini_response: journalReportByAi.gemini_response
        });

        /* --- UPDATE USER STATS --- */
        const wordCount = req.body.chat.trim().split(/\s+/).length;
        const aiResp = journalReportByAi.gemini_response;
        const entryAvgMood = ((aiResp.calmness_score || 0) + (aiResp.anxious_score || 0) + (aiResp.productivity_score || 0) + (aiResp.sadness_score || 0) + (aiResp.happiness_score || 0)) / 5;

        // Find or create UserStats
        let stats = await UserStats.findOne({ userId: req.user.Id });
        if (!stats) {
            stats = new UserStats({ userId: req.user.Id });
        }

        const now = new Date();
        const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
        
        let lastEntryStr = null;
        if (stats.lastEntryDate) {
            const d = new Date(stats.lastEntryDate);
            lastEntryStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        }

        // Streak logic
        if (lastEntryStr !== todayStr) {
            // New day entry
            const yesterdayDate = new Date(now);
            yesterdayDate.setDate(yesterdayDate.getDate() - 1);
            const yesterdayStr = `${yesterdayDate.getFullYear()}-${yesterdayDate.getMonth()}-${yesterdayDate.getDate()}`;

            if (lastEntryStr === yesterdayStr) {
                stats.currentStreak += 1;
            } else {
                stats.currentStreak = 1;
            }
            stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak);
        }

        // Rolling average logic for mood
        const newTotalEntries = stats.totalEntries + 1;
        const newAvgMood = ((stats.avgMoodScore * stats.totalEntries) + entryAvgMood) / newTotalEntries;

        stats.totalEntries = newTotalEntries;
        stats.totalWords += wordCount;
        stats.avgMoodScore = newAvgMood;
        stats.lastEntryDate = now;

        await stats.save();
        /* --- END UPDATE USER STATS --- */

        res.status(201).json({
            message: "Journal report generated successfully",
            journalReport,
        });
    } catch (error) {

        console.error("Journal Report Error:", error);
        res.status(500).json({
            message: "Failed to generate journal report",
            error: error.message,
        });
    }
}

/**
 * @desc Get all journal entries for the logged-in user
*/
async function getJournalEntriesController(req, res) {
    try {
        /* Fetch only entries for the logged-in user */
        const entries = await journalReportModel.find({ userId: req.user.Id }).sort({ date: -1 });

        res.status(200).json({
            message: "Journal entries retrieved successfully",
            entries,
        });
    } catch (error) {
        console.error("Fetch Journal Entries Error:", error);
        res.status(500).json({
            message: "Failed to fetch journal entries",
            error: error.message,
        });
    }
}

/**
 * @desc Get user stats
 */
async function getUserStatsController(req, res) {
    try {
        let stats = await UserStats.findOne({ userId: req.user.Id });
        
        if (!stats) {
            // If they have no stats object yet, return zeroed defaults
            stats = {
                totalEntries: 0,
                totalWords: 0,
                longestStreak: 0,
                currentStreak: 0,
                avgMoodScore: 0
            };
        }

        res.status(200).json({
            message: "Stats retrieved successfully",
            stats
        });
    } catch (error) {
        console.error("Fetch User Stats Error:", error);
        res.status(500).json({
            message: "Failed to fetch user stats",
            error: error.message,
        });
    }
}

/**
 * @desc Get global insights based on recent entries
 */
async function getGlobalInsightsController(req, res) {
    try {
        const userId = req.user.Id;

        // 1. Check Cache first
        const cachedInsights = await InsightsCache.findOne({ userId });
        const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 Hours

        if (cachedInsights && (Date.now() - new Date(cachedInsights.lastGenerated).getTime() < CACHE_DURATION)) {
            return res.status(200).json({
                message: "Insights retrieved from cache",
                insights: cachedInsights.data
            });
        }

        // 2. No Cache or Expired - Fetch Last 15 Entries
        const entries = await journalReportModel.find({ userId })
            .sort({ date: -1 })
            .limit(15);

        if (entries.length < 3) {
            return res.status(200).json({
                message: "Not enough entries for deep analysis yet",
                insights: { observations: [], advices: [], themes: [] }
            });
        }

        // 3. Prepare text for AI
        const entriesText = entries.map((en, i) => {
            return `Entry ${i+1} (${en.date.toDateString()}):\nTitle: ${en.title}\nContent: ${en.chat}\nReflections: ${en.reflection.join(', ')}`;
        }).join('\n\n---\n\n');

        // 4. Generate New Insights
        const insights = await generateGlobalInsights({ entriesText });

        // 5. Update/Save Cache
        if (cachedInsights) {
            cachedInsights.data = insights;
            cachedInsights.lastGenerated = Date.now();
            await cachedInsights.save();
        } else {
            await InsightsCache.create({
                userId,
                data: insights,
                lastGenerated: Date.now()
            });
        }
        
        res.status(200).json({
            message: "Insights generated successfully",
            insights
        });
    } catch (error) {
        console.error("Global Insights Error:", error);
        res.status(500).json({
            message: "Failed to generate insights",
            error: error.message
        });
    }
}
/**
 * @desc Delete a specific journal entry by ID
 */
async function deleteJournalController(req, res) {
    try {
        const { id } = req.params;
        const entry = await journalReportModel.findOneAndDelete({ _id: id, userId: req.user.Id });
        
        if (!entry) {
            return res.status(404).json({ message: "Journal entry not found or unauthorized to delete." });
        }
        
        res.status(200).json({ message: "Journal entry deleted successfully" });
    } catch (error) {
        console.error("Delete Journal Error:", error);
        res.status(500).json({ message: "Failed to delete journal entry", error: error.message });
    }
}

/**
 * @desc Modify a specific journal entry by ID
 */
async function modifyJournalController(req, res) {
    try {
        const { id } = req.params;
        const { chat, title, aiActive } = req.body;

        if (!chat) {
            return res.status(400).json({ message: "Journal entry (chat) is required" });
        }

        const existingEntry = await journalReportModel.findOne({ _id: id, userId: req.user.Id });
        
        if (!existingEntry) {
            return res.status(404).json({ message: "Journal entry not found or unauthorized to modify." });
        }

        let journalReportByAi;
        
        /* If AI is disabled by the user, skip the Gemini API call */
        if (aiActive === false) {
            journalReportByAi = {
                reflection: ["Private Entry - AI Analysis disabled"],
                gemini_response: {
                    calmness_score: 0,
                    anxious_score: 0,
                    productivity_score: 0,
                    sadness_score: 0,
                    happiness_score: 0
                }
            };
        } else {
            journalReportByAi = await generateJournalReport({ chat });
        }

        existingEntry.chat = chat;
        if (title) existingEntry.title = title;
        existingEntry.reflection = journalReportByAi.reflection;
        existingEntry.gemini_response = journalReportByAi.gemini_response;

        await existingEntry.save();

        res.status(200).json({
            message: "Journal modified successfully",
            entry: existingEntry
        });

    } catch (error) {
        console.error("Modify Journal Error:", error);
        res.status(500).json({ message: "Failed to modify journal entry", error: error.message });
    }
}

export default { 
    generateJournalReportController, 
    getJournalEntriesController, 
    getUserStatsController,
    getAIObservationsController: getGlobalInsightsController,
    deleteJournalController,
    modifyJournalController
};
