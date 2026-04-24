import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body);
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  await connectDB();

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      await Order.findOneAndUpdate(
        { paymentId: paymentIntent.id },
        { status: "processing" },
      );
      break;

    case "payment_intent.payment_failed":
      const failedIntent = event.data.object;
      await Order.findOneAndUpdate(
        { paymentId: failedIntent.id },
        { status: "cancelled" },
      );
      break;

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
