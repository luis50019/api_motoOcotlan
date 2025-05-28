import ErrorInfo from "../errors/errorInfo.js";
import ReservationServices from "../services/reservation.services.js";
class reservationController {
  static async getAllRerservation(req, res) {
    try {
      const response = await ReservationServices.allReservations();
      if (!response.status) {
        throw new ErrorInfo("Error al obtener las reservas", 400, [
          { path: "Error", message: "No se logro obtener las reservaciones" },
        ]);
      }
      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorInfo) {
        return res.status(error.statusCode).json({
          message: error.message,
          errors: error.getErrorsMessages(),
        });
      }
      res.status(500).json({
        message: "Error del servidor",
        errors: [{ path: "server", message: error.message }],
      });
    }
  }

  static async createReservation(req, res) {
    try {
      const response = await ReservationServices.create(req.body);
      if (!response.status) {
        throw new ErrorInfo("Error al crear la reserva", 400, [
          { path: "Error", message: "No se logro crear la reserva" },
        ]);
      }
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof ErrorInfo) {
        return res.status(error.statusCode).json({
          message: error.message,
          errors: error.getErrorsMessages(),
        });
      }
      res.status(500).json({
        message: "Error del servidor",
        errors: [{ path: "server", message: error.message }],
      });
    }
  }

  static async deleteReservation(req, res) {
    try {
      const {id} = req.params;
      const response = await ReservationServices.delete(id);
      if (response.status) {
        throw new ErrorInfo("Error al eliminar la reserva", 400, [
          { path: "Error", message: "No se logro eliminar la reserva" },
        ]);
      }
      res.status(201).json({message:"reservacion eliminada"});
    } catch (error) {
      if (error instanceof ErrorInfo) {
        return res.status(error.statusCode).json({
          message: error.message,
          errors: error.getErrorsMessages(),
        });
      }
      res.status(500).json({
        message: "Error del servidor",
        errors: [{ path: "server", message: error.message }],
      });
    }
  }

  static async findReservation(req,res){
    try {
      const {id} = req.params;
      const response = await ReservationServices.infoReservation(id);
      if (!response.status) {
        throw new ErrorInfo("Error al encontrar la reserva", 400, [
          { path: "Error", message: "No se logro encontrar la reserva" },
        ]);
      }
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof ErrorInfo) {
        return res.status(error.statusCode).json({
          message: error.message,
          errors: error.getErrorsMessages(),
        });
      }
      res.status(500).json({
        message: "Error del servidor",
        errors: [{ path: "server", message: error.message }],
      });
    }
  }
  
}

export default reservationController;
