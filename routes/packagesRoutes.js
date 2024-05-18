"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const packagesControllers_1 = require("../controllers/packagesControllers");
// import { authorizeRoles, isAutheticated } from "../middleware/auth";
const packageRouter = express_1.default.Router();
packageRouter.post("/", packagesControllers_1.uploadPackage);
packageRouter.get("/search", packagesControllers_1.searchPackages);
packageRouter.get("/:id", packagesControllers_1.getSinglePackage);
packageRouter.put("/:id", packagesControllers_1.editPackage);
packageRouter.get("/", packagesControllers_1.getAllPackages);
packageRouter.get("/number-of-packages", packagesControllers_1.getNumberOfPackages);
exports.default = packageRouter;
