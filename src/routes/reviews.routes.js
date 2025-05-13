import { Router } from "express";
import ReviewsController from "../controllers/reviews.controller.js";

const routerReviews = Router();

routerReviews.post("/", ReviewsController.register);
routerReviews.get("/:id", ReviewsController.ReviewsDrivers);

export default routerReviews;
