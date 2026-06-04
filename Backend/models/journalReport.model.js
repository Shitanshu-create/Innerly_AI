import mongoose from 'mongoose';


const geminiResponseSchema = new mongoose.Schema({
    calmness_score: {
        type: Number,
        required: [true, "Calmness score is required"]
    },
    anxious_score: {
        type: Number,
        required: [true, "Confidence score is required"]
    },
    productivity_score: {
        type: Number,
        required: [true, "Clarity score is required"]
    },
    sadness_score: {
        type: Number,
        required: [true, "Clarity score is required"]
    },
    happiness_score: {
        type: Number,
        required: [true, "Clarity score is required"]
    },
});



const journalReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"]
    },
    date: {
        type: Date,
        required: [true, "Date is required"],
        default: () => new Date()
    },
    chat: {
        type: String,
        required: [true, "Message is required"]
    },
    title:{
        type: String,
        required: [true, "title is required"]
    },
    reflection: {
        type: Array,
        required: [true, "Reflection is required"]
    },
    media: [{
        data: Buffer,
        contentType: String,
        filename: String
    }],
    isPrivate: {
        type: Boolean,
        default: false,
        index: true
    },

    gemini_response: {
        type: geminiResponseSchema,
        required: [true, "Gemini response is required"]
    }
}, {
    timestamps: true
});






const JournalReport = mongoose.model("JournalReport", journalReportSchema);

export default JournalReport;
