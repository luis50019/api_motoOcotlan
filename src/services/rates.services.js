import rates from "../model/rates.model.js";
import { validateRate } from "../schemas/rate.schame.js";
import ErrorInfo from "../errors/errorInfo.js";
import mongoose from "mongoose";

class RateService {
  //INFO: funcion para crear una nueva tarifa
  static async createNewRate(infoRate) {
    try {
      
      const response = await rates.find({
        $and: [
          { distanceMin: infoRate.distanceMin}, //buscar que sea mayor o igual
          { distanceMax: infoRate.distanceMax}, //buscar que sea menor a mayor
        ],
      });
      if(response.length >0){
        throw new ErrorInfo("Tarifa ya registrada",400,[{ path: "distance", message: "Tarifa ya registrada" } ]);
      }

      const infoValidate = validateRate(infoRate);

      if (!infoValidate.success) {
        throw new ErrorInfo(
          "Error datos no validos",
          200,
          infoValidate.error.issues,
        );
      }

      const newRate = new rates({
        pricingType: {
          global: {
            price: infoRate.price,
            isActive: true,
          },
          cumstomized: [],
        },
        stopPricing: {
          pricePerStop: 0,
          maxStopsAllowed: 5,
          isActive: true,
        },
        distanceMin: infoRate.distanceMin,
        distanceMax: infoRate.distanceMax,
        isActive: true,
      });

      const rateSaved = await newRate.save();
      return { data: rateSaved, message: "Tarifa registrada", status: true };
    } catch (error) {
      console.log(error)
      if (error instanceof ErrorInfo) {
        throw new ErrorInfo(error.message, 409, error.getErrorsMessages());
      }

      if (error instanceof mongoose.Error) {
        throw new ErrorInfo(error.message, 409, [
          { path: "register", message: "Error al registrar tarifa" },
        ]);
      }
      throw new Error("Error del servidor");
    }
  }
  //INFO: ------- funtion fot updating data -----------------
  static async update(idRate, newInfoRate) {
    try {
      const infoValidate = validateRate(newInfoRate);

      if (!infoValidate.success) {
        throw new ErrorInfo(
          "Error datos no validos",
          200,
          infoValidate.error.issues,
        );
      }

      const rateFound = await rates.findById(idRate);

      if (!rateFound) {
        throw new ErrorInfo("Error no existe la tarifa", 200, [
          { path: "id", message: "Error no existe la tarifa" },
        ]);
      }
      return { message: "Tarifa actualizada", status: true };
    } catch (error) {
      if (error instanceof ErrorInfo) {
        throw new ErrorInfo(error.message, 409, error.getErrorsMessages());
      }

      if (error instanceof mongoose.Error) {
        throw new ErrorInfo(error.message, 409, [
          { path: "id", message: "Error al buscar en la base de datos" },
          {
            path: "Error de busqueda",
            message: "Si el error persiste intente mas tarde",
          },
        ]);
      }
      throw new Error("Error del servidor");
    }
  }
  //INFO: función delete
  static async delete(idRate) {
    try {
      const rateDeleted = await rates.findByIdAndDelete(idRate);

      if (!rateDeleted) {
        throw new ErrorInfo("Error no existe la tarifa", 200, [
          { path: "id", message: "La tariafa no  pudo ser eliminada" },
          { path: "Error", message: "Si el error persiste intente mas tarde" },
        ]);
      }

      return { message: "tarifa eliminada", status: true, codeStatus: 200 };
    } catch (e) {
      if (e instanceof ErrorInfo) {
        throw new ErrorInfo(e.message, 409, e.getErrorsMessages());
      }
      if (e instanceof mongoose.Error) {
        throw new ErrorInfo(e.message, 409, [
          {
            path: "Error",
            message: "Hubo un error tratar de eliminar la tarfia",
          },
          {
            path: "Error",
            message: "Si el problema persiste intente mas tarde",
          },
        ]);
      }
      throw new Error("Error del servidor");
    }
  }

  //INFO: funcion para ontener todas las tarifas
  static async getAllRates() {
    try {
      const ratesData = await rates.find();
      if (rates.length === 0) {
        throw new ErrorInfo("No hay tarifas registradas", 200, [
          { path: "tarifas", message: "No hay tarifas registradas" },
        ]);
      }
      return { message: "Tarifas encontradas", status: true, data: ratesData };
    } catch (e) {
      if (e instanceof ErrorInfo) {
        throw new ErrorInfo(e.message, 409, e.getErrorsMessages());
      }
      if (e instanceof mongoose.Error) {
        throw new ErrorInfo(e.message, 409, [
          { path: "Error", message: "Error al obtener tarifas" },
          {
            path: "Error",
            message: "Si el problema persiste intente mas tarde",
          },
        ]);
      }
      throw new Error("Error del servidor");
    }
  }
  //INFO:function to get a rate by id
  static async getRateByID(idRate) {
    try {
      const rateFound = await rates.findById(idRate);

      if (!rateFound) {
        throw new ErrorInfo("Error no existe la t:arifa", 200, [
          { path: "id", message: "Error no existe la tarifa" },
        ]);
      }
      return { message: "Tarifa encontrada", status: true, data: rateFound };
    } catch (e) {
      if (e instanceof ErrorInfo) {
        throw new ErrorInfo(e.message, 409, e.getErrorsMessages());
      }

      if (e instanceof mongoose.Error) {
        throw new ErrorInfo(e.message, 409, [
          { path: "Error", message: "Error al buscar la tarifa" },
          {
            path: "Error",
            message: "Si el problema persiste intente mas tarde",
          },
        ]);
      }
      throw new Error("Error del servidor");
    }
  }

  static async byDistance(distance) {
    try {

      const response = await rates.findOne({
        $or: [
          { distanceMin: { $gte: distance } },
          { distanceMax: { $gte: distance } }, 
        ],
      });
      
      console.log(response);

      if (!response) {
        throw new ErrorInfo("Tarifa no ecnontrada",409,[{
          path: "distance",message:"tarifa no encontrada"
        }]);
      }
      return { message: "Tarifa encontrada", status: true, data: response };  
    } catch (e) {
      if (e instanceof ErrorInfo) {
        throw new ErrorInfo(e.message, 409, e.getErrorsMessages());
      }

      if (e instanceof mongoose.Error) {
        throw new ErrorInfo(e.message, 409, [
          { path: "Error", message: "Error al buscar la tarifa" },
          {
            path: "Error",
            message: "Si el problema persiste intente mas tarde",
          },
        ]);
      }
      throw new Error("Error del servidor");
    }
  }
}
export default RateService;
