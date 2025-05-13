import { Router } from "express";
import driverController from "../controllers/drivers.controller.js";

const routerDriver = Router();

routerDriver.get("/better", driverController.getBetterDrivers);
routerDriver.get("/:id",driverController.DriverById);
routerDriver.get("/",driverController.getAllDrivers);
routerDriver.get("/comments/:id",driverController.getCommentsDriver);


export default routerDriver;
