import mongoose from "mongoose";
import ErrorInfo from "../errors/errorInfo.js";
import raterService from "../services/rates.services.js";
import RateService from "../services/rates.services.js";

class RateController {
  //INFO: función para crear una nueva tarifa
  static async registerRate(req, res) {
    try {
      const response = await raterService.createNewRate(req.body);
      if (response.status) {
        return res.status(200).json({
          message: response.message,
          data: response.data,
        });
      }
      res.status(409).json({
        message: "Tarifa registrada con exito",
      });
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
  //INFO: función para actualizar una tarifa
  static async updateRate(req, res) {
    try {
      const { id } = req.params;
      const response = await raterService.update(id, req.body);
      if (response.status === 200) {
        return res.status(200).json({
          message: response.message,
          data: response.data,
        });
      }
      //INFO:
      res.status(409).json({
        message: "No se logro actualizar la tarifa",
        data: {},
      });
    } catch (error) {
      if (error instanceof ErrorInfo) {
        return res.status(error.status).json({
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
  //INFO: función para eliminar una tarifa
  static async deleteRate(req, res) {
    try {
      const { id } = req.params;
      const response = await raterService.delete(id);
      if (response.status) {
        res.status(response.codeStatus).json({
          message: response.message,
          data: {},
        });
      }
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

  static async getRates(req, res) {
    try {
      const response = await raterService.getAllRates();
      if (response.status) {
        return res.status(200).json({
          message: response.message,
          data: response.data,
        });
      }
      res.status(409).json({
        message: "No se logro obtener las tarifas",
        data: {},
      });
    } catch (error) {
      if (error instanceof ErrorInfo) {
        return res.status(error.status).json({
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

  static async getRateByDistance(req,res){
    try {
      const {distance} = req.params;
      const response = await RateService.byDistance(distance);
      if(!response.status){
        throw new ErrorInfo("Error al encontrar la distancia",409,[
          {path:"Tarifas",message:"No se enconttro la tarifa"}
        ]);
      }
      return res.status(200).json({
        message: response.message,
        data: response.data,
      });

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

export default RateController;
