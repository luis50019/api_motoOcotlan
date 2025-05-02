import app from "./app.js";
import "dotenv/config";
import conectDB from "./db/mongo.js";

conectDB();
app.listen(process.env.PORT, () =>
  console.log(`http://localhost:${process.env.PORT}`),
);
