import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  await connectDB();
  const categories = await Category.find().sort({ name: 1 });
  const withCounts = await Promise.all(
    categories.map(async (cat) => ({
      ...cat.toObject(),
      productCount: await Product.countDocuments({ category: cat._id }),
    })),
  );
  return NextResponse.json(withCounts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { name, image } = await req.json();
  const category = await Category.create({ name, image, slug: slugify(name) });
  return NextResponse.json(category, { status: 201 });
}
