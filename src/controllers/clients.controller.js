import clientService from "../services/clients.services.js";

class clientController {
  static async cancelService(req, res) {
    try {
      const { id } = req.params;
      const response = await clientService.cancelTrip(id);

      if (!response.status) {
        return res.status(400).json({ message: "El viaje no logro cancelar" });
      } else {
        return res.status(200).json({ message: "Viaje cancelado" });
      }
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
}

export default clientController;
