import express, { json } from "express";

import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRouter from "./routes/auth.routes.js";
import routerReviews from "./routes/reviews.routes.js";
import routerDriver from "./routes/driver.routes.js";
const app = express();

app.use(json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/driver",routerDriver);
app.use("/auth", authRouter);
app.use("/comments", routerReviews);

export default app;
