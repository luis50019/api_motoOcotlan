import drivers from "../model/drivers.model.js";
import { registerValidate, loginValidate } from "../schemas/authSchema";
import ErrorAuth from "../erros/errorAuht.js";
import { hashPassword } from "../bcrypt/bcrypt.js";
import { createAccessToken } from "../jwt/jwt.js";

class driverController {
  static async registerNewDrivers(req, res) {
    try {
      const infoValid = registerValidate(req.body);

      if (!infoValid.success) {
        throw new ErrorAuth(
          "Error en la validacion de los datos",
          400,
          infoValid.error.issues,
        );
      }

      //validate if the phone already exists

      const phoneAlreadyExists = await drivers.findOne({
        phone_number: req.body.phone,
      });

      if (phoneAlreadyExists) {
        throw new ErrorAuth("Error el telefono ya existe", 409, [
          { path: "phone", message: "El telefono ya existe" },
        ]);
      }

      const passwordHash = await hashPassword(req.body.password);

      const newDriver = new drivers({
        name: req.body.username,
        email: req.body.email,
        phone_number: req.body.phone,
        password: passwordHash,
      });

      const dirver = await newDriver.save();

      res.status(201).json({
        message: "El conductor fue registrado correctamente",
        driver: {
          id: dirver._id,
          name: dirver.name,
          email: dirver.email,
          phone_number: dirver.phone_number,
        },
      });
    } catch (error) {
      if (error instanceof ErrorAuth) {
        return res.status(error.statusCode).json({
          message: error.message,
          errors: error.getErrorsMessages(),
        });
      }
      res.status(500).json({
        message: "Error interno del servidor",
        erros: [
          { path: "unknown", message: "Error desconocido" },
          { path: "unknown", msessage: "vuelva a instentar mas tarde" },
        ],
      });
    }
  }
}
