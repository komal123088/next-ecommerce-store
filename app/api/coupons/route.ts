import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all coupons (admin only)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const coupons = await Coupon.find({}).sort({ createdAt: -1 });
  return NextResponse.json(coupons);
}

// POST create coupon (admin only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const body = await req.json();

  const existing = await Coupon.findOne({ code: body.code.toUpperCase() });
  if (existing) {
    return NextResponse.json(
      { error: "Coupon code already exists" },
      { status: 400 },
    );
  }

  const coupon = await Coupon.create({
    ...body,
    code: body.code.toUpperCase(),
  });

  return NextResponse.json(coupon, { status: 201 });
}
