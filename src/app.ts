import dotenv from "dotenv";

dotenv.config();

import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import expressFileUpload from "express-fileupload";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { createStream } from "rotating-file-stream";
import { configCloundinary, devConfig } from "./configs";
import errorMiddleware from "./middleware/error";
import router from "./routes";
import { NotFoundRequestError } from "./core";

const isProduction: boolean = devConfig.app.mode === "production";
const accessLogStream = createStream("access.log", {
  interval: "1d",
  path: path.join(__dirname, "log"),
});

const app = express();

// TODO: CONFIG MIDDLEWARE
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(compression());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(
  isProduction
    ? morgan("combined", { stream: accessLogStream })
    : morgan("tiny")
);
app.use(cookieParser());
app.use(expressFileUpload());
configCloundinary();
// CONNECT DB
import "./db/mongoConnect";

// CONFIG ROUTE
app.use("/api/dev/v1", router);
app.use("*", (_, __) => {
  throw new NotFoundRequestError("Not found page", 404);
});
app.use(errorMiddleware);

export default app;
