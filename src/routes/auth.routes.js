import { Router } from "express";
import Auth from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", Auth.register);
authRouter.post("/login", Auth.login);
authRouter.post("/logout", Auth.logout);

export default authRouter;
