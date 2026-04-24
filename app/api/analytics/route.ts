import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { subDays, startOfDay, format } from "date-fns";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await connectDB();

  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);

  const [totalRevenue, totalOrders, totalProducts, totalUsers] =
    await Promise.all([
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
    ]);

  const revenueByDay = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        revenue: { $sum: "$total" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const days = [];
  for (let i = 29; i >= 0; i--) {
    const day = format(subDays(now, i), "yyyy-MM-dd");
    const found = revenueByDay.find((r) => r._id === day);
    days.push({
      date: day,
      revenue: found?.revenue || 0,
      orders: found?.orders || 0,
    });
  }

  const topProducts = await Order.aggregate([
    { $unwind: "$items" },
    {
      $group: {
        _id: "$items.name",
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        sold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
  ]);

  const lowStock = await Product.find({ stock: { $lt: 10 } })
    .select("name stock images")
    .limit(10);
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate("user", "name email");

  return NextResponse.json({
    stats: {
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      totalProducts,
      totalUsers,
    },
    revenueByDay: days,
    topProducts,
    lowStock,
    recentOrders,
  });
}
