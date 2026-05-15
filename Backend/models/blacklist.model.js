import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true , "Token is required"], 
        unique: true
    },
}, { timestamps: true });

const tokenBlacklistModel = mongoose.model("TokenBlacklist", blacklistTokenSchema);

export default tokenBlacklistModel;



