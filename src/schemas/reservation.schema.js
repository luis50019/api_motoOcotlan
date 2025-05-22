import mongoose from "mongoose";
import { z } from "zod";

const reservationSchema = z.object({
  passage: z
    .string()
    .min(1, "El ID del pasajero es requerido")
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "ID de pasajero inválido",
    }),

  numberPassage: z
    .number()
    .int("Debe ser un número entero")
    .positive("Debe ser un número positivo")
    .optional(),

  driver: z
    .string()
    .min(1, "El ID del conductor es requerido")
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "ID de conductor inválido",
    }),

  rate: z
    .string()
    .min(1, "El ID de la tarifa es requerido")
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "ID de tarifa inválido",
    }),
  destination: z.object({
    lat: z.number({ message: "Debe ser un numero" }),
    lng: z.number({ message: "Debe ser un numero" }),
  }),
  start: z.object({
    lat: z.number({ message: "Debe ser un numero" }),
    lng: z.number({ message: "Debe ser un numero" }),
  }),
  distance: z.number({ message: "Debe ser un numero" }).min(0, "Debe ser un numero positivo"),
});

export const validateReservartion =(object)=>{
  return reservationSchema.safeParse(object);
}
