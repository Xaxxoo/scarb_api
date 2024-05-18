"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNumberOfPackagesService = exports.getAllPackagesService = exports.createPackage = void 0;
const package_model_1 = __importDefault(require("../models/package.model"));
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
//create a course
exports.createPackage = (0, catchAsyncErrors_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const packaged = yield package_model_1.default.create(req.body);
    res.status(201).json({
        success: true,
        packaged,
    });
}));
//Get All
const getAllPackagesService = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const packages = yield package_model_1.default.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        packages,
        length: packages.length
    });
});
exports.getAllPackagesService = getAllPackagesService;
const getNumberOfPackagesService = (res) => __awaiter(void 0, void 0, void 0, function* () {
    const packages = yield package_model_1.default.find();
    res.status(200).json({
        success: true,
        length: packages.length
    });
});
exports.getNumberOfPackagesService = getNumberOfPackagesService;
