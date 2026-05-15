import { GoogleGenAI, Type } from "@google/genai";
import journalReportModel from "../models/journalReport.model.js";

/* ── Response schema for structured chat replies ── */
const chatResponseSchema = {
    type: Type.OBJECT,
    properties: {
        paragraphs: {
            type: Type.ARRAY,
            description: "2-4 paragraphs of the AI's response. Each paragraph should be a thoughtful, warm, and insightful response.",
            items: { type: Type.STRING }
        },
        highlight: {
            type: Type.NUMBER,
            description: "The 0-based index of the paragraph that is the most important or insightful to visually emphasise."
        },
        followUpSuggestions: {
            type: Type.ARRAY,
            description: "3-4 short follow-up questions the user might want to ask next, based on the conversation context.",
            items: { type: Type.STRING }
        }
    },
    required: ["paragraphs", "highlight", "followUpSuggestions"]
};

/**
 * Build a context string from the user's journal entries
 */
function buildJournalContext(entries) {
    if (!entries || entries.length === 0) {
        return "The user has not written any journal entries yet. Encourage them to start journaling and offer general mental health and wellness guidance.";
    }

    const summaries = entries.map((entry, idx) => {
        const date = new Date(entry.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const mood = entry.gemini_response;
        const moodStr = mood
            ? `Calmness: ${mood.calmness_score}/10, Anxiety: ${mood.anxious_score}/10, Productivity: ${mood.productivity_score}/10, Sadness: ${mood.sadness_score}/10, Happiness: ${mood.happiness_score}/10`
            : 'No mood data';
        const reflections = entry.reflection && entry.reflection.length > 0
            ? entry.reflection.join('; ')
            : 'No reflections';

        return `--- Entry ${idx + 1} ---
Date: ${date}
Title: ${entry.title}
Mood Scores: ${moodStr}
Key Reflections: ${reflections}
Full Text: ${entry.chat}`;
    });

    return `Here are the user's recent journal entries (most recent first):\n\n${summaries.join('\n\n')}`;
}

/**
 * Chat with the AI using journal context and conversation history.
 * @param {string} userId - The logged-in user's ID
 * @param {string} message - The user's current message
 * @param {Array} conversationHistory - Previous messages [{role: 'user'|'ai', text: string}]
 */
async function chatWithJournalContext({ userId, message, conversationHistory = [] }) {
    const ai = new GoogleGenAI({
        apiKey: process.env.GOOGLE_GENAI_API_KEY,
    });

    /* Fetch last 15 entries for context */
    const entries = await journalReportModel.find({ userId })
        .sort({ date: -1 })
        .limit(15)
        .select('date title chat reflection gemini_response');

    const journalContext = buildJournalContext(entries);

    const systemInstruction = `You are Innerly — a warm, perceptive, and emotionally intelligent AI companion embedded in a personal journaling app. Your role is to help the user understand their own mental health patterns, emotions, and growth over time by drawing on their journal entries.

PERSONALITY & TONE:
- Speak like a wise, caring friend — never clinical or robotic
- Use gentle, reflective language. Favour warmth over formality
- Be observant: notice patterns, connections, and recurring themes across entries
- Never diagnose or prescribe. You are a mirror, not a doctor
- Celebrate small wins and gently surface areas for reflection
- Use phrases like "I noticed…", "It seems like…", "There's a quiet pattern here…"
- Keep responses concise but meaningful — quality over quantity

CAPABILITIES:
- You have access to the user's recent journal entries below. Use them to give personalised, specific answers
- When asked about moods, patterns, or past events, reference specific dates and entry content
- If asked about something not in the journals, say so honestly and offer general guidance
- You can discuss mental health topics like stress, anxiety, sleep, gratitude, relationships, and productivity
- Suggest actionable, gentle steps — never overwhelming lists

BOUNDARIES:
- Never fabricate journal content that doesn't exist
- If the user seems in crisis, gently suggest professional help
- Keep the conversation supportive and non-judgmental

${journalContext}`;

    /* Build the full prompt with system instruction + conversation context */
    let fullPrompt = systemInstruction + "\n\n";

    /* Add previous conversation turns */
    for (const msg of conversationHistory) {
        if (msg.role === 'user') {
            fullPrompt += `User: ${msg.text}\n\n`;
        } else {
            fullPrompt += `Innerly: ${msg.text}\n\n`;
        }
    }

    /* Add the current user message */
    fullPrompt += `User: ${message}\n\nNow respond as Innerly to the user's latest message above.`;

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents: fullPrompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: chatResponseSchema,
        }
    });

    const result = JSON.parse(response.text);
    return result;
}

export { chatWithJournalContext };
