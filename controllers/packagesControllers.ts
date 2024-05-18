import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import {
  createPackage,
  getAllPackagesService,
  getNumberOfPackagesService
} from "../services/packageServices";
// import { redis } from "../utils/redis";
import mongoose from "mongoose";
import path from "path";
import ejs from "ejs";
// import sendMail from "../utils/sendMail";
import PackageModel from "../models/package.model";

// upload package
export const uploadPackage = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
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
      createPackage(req, res, next);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// edit package
export const editPackage = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body;

      const thumbnail = data.thumbnail;

      const packageId = req.params.id;

      const packageData = (await PackageModel.findById(packageId)) as any;

      if (thumbnail && !thumbnail.startsWith("https")) {
        await cloudinary.v2.uploader.destroy(packageData.thumbnail.public_id);

        const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
          folder: "packages",
        });

        data.thumbnail = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
      }

      if (thumbnail.startsWith("https")) {
        data.thumbnail = {
          public_id: packageData?.thumbnail.public_id,
          url: packageData?.thumbnail.url,
        };
      }

      const packaged = await PackageModel.findByIdAndUpdate(
        packageId,
        {
          $set: data,
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        packaged,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get single package --- without purchasing
export const getSinglePackage = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
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
        const packaged = await PackageModel.findById(req.params.id);

        // await redis.set(packageId, JSON.stringify(packaged), "EX", 604800); // 7days

        res.status(200).json({
          success: true,
          packaged,
        });
      // }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// search for a package
export const searchPackages = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get query parameters for filtering
      const { packageName } = req.query;

      // Perform the search operation in MongoDB
      const results = await PackageModel.find({
        packageName: { $regex: packageName },
      });

      // Return the search results
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while searching" });
    }
  }
);

// get all Packages --- only for admin
export const getAllPackages = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getAllPackagesService(res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

export const getNumberOfPackages = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      getNumberOfPackagesService(res);
        }
  
     catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// Delete package --- only for admin
export const deletePackage = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const packaged = await PackageModel.findById(id);

      if (!packaged) {
        return next(new ErrorHandler("packaged not found", 404));
      }

      await packaged.deleteOne({ id });

      // await redis.del(id);

      res.status(200).json({
        success: true,
        message: "package deleted successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
