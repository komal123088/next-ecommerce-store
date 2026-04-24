import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const session = await getServerSession(authOptions);

  const query: any = {};
  if (productId) {
    query.product = productId;
    query.approved = true;
  } else if (session?.user.role === "admin") {
    /* all reviews */
  } else return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const reviews = await Review.find(query)
    .sort({ createdAt: -1 })
    .populate("user", "name avatar")
    .populate("product", "name images");
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { productId, rating, comment } = await req.json();

  const existing = await Review.findOne({
    user: session.user.id,
    product: productId,
  });
  if (existing)
    return NextResponse.json({ error: "Already reviewed" }, { status: 400 });

  const review = await Review.create({
    user: session.user.id,
    product: productId,
    rating,
    comment,
  });

  const reviews = await Review.find({ product: productId, approved: true });
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(productId, {
    avgRating: avg,
    reviewCount: reviews.length,
    $push: { ratings: { user: session.user.id, rating } },
  });

  return NextResponse.json(review, { status: 201 });
}
