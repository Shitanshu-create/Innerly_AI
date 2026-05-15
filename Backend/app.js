import express from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import journalRouter from "./routes/journal.route.js";


const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use("/api/auth", authRouter);
app.use("/api/journal", journalRouter);


export default app;