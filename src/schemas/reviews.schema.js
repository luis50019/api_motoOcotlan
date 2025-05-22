import { z } from "zod";
import { isValidObjectId } from "mongoose";

const reviewsSchema = z.object({
  idUser: z.string().refine((value) => isValidObjectId(value), {
    message: "Invalid MongoDB ObjectId for user",
  }),
  idDriver: z.string().refine((value) => isValidObjectId(value), {
    message: "Invalid MongoDB ObjectId for driver",
  }),
  comment: z.string().min(1, {
    message: "Comment is required and cannot be empty",
  }),
  rating: z.number().min(1).max(5, {
    message: "Rating must be between 1 and 5",
  }),
  photo: z.string().url().optional().or(z.literal("")).optional(),
});

const validateReviews = (object) => {
  // Corregido: Función bien definida
  return reviewsSchema.safeParse(object);
};

export default validateReviews;
