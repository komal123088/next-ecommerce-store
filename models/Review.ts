import mongoose, { Schema, Document } from "mongoose";

export interface IReviewDoc extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: Date;
}

const reviewSchema = new Schema<IReviewDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.models.Review ||
  mongoose.model<IReviewDoc>("Review", reviewSchema);
