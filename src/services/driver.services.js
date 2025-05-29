import reservations from "../model/reservation.model.js";
import drivers from "../model/drivers.model.js";

import { hashPassword } from "../bcrypt/bcrypt.js";
import { createAccessToken } from "../jwt/jwt.js";

import users from "../model/client.model.js";
import ErrorAuth from "../errors/errorAuht.js";
import reviews from "../model/coment.model.js";
import ErrorInfo from "../errors/errorInfo.js";
import mongoose from "mongoose";

class DriverService {
  static async addNewDriver(driver) {
    try {
      const phoneAlreadyExists = await drivers.findOne({
        $or: [{ "basic_info.phone.number": driver.phone }],
      });
      const phoneAlreadyExistsOnUsers = await users.findOne({
        $or: [{ "basic_info.phone.number": driver.phone }],
      });

      if (phoneAlreadyExists || phoneAlreadyExistsOnUsers) {
        throw new ErrorAuth("Error el telefono ya existe", 409, [
          { path: "phone", message: "El telefono ya existe" },
        ]);
      }

      const passwordHash = await hashPassword(driver.password);

      const newDriver = new drivers({
        basic_info: {
          name: driver.username,
          email: {
            address: "",
            verified: false,
          },
          phone: {
            number: driver.phone,
            country_code: driver.country_code || "+52",
            verified: false,
          },
          password: passwordHash,
          profile_picture: driver.profile_picture,
        },
        rating: 1,
      });

      const driverSave = await newDriver.save();

      return driverSave;
    } catch (error) {
      if (error instanceof ErrorAuth) {
        throw new ErrorAuth(error.message, 409, error.errorsMessages);
      }
      if (error instanceof ErrorInfo) {
        throw new ErrorInfo(error.message, 409, [
          { path: "register", message: "Error al registrar usuario" },
        ]);
      }
      throw new Error(error);
    }
  }

  static async getDriverByID(id) {
    try {
      const dirverFound = await drivers.findById(id);

      if (!dirverFound) {
        throw new ErrorInfo("El usuarios no existe", 404, [
          { path: "id", message: "El usuario no existe" },
        ]);
      }
      return dirverFound;
    } catch (error) {
      if (error instanceof mongoose.Error) {
        throw new ErrorInfo(error.message, 404, error.errorsMessages);
      }
      throw new Error(error);
    }
  }

