import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const userId = searchParams.get("userId");

  const query: any = {};
  if (session.user.role !== "admin") query.user = session.user.id;
  else if (userId) query.user = userId;
  if (status) query.status = status;

  const skip = (page - 1) * limit;
  const [orders, total] = await Promise.all([
    Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name email avatar"),
    Order.countDocuments(query),
  ]);

  return NextResponse.json({ orders, total, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();

  const body = await req.json();
  const { items, shippingAddress, paymentId, couponCode } = body;

  let discount = 0;
  let couponUsed = "";

  if (couponCode) {
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
      isActive: true,
    });
    if (
      coupon &&
      new Date(coupon.expiryDate) > new Date() &&
      coupon.usedCount < coupon.usageLimit
    ) {
      const subtotalForDiscount = items.reduce(
        (s: number, i: any) => s + i.price * i.quantity,
        0,
      );
      if (coupon.discountType === "percentage") {
        discount = subtotalForDiscount * (coupon.amount / 100);
      } else {
        discount = Math.min(coupon.amount, subtotalForDiscount);
      }
      couponUsed = couponCode.toUpperCase();
      await Coupon.findByIdAndUpdate(coupon._id, { $inc: { usedCount: 1 } });
    }
  }

  const subtotal = items.reduce(
    (s: number, i: any) => s + i.price * i.quantity,
    0,
  );
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;

  for (const item of items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  const order = await Order.create({
    user: session.user.id,
    items,
    shippingAddress,
    paymentId,
    couponUsed,
    subtotal,
    discount,
    tax,
    total,
  });

  return NextResponse.json(order, { status: 201 });
}
