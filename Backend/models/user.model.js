import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: [ true, "Username already exists" ] },
    email: { type: String, required: true, unique: [ true, "Email already exists" ] },
    passwordHash: { type: String, required: true },
}, { timestamps: true });

const UserModel = mongoose.model("User", userSchema);

export default UserModel;