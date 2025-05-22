import { registerValidate, loginValidate } from "../schemas/authSchema.js";
import ErrorAuth from "../errors/errorAuht.js";
import DriverService from "../services/driver.services.js";
import ErrorInfo from "../errors/errorInfo.js";

class driverController {
  static async registerNewDrivers(req, res) {
    try {
      const infoValid = registerValidate(req.body);

      if (!infoValid.success) {
        throw new ErrorAuth(
          "Error en la validacion de los datos",
          400,
          infoValid.error.issues
        );
      }
      //validate if the phone already exists
      const driver = await DriverService.addNewDriver(req.body);

      res.status(201).json({
        message: "El conductor fue registrado correctamente",
        driver: {
          id: driver._id,
          name: driver.name,
          email: driver.email,
          phone_number: driver.phone_number,
        },
      });
    } catch (error) {
      console.log(error);
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

  //get one driver
  static async DriverById(req, res) {
    try {
      const { id } = req.params;

      const [infoDriver, reviewDriver] = await Promise.all([
        DriverService.getDriverByID(id),
        DriverService.ComentsByDriver(id),
      ]);

      res.status(200).json({
        data: infoDriver,
        reviews: reviewDriver,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorAuth) {
        return res.status(error.statusCode).json({
          message: error.message,
          errors: error.getErrorsMessages(),
        });
      }
      res.status(500).json({ message: error.message });
    }
  }

  //get all drivers
  static async getAllDrivers(req, res) {
    try {
      const infoDrivers = await DriverService.getAllDrivers();
      res.status(200).json({ data: infoDrivers });
    } catch (error) {
      if (error instanceof ErrorAuth) {
        return res.status(error.statusCode).json({
          message: error.message,
          errors: error.getErrorsMessages(),
        });
      }
      res.status(500).json({ message: error.message });
    }
  }

  static async getBetterDrivers(req, res) {
    try {
      const infoDrivers = await DriverService.BettersDrivers();
      res.status(200).json({ data: infoDrivers });
    } catch (error) {
      if (error instanceof ErrorAuth) {
        return res.status(error.statusCode).json({
          message: error.message,
          errors: error.getErrorsMessages(),
        });
      }
      res.status(500).json({ message: error.message });
    }
  }

  static async getCommentsDriver(req, res) {
    try {
      const { id } = req.params;
      const infoComments = await DriverService.ComentsByDriver(id);
      res.status(200).json({ data: infoComments });
    } catch (error) {
      if (error instanceof ErrorAuth) {
        return res.status(error.statusCode).json({
          message: error.message,
          errors: error.getErrorsMessages(),
        });
      }
      res.status(404).json({ message: error.message });
    }
  }

  static async getReservations(req, res) {
    try {
      const { id } = req.params;

      const allReservations = await DriverService.servicesPrivates(id);

      res.status(200).json({ data: allReservations });
    } catch (error) {
      if (error instanceof ErrorAuth) {
        return res.status(error.statusCode).json({
          message: error.message,
          errors: error.getErrorsMessages(),
        });
      }
      res.status(404).json({ message: error.message });
    }
  }

  static async acceptReservation(req, res) {
    try {
      const { id } = req.params;
      const response = await DriverService.accept(id);
      if (!response.status) {
        throw new ErrorInfo("No se pudo aceptar la reserva", 400, [
          { path: "unknown", message: "Error desconocido" },
        ]);
      }
      res.status(200).json({ message: response.message });
    } catch (error) {
      if (error instanceof ErrorAuth) {
        return res.status(error.statusCode).json({
          message: error.message,
          errors: error.getErrorsMessages(),
        });
      }
      res.status(404).json({ message: error.message });
    }
  }
  static async cancelReservation(req, res) {
    try {
      const { id } = req.params;
      const response = await DriverService.cancel(id);
      if (!response.status) {
        throw new ErrorInfo("No se pudo aceptar la reserva", 400, [
          { path: "unknown", message: "Error desconocido" },
        ]);
      }
      res.status(200).json({ message: response.message });
    } catch (error) {
      if (error instanceof ErrorAuth) {
        return res.status(error.statusCode).json({
          message: error.message,
          errors: error.getErrorsMessages(),
        });
      }
      res.status(404).json({ message: error.message });
    }
  }

  static async finishReservation(req, res) {
    try {
      const { id } = req.params;
      const response = await DriverService.finish(id);
      if (!response.status) {
        throw new ErrorInfo("No se pudo aceptar la reserva", 400, [
          { path: "unknown", message: "Error desconocido" },
        ]);
      }
      res.status(200).json({ message: response.message });
    } catch (error) {
      if (error instanceof ErrorInfo) {
        return res.status(error.statusCode).json({
          message: error.message,
          errors: error.getErrorsMessages(),
        });
      }
      res.status(404).json({ message: error.message });
    }
  }
}

export default driverController;
