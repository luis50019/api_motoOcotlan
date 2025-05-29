import ErrorAuth from "../errors/errorAuht.js";
import AuthServices from "../services/auth.services.js";

class Auth {
  static async register(req, res) {
    try {
      
      const user = await AuthServices.addUser(req.body);

      res.status(200).json({
        user: user.userRegister.basic_info,
        access_token: { name: "access_token", value: user.token },
        type: user.type,
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

  
  //funcion login ---------------------------
  static async login(req, res) {
    try {
      console.log(req.body);
      const infoUser = await AuthServices.loginUser(req.body);
      console.log(infoUser);
      res.status(200).json({
        user: infoUser.infoUserFound.basic_info,
        id_user: infoUser.infoUserFound._id,
        type: infoUser.type,
        access_token: { name: "access_token", value: infoUser.token },
        message: "Inicio de sesion exitoso",
      });
    } catch (error) {
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
