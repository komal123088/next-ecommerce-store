import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await User.findById(session.user.id).populate("wishlist");
  return NextResponse.json({ wishlist: user?.wishlist || [] });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const { productId, action } = await req.json();

  if (action === "add") {
    await User.findByIdAndUpdate(session.user.id, {
      $addToSet: { wishlist: productId },
    });
  } else if (action === "remove") {
    await User.findByIdAndUpdate(session.user.id, {
      $pull: { wishlist: productId },
    });
  }

  return NextResponse.json({ success: true });
}
