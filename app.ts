import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit"
require("dotenv").config();
import { ErrorMiddleware } from "./middleware/error";
// import userRouter from "./routes/userRoutes";
import packageRouter from "./routes/packagesRoutes";

//BodyParser
app.use(express.json({ limit: "50mb" }));

//cookieParser
app.use(cookieParser());

//CORS
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:8000/api/v1/'],
    credentials: true,
  })
);

// api requests limit
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
})

//Routes
// app.use("/api/v1/", userRouter);
app.use("/api/v1/packages", packageRouter);


//Testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "Test successful",
  });
});

//Unkown route
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} Not Found`) as any;
  err.statusCode = 404;
  next(err);
});

// middleware calls
app.use(limiter);
app.use(ErrorMiddleware);
