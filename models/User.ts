import mongoose, { Schema, Document } from "mongoose";

export interface IUserDoc extends Document {
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  avatar?: string;
  banned: boolean;
  addresses: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    isDefault: boolean;
  }[];
  wishlist: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const addressSchema = new Schema({
  name: String,
  street: String,
  city: String,
  state: String,
  zip: String,
  country: { type: String, default: "US" },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new Schema<IUserDoc>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: String,
    banned: { type: Boolean, default: false },
    addresses: [addressSchema],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true },
);

export default mongoose.models.User ||
  mongoose.model<IUserDoc>("User", userSchema);
