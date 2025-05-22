import { Router } from "express";
import RateController from "../controllers/rates.controller.js";

const routerRates = Router();

routerRates.post("/",RateController.registerRate);
routerRates.get("/",RateController.getRates)
routerRates.get("/search/:distance",RateController.getRateByDistance)

export default routerRates;
