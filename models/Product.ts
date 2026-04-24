import mongoose, { Schema, Document } from "mongoose";

export interface IProductDoc extends Document {
  name: string;
  description: string;
  price: number;
  images: string[];
  category: mongoose.Types.ObjectId;
  stock: number;
  featured: boolean;
  ratings: { user: mongoose.Types.ObjectId; rating: number }[];
  avgRating: number;
  reviewCount: number;
  createdAt: Date;
}

const productSchema = new Schema<IProductDoc>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: [String],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    featured: { type: Boolean, default: false },
    ratings: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    avgRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

productSchema.pre("save", function (next) {
  if (this.ratings.length > 0) {
    this.avgRating =
      this.ratings.reduce((sum, r) => sum + r.rating, 0) / this.ratings.length;
    this.reviewCount = this.ratings.length;
  }
  next();
});

productSchema.index({ name: "text", description: "text" });

export default mongoose.models.Product ||
  mongoose.model<IProductDoc>("Product", productSchema);
