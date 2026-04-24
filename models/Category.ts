import mongoose, { Schema, Document } from "mongoose";

export interface ICategoryDoc extends Document {
  name: string;
  image: string;
  slug: string;
}

const categorySchema = new Schema<ICategoryDoc>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    image: { type: String, default: "" },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export default mongoose.models.Category ||
  mongoose.model<ICategoryDoc>("Category", categorySchema);
