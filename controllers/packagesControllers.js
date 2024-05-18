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
exports.deletePackage = exports.getNumberOfPackages = exports.getAllPackages = exports.searchPackages = exports.getSinglePackage = exports.editPackage = exports.uploadPackage = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const packageServices_1 = require("../services/packageServices");
// import sendMail from "../utils/sendMail";
const package_model_1 = __importDefault(require("../models/package.model"));
// upload package
exports.uploadPackage = (0, catchAsyncErrors_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        // const thumbnail = data.thumbnail;
        // if (thumbnail) {
        //   const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        //     folder: "packages",
        //   });
        //   data.thumbnail = {
        //     public_id: myCloud.public_id,
        //     url: myCloud.secure_url,
        //   };
        // }
        // const html = await ejs.renderFile(
        //   path.join(__dirname, "../mails/packageUpload-mail.ejs"),
        //   data
        // );
        // try {
        //   await sendMail({
        //     email: data.email,
        //     subject: "Activate Your Account",
        //     template: "packageUpload-mail.ejs",
        //     data,
        //   });
        //   res.status(201).json({
        //     success: true,
        //     message: `Your account activation email has been sent to ${data.email}`,
        //   });
        // } catch (error) {
        //   return next(
        //     new ErrorHandler("There is an error sending you an email", 400)
        //   );
        // }
        (0, packageServices_1.createPackage)(req, res, next);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// edit package
exports.editPackage = (0, catchAsyncErrors_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const thumbnail = data.thumbnail;
        const packageId = req.params.id;
        const packageData = (yield package_model_1.default.findById(packageId));
        if (thumbnail && !thumbnail.startsWith("https")) {
            yield cloudinary_1.default.v2.uploader.destroy(packageData.thumbnail.public_id);
            const myCloud = yield cloudinary_1.default.v2.uploader.upload(thumbnail, {
                folder: "packages",
            });
            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        if (thumbnail.startsWith("https")) {
            data.thumbnail = {
                public_id: packageData === null || packageData === void 0 ? void 0 : packageData.thumbnail.public_id,
                url: packageData === null || packageData === void 0 ? void 0 : packageData.thumbnail.url,
            };
        }
        const packaged = yield package_model_1.default.findByIdAndUpdate(packageId, {
            $set: data,
        }, { new: true });
        res.status(201).json({
            success: true,
            packaged,
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// get single package --- without purchasing
exports.getSinglePackage = (0, catchAsyncErrors_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const packageId = req.params.id;
        // const isCacheExist = await redis.get(packageId);
        // if (isCacheExist) {
        //   const packaged = JSON.parse(isCacheExist);
        //   res.status(200).json({
        //     success: true,
        //     packaged,
        //   });
        // } else {
        const packaged = yield package_model_1.default.findById(req.params.id);
        // await redis.set(packageId, JSON.stringify(packaged), "EX", 604800); // 7days
        res.status(200).json({
            success: true,
            packaged,
        });
        // }
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 500));
    }
}));
// search for a package
exports.searchPackages = (0, catchAsyncErrors_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get query parameters for filtering
        const { packageName } = req.query;
        // Perform the search operation in MongoDB
        const results = yield package_model_1.default.find({
            packageName: { $regex: packageName },
        });
        // Return the search results
        res.status(200).json(results);
    }
    catch (error) {
        res.status(500).json({ error: "An error occurred while searching" });
    }
}));
// get all Packages --- only for admin
exports.getAllPackages = (0, catchAsyncErrors_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, packageServices_1.getAllPackagesService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
exports.getNumberOfPackages = (0, catchAsyncErrors_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, packageServices_1.getNumberOfPackagesService)(res);
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
// Delete package --- only for admin
exports.deletePackage = (0, catchAsyncErrors_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const packaged = yield package_model_1.default.findById(id);
        if (!packaged) {
            return next(new ErrorHandler_1.default("packaged not found", 404));
        }
        yield packaged.deleteOne({ id });
        // await redis.del(id);
        res.status(200).json({
            success: true,
            message: "package deleted successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler_1.default(error.message, 400));
    }
}));
