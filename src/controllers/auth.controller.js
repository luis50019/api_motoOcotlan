import ErrorAuth from "../erros/errorAuht.js";
import { loginValidate, registerValidate } from "../schemas/authSchema.js";
import { createAccessToken } from "../jwt/jwt.js";
import users from "../model/client.model.js";
import { hashPassword, passwordValidate } from "../bcrypt/bcrypt.js";

class Auth {
  static async register(req, res) {
    try {
      const isValidate = registerValidate(req.body);
      if (!isValidate.success) {
        throw new ErrorAuth(
          "Error la informacion no es correcta",
          403,
          isValidate.error.issues,
        );
      }
      //validate already one user with equal email
      const userExist = await users.findOne({
        $or: [{ "basic_info.phone.number": req.body.phone }],
      });

      if (userExist) {
        console.log(userExist);
        throw new ErrorAuth("Los datos ya estan registrados", 409, [
          { path: "phone", message: "El teléfono ya esta registrado" },
        ]);
      }
      const passwordHash = await hashPassword(req.body.password);
      //save new client
      const newUser = new users({
        basic_info: {
          name: req.body.username,
          email: {
            address: "",
            verified: false,
          },
          phone: {
            number: req.body.phone,
            country_code: req.body.country_code || "+52",
            verified: false,
          },
          password: passwordHash,
        },
      });

      const userRegister = await newUser.save();

      const token = await createAccessToken({
        id: userRegister._id,
      });

      res.status(200).json({
        user: userRegister.basic_info,
        access_token: { name: "access_token", value: token },
        message: "Inicio de sesion exitoso",
      });
    } catch (e) {
      if (e instanceof ErrorAuth) {
        return res.status(e.statusCode).json({
          message: e.message,
          errors: e.getErrorsMessages(),
        });
      }
      res.status(500).json({
        message: "Error interno del servidor",
        errors: [
          {
            path: "server",
            message: "problema de conexion",
          },
          {
            path: "server",
            message: "Si el problema persiste contactenos a 951-128-29-20",
          },
        ],
      });
    }
  }

  static async login(req, res) {
    try {
      const isValidate = loginValidate(req.body);
      if (!isValidate.success) {
        throw new ErrorAuth(
          "Error la informacion no es correcta",
          403,
          isValidate.error.issues,
        );
      }

      //find user with his email
      const userFound = await users.findOne({
        $and: [
          { "basic_info.name": req.body.username },
          { "basic_info.phone.number": req.body.phone || "" },
        ],
      });
      if (!userFound) {
        throw new ErrorAuth("Datos incorrectos", 404, [
          { path: "name", message: "Verifique el nombre" },
          { path: "phone", message: "Vefifique el número" },
        ]);
      }
      const passwordIsValid = await passwordValidate(
        req.body.password,
        userFound.basic_info.password,
      );

      if (!passwordIsValid) {
        throw new ErrorAuth("Error la contraseña no es correcta", 403, [
          { path: "c", message: "Verifique la contraseña" },
        ]);
      }
      const token = await createAccessToken({
        id: userFound._id,
      });

      res.status(200).json({
        user: userFound.basic_info,
        access_token: { name: "access_token", value: token },
        message: "Inicio de sesion exitoso",
      });
    } catch (error) {
      console.log(error);
      if (error instanceof ErrorAuth) {
        return res.status(error.statusCode).json({
          message: error.message,
          errors: error.getErrorsMessages(),
        });
      }
      res.status(500).json({
        message: "Error interno del servidor",
        errors: [
          {
            path: "server",
            message: "problema de conexion",
          },
          {
            path: "server",
            message: "Si el problema persiste contactenos a 951-128-29-20",
          },
        ],
      });
    }
  }

  static async logout(req, res) {
    try {
      res.status(200).json({ message: "Sesion cerrada" });
    } catch (error) {
      res.status(500).json({
        message: "Error interno del servidor",
        errors: [
          "Ocurrio un error vuelva a intentarlo",
          "Si el problema persiste contactenos a 951-128-29-20",
        ],
      });
    }
  }
}

export default Auth;
