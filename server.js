import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./expressApp.js";

dotenv.config({ path: "./config.env" });

const port = process.env.PORT || 80;
let server = app.listen(port, () => {
  console.log(`Application running on port: ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection!");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught exception!");
  console.log(err.name, err.message);
  process.exit(1);
});
