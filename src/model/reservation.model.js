import mongoose from "mongoose";

const reservationModel = new mongoose.Schema(
  {
    passage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    numberPassage:{
      type: Number,
  
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "drivers",
      required: true,
    },
    rate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rates",
      required: true,
    },
    route: {
      destination: {
        lat: Number,
        lng: Number,
      },
      start: {
        lat: Number,
        lng: Number,
      },
      distance: {
        type: Number,
        required: true,
      },
    },
    state: {
      general: {
        type: String,
        enum: ["pendiente","aceptado", "terminado", "cancelado","finalizado"],
        default:"pendiente",
      },
      details: {
        detail:{
          type: String,
          enum: [
            "con espacio",
            "sin espacio",
            "con problemas",
            "con problemas",
            "cancelado por pasajero",
            "cancelado por conductor",
          ],
        },
        spacenNumber:{
          type: Number,
        }
      },
    },
    security: {
      codeVerification: {
        type: String,
        required: true,
      },
    },
    comments: {
      rating: {
        overall: { type: Number, min: 1, max: 5 },
        categories: {
          punctuality: { type: Number, min: 1, max: 5 },
          vehicle: { type: Number, min: 1, max: 5 },
          driving: { type: Number, min: 1, max: 5 },
        },
      },
    },
    pay: {
      methodo: {
        type: String,
        enum: ["efectivo", "tarjeta"],
        default: "efectivo",
      },
      state: {
        type: String,
        enum: ["pendiente", "pagado"],
        default: "pendiente",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("reservations", reservationModel);