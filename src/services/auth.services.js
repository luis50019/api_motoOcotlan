import ErrorAuth from "../erros/errorAuht.js";
import { loginValidate, registerValidate } from "../schemas/authSchema.js";
import { createAccessToken } from "../jwt/jwt.js";
import users from "../model/client.model.js";
import { hashPassword, passwordValidate } from "../bcrypt/bcrypt.js";
import drivers from "../model/drivers.model.js";

class AuthServices {
  static async addUser(infoUser) {
    try {
      const isValidate = registerValidate(infoUser);
      if (!isValidate.success) {
        throw new ErrorAuth(
          "Error la informacion no es correcta",
          403,
          isValidate.error.issues
        );
      }

      const phoneAlreadyExists = await drivers.findOne({
        phone_number: infoUser.phone,
      });
      //validate already one user with equal email
      const userExist = await users.findOne({
        $or: [{ "basic_info.phone.number": infoUser.phone }],
      });

      if (userExist || phoneAlreadyExists) {
        throw new ErrorAuth("Los datos ya estan registrados", 409, [
          { path: "phone", message: "El teléfono ya esta registrado" },
        ]);
      }
      const passwordHash = await hashPassword(infoUser.password);
      //save new client
      const newUser = new users({
        basic_info: {
          name: infoUser.username,
          email: {
            address: "",
            verified: false,
          },
          phone: {
            number: infoUser.phone,
            country_code: infoUser.country_code || "+52",
            verified: false,
          },
          password: passwordHash,
          profile_picture:
            "https://res.cloudinary.com/dzqytawx9/image/upload/v1747181551/ylyhxbxyvaa4xxbuvryd.png",
        },
      });

      const userRegister = await newUser.save();

      const token = await createAccessToken({
        id: userRegister._id,
      });
      return { userRegister, type: phoneAlreadyExists?"dirver":"user", token };
    } catch (error) {
      if (error instanceof ErrorAuth) {
        throw new ErrorAuth(error.message, 409, error.errorsMessages);
      }
      throw new Error(error);
    }
  }

  static async loginUser(user) {
    try {
      const isValidate = loginValidate(user);
      if (!isValidate.success) {
        throw new ErrorAuth(
          "Error la informacion no es correcta",
          403,
          isValidate.error.issues
        );
      }
      //find user with his name and phone
      const userFound = await users.findOne({
        $and: [
          { "basic_info.name": user.username },
          { "basic_info.phone.number": user.phone || "" },
        ],
      });

      const driver = await drivers.findOne({
        $and: [
          { "basic_info.name": user.username },
          { "basic_info.phone.number": user.phone || "" },
        ],
      });

      if (!userFound && !driver) {
        throw new ErrorAuth("Datos incorrectos", 404, [
          { path: "name", message: "Verifique el nombre" },
          { path: "phone", message: "Vefifique el número" },
        ]);
      }

      const infoUserFound = userFound || driver;

      const passwordIsValid = await passwordValidate(
        user.password,
        infoUserFound.basic_info.password
      );

      if (!passwordIsValid) {
        throw new ErrorAuth("Error la contraseña no es correcta", 403, [
          { path: "c", message: "Verifique la contraseña" },
        ]);
      }
      const token = await createAccessToken({
        id: infoUserFound._id,
      });
      return { infoUserFound,type:driver?"driver":"user", token };
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorAuth) {
        throw new ErrorAuth(error.message, 409, error.errorsMessages);
      }
      throw new Error(error);
    }
  }
}

export default AuthServices;