  static async ComentsByDriver(id) {
    try {
      const coments = await reviews.find({ "participants.driver_id": id });

      if (coments.length === 0) {
        return [];
      }
      return coments;
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorInfo) {
        throw new ErrorInfo(error.message, 404, error.errorsMessages);
      }
      if (error instanceof mongoose.Error) {
        throw new ErrorInfo(error.message, 409, [
          { path: "comenatarios", message: "Error al obtener comentarios" },
        ]);
      }
      throw new Error(error);
    }
  }

  static async BettersDrivers() {
    try {
      const betterDrivers = await drivers.find().sort({ rating: -1 }).limit(1);
      return betterDrivers;
    } catch (error) {
      if (error instanceof ErrorInfo) {
        throw new ErrorInfo(error.message, 404, error.errorsMessages);
      }
      if (error instanceof mongoose.Error) {
        throw new ErrorInfo(error.message, 409, [
          {
            path: "mejores conductores",
            message: "Error al obtener mejores conductores",
          },
        ]);
      }
    }
  }

  static async getAllDrivers() {
    try {
      const driversFound = await drivers.find();
      return driversFound;
    } catch (error) {
      if (error instanceof ErrorInfo) {
        throw new ErrorInfo(error.message, 404, error.errorsMessages);
      }
      if (error instanceof mongoose.Error) {
        throw new ErrorInfo(error.message, 409, [
          { path: "conductores", message: "Error al obtener los conductores" },
        ]);
      }
      throw new Error("Error al obtener a los conductores");
    }
  }

  static async servicesPrivates(id) {
    try {
      const services = await reservations
        .find({
          driver: id,
          "state.general": "pendiente",
        })
        .populate("users") // Trae la información del pasajero
        .populate("drivers") // Trae la información del conductor
        .populate("rates") // Trae la información de la tarifa
        .exec(); // Ejecuta la consulta

      if (services.length === 0) {
        return {
          message: "No hay servicios viajes reservados",
          status: true,
          data: [],
        };
      }

      return { message: "Servicios reservados", status: true, data: services };
    } catch (error) {
      if (error instanceof ErrorInfo) {
        throw new ErrorInfo(error.message, 404, error.errorsMessages);
      }
      if (error instanceof mongoose.Error) {
        throw new ErrorInfo(error.message, 409, [
          {
            path: "conductores",
            message: "Error al obtener los viajes reservados",
          },
        ]);
      }
      throw new Error("Error al obtener los viajes reservados");
    }
  }

  static async accept(id) {
    try {
      const response = await reservations.findByIdAndUpdate(
        id,
        {
          $set: {
            "state.general": "aceptado",
          },
        },
        { new: true }
      );
      if (!response) {
        throw new ErrorInfo("No se encontro el viaje", 404, [
          { path: "id", message: "No se encontro el viaje" },
        ]);
      }
      return { message: "Viaje aceptado", status: true, data: response };
    } catch (error) {
      if (error instanceof ErrorInfo) {
        throw new ErrorInfo(error.message, 404, error.errorsMessages);
      }
      if (error instanceof mongoose.Error) {
        throw new ErrorInfo(error.message, 409, [
          { path: "conductores", message: "Error al obtener los conductores" },
        ]);
      }
      throw new Error("Error al obtener a los conductores");
    }
  }
  static async cancel(id) {
    try {
      const response = await reservations.findByIdAndUpdate(
        id,
        {
          $set: {
            "state.general": "cancelado",
            "state.details.detail": "cancelado por conductor",
          },
        },
        { new: true }
      );
      if (!response) {
        throw new ErrorInfo("No se encontro el viaje", 404, [
          { path: "id", message: "No se encontro el viaje" },
        ]);
      }
      return { message: "Viaje cencelado", status: true, data: response };
    } catch (error) {
      if (error instanceof ErrorInfo) {
        throw new ErrorInfo(error.message, 404, error.errorsMessages);
      }
      if (error instanceof mongoose.Error) {
        throw new ErrorInfo(error.message, 409, [
          { path: "conductores", message: "Error al obtener los conductores" },
        ]);
      }
      throw new Error("Error al obtener a los conductores");
    }
  }
  static async finish(id) {
    try {
      const response = await reservations.findByIdAndUpdate(
        id,
        { $set: { "state.general": "finalizado" } },
        { new: true }
      );
      if (!response) {
        throw new ErrorInfo("No se encontro el viaje", 404, [
          { path: "id", message: "No se encontro el viaje" },
        ]);
      }
      return { message: "Viaje finalizado", status: true, data: response };
    } catch (error) {
      if (error instanceof ErrorInfo) {
        throw new ErrorInfo(error.message, 404, error.errorsMessages);
      }
      if (error instanceof mongoose.Error) {
        throw new ErrorInfo(error.message, 409, [
          { path: "conductores", message: "Error al obtener los conductores" },
        ]);
      }
      throw new Error("Error al obtener a los conductores");
    }
  }
  static async verifiedCode(code,idReservation){
      // Busca la reservación por ID
    const reservation = await reservations.findById(idReservation);

    if (!reservation) {
      console.log('Reservación no encontrada');
      return false;
    }

    // Compara el código recibido con el almacenado
    if (reservation.security.codeVerification === code) {
      console.log('Código correcto');
      return true;
    } else {
      console.log('Código incorrecto');
      return false;
    }
  } catch (error) {
    throw new Error("codigo incorrecto");
  }
}

export default DriverService;
