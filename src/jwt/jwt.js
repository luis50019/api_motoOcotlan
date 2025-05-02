import jwt from "jsonwebtoken";
import "dotenv/config.js";

export function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.TOKEN_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      },
    );
  });
}

export function validateToken(token) {
  jwt.verify(token, process.env.TOKEN_SECRET, (err, usr) => {
    if (err) {
      return false;
    }
    return usr;
  });
}
