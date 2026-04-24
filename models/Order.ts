import mongoose, { Schema, Document } from "mongoose";

export interface IOrderDoc extends Document {
  user: mongoose.Types.ObjectId;
  items: {
    product: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }[];
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentId: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  couponUsed?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  createdAt: Date;
}

const orderItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product" },
  name: String,
  image: String,
  price: Number,
  quantity: Number,
  size: String,
  color: String,
});

const orderSchema = new Schema<IOrderDoc>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    shippingAddress: {
      name: String,
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    paymentId: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    couponUsed: String,
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.Order ||
  mongoose.model<IOrderDoc>("Order", orderSchema);
