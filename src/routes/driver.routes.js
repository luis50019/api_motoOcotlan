import { Router } from "express";
import driverController from "../controllers/drivers.controller.js";

const routerDriver = Router();

routerDriver.get("/better", driverController.getBetterDrivers);
routerDriver.get("/:id",driverController.DriverById);
routerDriver.get("/",driverController.getAllDrivers);
routerDriver.get("/comments/:id",driverController.getCommentsDriver);
routerDriver.get("/reservations/:id",driverController.getReservations);
routerDriver.put("/reservations/accept/:id", driverController.acceptReservation);
routerDriver.put("/reservations/cancel/:id", driverController.cancelReservation);
routerDriver.put("/reservations/finish/:id", driverController.finishReservation);
routerDriver.post("/reservations/verify/", driverController.verify);


export default routerDriver;
