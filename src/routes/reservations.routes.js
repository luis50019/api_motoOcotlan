import { Router } from "express";
import reservationController from "../controllers/reservations.controller.js";

const routerReservation = Router();

routerReservation.get("/",reservationController.getAllRerservation);
routerReservation.post("/",reservationController.createReservation);
routerReservation.delete("/:id",reservationController.deleteReservation);
routerReservation.get("/find/:id",reservationController.findReservation);

export default routerReservation;