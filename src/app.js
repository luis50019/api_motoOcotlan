import express, { json } from "express";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
const app = express();

app.use(json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/auth", authRouter);

export default app;
