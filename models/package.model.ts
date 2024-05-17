import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user.model";

export interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies: IComment[];
}

interface IReview extends Document {
  user: IUser;
  rating?: number;
  comment: string;
  commentReplies?: IReview[];
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface IPackageData extends Document {
  title: string;
  description: string;
  imageUrl: string;
  videoThumbnail: object;
  videoSection: string;
  videoLength: number;
  videoPlayer: string;
  links: ILink[];
  suggestion: string;
  questions: IComment[];
}

export interface IPackage extends Document {
  packageName: string;
  description: string;
  installation: string;
  repository: string;
  readMe: string;
  owner: string;
  thumbnail: object;
  usage: string;
  exampleCode: string;
  weeklyDownloads: string;
  reviews: IReview[];
  packageData: IPackageData[];
  ratings?: number;
}

const reviewSchema = new Schema<IReview>(
  {
    user: Object,
    rating: {
      type: Number,
      default: 0,
    },
    comment: String,
    commentReplies: [Object],
  },
  { timestamps: true }
);

const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

const commentSchema = new Schema<IComment>(
  {
    user: Object,
    question: String,
    questionReplies: [Object],
  },
  { timestamps: true }
);

const packageDataSchema = new Schema<IPackageData>({
  imageUrl: String,
  videoThumbnail: Object,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  questions: [commentSchema],
});

const packageSchema = new Schema<IPackage>(
  {
    packageName: {
      type: String,
      required: true,
      unique: true,
    },
    owner: {
      type: String,
      required: true,
    },
    installation: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    repository: {
      type: String,
      required: true,
    },
    weeklyDownloads: {
      type: String,
    },
    readMe: {
      type: String,
    },
    exampleCode: {
      type: String,
    },
  },
  { timestamps: true }
);

packageSchema.index({ packageName: "text" });

const PackageModel: Model<IPackage> = mongoose.model("Package", packageSchema);

export default PackageModel;
