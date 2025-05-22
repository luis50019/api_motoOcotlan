import ErrorInfo from "../errors/errorInfo.js";
import reservations from "../model/reservation.model.js";

class clientService {
  //metodo para cancelar un viaje

  static async cancelTrip(id) {
    try {
      const response = await reservations.findByIdAndUpdate(
        id,
        {
          $set: {
            "state.general": "finalizado",
            "state.details.detail": "cancelado por el cliente",
          },
        },
        { new: true }
      );

      if (!response) {
        throw new ErrorInfo("No se encontro el viaje", 400, [
          { path: "viaje", message: "No se encontro el viaje" },
        ]);
      }
      return {message:"viaje cancelado",status:true,data:[]};
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
export default clientService;
