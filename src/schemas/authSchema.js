import z from "zod";

const registerSchema = z.object({
  username: z
    .string()
    .min(6, { message: "El nombre debe de tener almenos 6 carcateres" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe de tener almenos 6 caracteres" }),
  phone: z
    .string()
    .min(10, { message: "Deben de ser minimo 10 dijitos" })
    .max(10, { message: "Deben de ser maximo 10 dijitos" })
    .optional(),
});

const loginSchema = z.object({
  username: z
    .string()
    .min(6, { message: "El nombre debe de tener almenos 6 carcateres" }),
  phone: z
    .string()
    .min(8, { message: "Deben de ser minimo 10 dijitos" })
    .max(10, { message: "Deben de ser maximo 10 dijitos" })
    .optional(),
  password: z
    .string()
    .min(6, { message: "La contraseña debe de tener almenos 6 carcateres" }),
});

export const registerValidate = (object) => {
  return registerSchema.safeParse(object);
};

export const loginValidate = (object) => {
  return loginSchema.safeParse(object);
};
