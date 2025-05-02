import mongoose from "mongoose";
import "dotenv/config.js";

const conectDB = async () => {
  try {
    await mongoose.connect(process.env.URL_BASE_LOCAL);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Error al conectarse a la base de datos");
  }
};

export default conectDB;
