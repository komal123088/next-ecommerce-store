import mongoose, { Schema, Document } from "mongoose";

export interface ICouponDoc extends Document {
  code: string;
  discountType: "percentage" | "fixed";
  amount: number;
  expiryDate: Date;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

const couponSchema = new Schema<ICouponDoc>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Coupon ||
  mongoose.model<ICouponDoc>("Coupon", couponSchema);
