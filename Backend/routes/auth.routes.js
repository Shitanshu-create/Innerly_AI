import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", authController.registerUserController);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRouter.post("/login", authController.loginUserController);

/**
 * @route GET /api/auth/logout
 * @desc Logout a user
 * @access Public
 */
authRouter.post("/logout", authController.logoutUserController);


/**
 * @route GET /api/auth/get-me
 * @desc Give user information
 * @access Private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController);


export default authRouter;