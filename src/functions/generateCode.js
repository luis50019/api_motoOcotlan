import mongoose from "mongoose";
import ErrorInfo from "../errors/errorInfo.js";

export const generateCode = async () => {
  try {
    const objectId = new mongoose.Types.ObjectId();
    return objectId.toString().substring(18,24).toUpperCase();
  } catch (error) {
    throw new ErrorInfo("Error al crear codigo", 500,[
      {path: "code", message: "Error al crear codigo"}
    ]);
  }
}
