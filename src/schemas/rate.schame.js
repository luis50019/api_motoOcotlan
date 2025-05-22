import { z } from "zod";
import { isValidObjectId } from "mongoose";

const schemaRate = z.object({
  distanceMin: z.number().refine((val) => !isNaN(val), {
    message: "La distancia debe ser un número",
  }),
  distanceMax: z.number().refine((val) => !isNaN(val), {
    message: "La distancia debe ser un número",
  }),
  price: z.number().min(5, { message: "El valor mínimo debe ser 5" }),
  idRatePersonality: z
    .string()
    .refine((value) => isValidObjectId(value), {
      message: "Invalid MongoDB ObjectId for user",
    })
    .optional(),
});

export const validateRate = (object) => {
  return schemaRate.safeParse(object);
};
