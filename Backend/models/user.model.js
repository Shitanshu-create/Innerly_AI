import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: [ true, "Username already exists" ] },
    email: { type: String, required: true, unique: [ true, "Email already exists" ] },
    passwordHash: { type: String, default: null },
    provider: { type: String, enum: ["local", "google", "github"], default: "local" },
    providerId: { type: String, default: null },
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;