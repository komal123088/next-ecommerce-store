import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  const query: any = {};
  if (search)
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];

  const users = await User.find(query).sort({ createdAt: -1 });
  const withOrders = await Promise.all(
    users.map(async (u) => ({
      ...u.toObject(),
      orderCount: await Order.countDocuments({ user: u._id }),
    })),
  );
  return NextResponse.json(withOrders);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const { name, email, password } = await req.json();
  const bcrypt = await import("bcryptjs");
  const existing = await User.findOne({ email });
  if (existing)
    return NextResponse.json(
      { error: "Email already exists" },
      { status: 400 },
    );
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed });
  return NextResponse.json(
    { id: user._id, name: user.name, email: user.email },
    { status: 201 },
  );
}
