import UserModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import tokenBlacklistModel from "../models/blacklist.model.js";

/**
 * @name registerUserController
 * @description register a new user
 * @access Public
 */
async function registerUserController(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json(
            { message: "Username, email, and password are required" }
        );
    }

    const userAlreadyExists = await UserModel.findOne({
        $or: [{ username }, { email }]
    });

    if (userAlreadyExists) {
        return res.status(400).json(
            { message: "User with that username or email already exists" }
        );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
        username,
        email,
        passwordHash,
    });

    const token = jwt.sign(
        {
            Id: newUser._id,
            username: newUser.username
        },
        process.env.jwtSecret,
        { expiresIn: "1d" }
    );

    await newUser.save();

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(201).json(
        {
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            },
        }
    );

}




/**
 * @name loginUserController
 * @description Login a user
 * @access Public
 */
async function loginUserController(req, res) {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
        return res.status(400).json(
            { message: "Email and password are Wrong" }
        );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
        return res.status(400).json(
            { message: "Email and password are Wrong" }
        );
    }

    const token = jwt.sign(
        { Id: user._id, username: user.username },
        process.env.jwtSecret,
        { expiresIn: "1d" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json(
        {
            message: "User logged in successfully",
            user: { id: user._id, username: user.username, email: user.email },
        }
    );

}



/**
 * @name logoutUserController
 * @description Logout a user
 * @access Public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token;

    if (token) {
        await tokenBlacklistModel.create({ token });
    }

    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax"
    });

    res.status(200).json({ message: "User logged out successfully" });
}


/**
 * @name getMeController
 * @description Get current user information
 * @access Private
 */
async function getMeController(req, res) {
    const user = await UserModel.findById(req.user.Id);

    res.status(200).json({
        message: "User information retrieved successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email

        }
    }
    );
}

export default { registerUserController, loginUserController, logoutUserController, getMeController };