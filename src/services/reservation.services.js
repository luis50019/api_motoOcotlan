import reservations from "../model/reservation.model.js";
import { validateReservartion } from "../schemas/reservation.schema.js";
import mongoose from "mongoose";
import ErrorInfo from "../errors/errorInfo.js";
import {generateCode} from "../functions/generateCode.js"
const limitePassage = 3;
class ReservationServices{

  //? Funciona para obetner las reservaciones dentro del sistema
  static async allReservations(id){
    try{
      const response = await reservations.find();
      if(response.length === 0){
        throw new ErrorInfo("No hay reservas",404,[
          {path:"reservations",message:"No hay reservaciones"}
        ]);
      }
      return {message:"reservaciones encontrads",status:true,data:response};
    }catch(error){
      console.log(error);
      if(error instanceof ErrorInfo){
        throw new ErrorInfo(error.message,error.statusCode,error.getErrorsMessages);
      }
      if(error instanceof mongoose.Error){
        throw new ErrorInfo(error.message,500,[{path:"reservations",message:"Error al obtener reservaciones"}]);
      }
      throw new Error("Error al obtener reservaciones");
    }
  }

  static async create(infoReservation){
    try{
      const isValid = validateReservartion(infoReservation);

      if(!isValid.success){
        console.log(isValid.error.issues);
        throw new ErrorInfo("Error al crear reservacion",400,isValid.error.issues);
      }
      const spaceNumber = limitePassage-infoReservation.numberPassages;
      const codeService = await generateCode();
      const newReservation = new reservations({
        passage:infoReservation.passage,
        numberPassages:infoReservation.numberPassages,
        driver:infoReservation.driver,
        rate:infoReservation.rate,
        route:{
          destination:{
            lat:infoReservation.destination.lat,
            lng:infoReservation.destination.lng
          },
          start:{
            lat:infoReservation.start.lat,
            lng:infoReservation.start.lng
          },
          distance:infoReservation.distance,
        },
        state:{
          details:{
            details: spaceNumber == 0? "sin espacio" : "con espacio",
            spaceNumber:spaceNumber
          }
        },
        security:{codeVerification:codeService}
      })

      const response = await newReservation.save();
      return {message:"reservacion creada",status:true,data:response};
      
    }catch(error){
      if (error instanceof ErrorInfo) {
        throw new ErrorInfo(
          error.message,
          error.statusCode,
          error.getErrorsMessages()
        );
      }
      if (error instanceof mongoose.Error) {
        throw new ErrorInfo(error.message, 500, [
          { path: "reservations", message: "Error al crear reservacion" },
        ]);
      }
      throw new Error("Error al creacr la reservacion");
    }
  }

  static async delete(id){
    try{
      const response = await reservations.findByIdAndDelete(id);
      if(!response){
        throw new ErrorInfo("No se encontro la reservacion",404,[
          {path:"reservations",message:"No se encontro la reservacion"}]);
      }
      
      return {message:"reservacion eliminada",status:true,data:[]};

    }catch(error){
      if (error instanceof ErrorInfo) {
        throw new ErrorInfo(
          error.message,
          error.statusCode,
          error.getErrorsMessages
        );
      }
      if (error instanceof mongoose.Error) {
        throw new ErrorInfo("Error al crear la reservacion", 500, [
          { path: "reservations", message: "Error al obtener reservaciones" },
        ]);
      }
      throw new Error("Error al obtener reservaciones");
    }
  }
  
  //metodo para cancelar viaje por parte del usaurios
  //metodo para finalizar viaje por parte del conductor
  //metodo para cancelar viaje por parte del conductor

}

export default ReservationServices;