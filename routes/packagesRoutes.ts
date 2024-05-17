import express from "express";
import {
  editPackage,
  getSinglePackage,
  getAllPackages,
//   getPackageByPublisher, //TODO
  searchPackages,
  uploadPackage,
  getNumberOfPackages,
} from "../controllers/packagesControllers";
// import { authorizeRoles, isAutheticated } from "../middleware/auth";

const packageRouter = express.Router();

packageRouter.post(
  "/",
  uploadPackage
);

packageRouter.get("/search", searchPackages);



packageRouter.get(
    "/:id",
    getSinglePackage
  );

packageRouter.put(
  "/:id",
  editPackage
);


packageRouter.get("/", getAllPackages);

packageRouter.get("/number-of-packages", getNumberOfPackages);



export default packageRouter;