"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
exports.app = (0, express_1.default)();
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = require("express-rate-limit");
require("dotenv").config();
const error_1 = require("./middleware/error");
// import userRouter from "./routes/userRoutes";
const packagesRoutes_1 = __importDefault(require("./routes/packagesRoutes"));
//BodyParser
exports.app.use(express_1.default.json({ limit: "50mb" }));
//cookieParser
exports.app.use((0, cookie_parser_1.default)());
//CORS
exports.app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'http://localhost:8000/api/v1/'],
    credentials: true,
}));
// api requests limit
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
//Routes
// app.use("/api/v1/", userRouter);
exports.app.use("/api/v1/packages", packagesRoutes_1.default);
//Testing api
exports.app.get("/test", (req, res, next) => {
    res.status(200).json({
        success: true,
        message: "Test successful",
    });
});
//Unkown route
exports.app.all("*", (req, res, next) => {
    const err = new Error(`Route ${req.originalUrl} Not Found`);
    err.statusCode = 404;
    next(err);
});
// middleware calls
exports.app.use(limiter);
exports.app.use(error_1.ErrorMiddleware);
