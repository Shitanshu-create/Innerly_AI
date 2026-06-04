import { z } from "zod";

const email = z.string({ error: "Email is required" })
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(254, "Email must be 254 characters or less");

const password = z.string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be 128 characters or less");

const registerSchema = z.object({
    username: z.string({ error: "Username is required" })
        .trim()
        .min(2, "Username must be at least 2 characters")
        .max(60, "Username must be 60 characters or less"),
    email,
    password
});

const loginSchema = z.object({
    email,
    password: z.string({ error: "Password is required" })
        .min(8, "Password must be at least 8 characters")
        .max(128, "Password must be 128 characters or less")
});

export { registerSchema, loginSchema };
