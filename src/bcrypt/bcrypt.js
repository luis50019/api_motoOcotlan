import bcrypt from "bcryptjs";
import "dotenv/config.js";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));
};

export const passwordValidate = async (password, passwordFound) => {
  return await bcrypt.compare(password, passwordFound);
};
