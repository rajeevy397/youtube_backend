import dotenv from "dotenv";
import connectDB from "./db/dbConn.js";
import { app } from "./app.js";
// const app = require('./app.js');


dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server is running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!!", err);
  });
