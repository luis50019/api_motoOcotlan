import { Router } from "express";
import clientController from "../controllers/clients.controller.js";

const routerClient = Router();

routerClient.put("/service/cancel/:id",clientController.cancelService);

export default routerClient;
