import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
// import globalErrorHandler from "./controllers/errorController.js";
import cookieParser from "cookie-parser";
// import userRouter from "./routes/userRouter.js";
// import postRouter from "./routes/postRouter.js";
// import viewRouter from "./routes/viewRouter.js";
import morgan from "morgan";
import livereload from "livereload";
import connectLiveReload from "connect-livereload";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express();

// if (process.env.NODE_ENV.trim() === "development") {
//   const liveReloadServer = livereload.createServer();
//   liveReloadServer.server.once("connection", () => {
//     setTimeout(() => {
//       liveReloadServer.refresh("/");
//     }, 50);
//   });
// }
// app.use(connectLiveReload());
// app.use(morgan("dev"));

/**************************************************/
// MIDDLEWARES
/**************************************************/
// Define templating engine and template directory.
app.set("views", "./views");
app.set("view engine", "ejs");
// Serve static files
// app.use(express.static(path.join(__dirname, "public")));
// Parse body
app.use(express.json({ limit: "10KB" }));
// Parse query parameters
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
// Parse cookies
app.use(cookieParser());

/**************************************************/
// ENDPOINTS
/**************************************************/
app.use("/", (req, res, next) => {
  res.status(200).send("Hello from the server!");
});

/**************************************************/
// API ENDPOINTS
/**************************************************/
// app.use(`/api/v1/users`, userRouter);
// app.use(`/api/v1/posts`, postRouter);

/**************************************************/
// HANDLING NON-EXISTENT ENDPOINTS
/**************************************************/
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
  next();
});

/**************************************************/
// HANDLING ERRORS
/**************************************************/
app.use((err, req, res, next) => {
  return res.status(500).json({ status: "fail", error: err });
});

export default app;
