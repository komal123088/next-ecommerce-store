"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { formatPrice, calculateCartTotals } from "@/lib/utils";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import Image from "next/image";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

function CheckoutForm({
  total,
  couponCode,
}: {
  total: number;
  couponCode: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const missingFields = Object.entries(address).filter(
      ([k, v]) => k !== "country" && !v,
    );
    if (missingFields.length) {
      toast.error("Please fill all address fields");
      return;
    }

    setLoading(true);
    try {
      const intentRes = await fetch("/api/stripe/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });
      const { clientSecret } = await intentRes.json();

      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: { card: elements.getElement(CardElement)! },
        },
      );

      if (error) throw new Error(error.message);
      if (paymentIntent.status !== "succeeded")
        throw new Error("Payment failed");

      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            product: i.productId,
            name: i.name,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
          })),
          shippingAddress: address,
          paymentId: paymentIntent.id,
          couponCode,
        }),
      });

      clearCart();
      router.push(`/checkout/success?orderId=${paymentIntent.id}`);
    } catch (err: any) {
      toast.error(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
          Shipping Address
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { field: "name", label: "Full Name", cols: 2 },
            { field: "street", label: "Street Address", cols: 2 },
            { field: "city", label: "City" },
            { field: "state", label: "State" },
            { field: "zip", label: "ZIP Code" },
            { field: "country", label: "Country" },
          ].map(({ field, label, cols }) => (
            <div key={field} className={cols === 2 ? "col-span-2" : ""}>
              <label className="label">{label}</label>
              <input
                type="text"
                value={address[field as keyof typeof address]}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, [field]: e.target.value }))
                }
                className="input"
                placeholder={label}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
          Payment
        </h2>
        <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#374151",
                  "::placeholder": { color: "#9ca3af" },
                },
              },
            }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Test card: 4242 4242 4242 4242 — any future date — any CVC
        </p>
      </div>

      <Button type="submit" loading={loading} size="lg" className="w-full">
        Pay {formatPrice(total)}
      </Button>
    </form>
  );
}

// ✅ useSearchParams wrapped in its own component inside Suspense
function CheckoutContent() {
  const searchParams = useSearchParams();
  const couponCode = searchParams.get("coupon") || "";
  const { data: session } = useSession();
  const { items } = useCartStore();
  const { subtotal, tax } = calculateCartTotals(items);
  const total = subtotal + tax;

  if (!session) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">
          Please sign in to checkout.
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 dark:text-gray-400">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Checkout
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Elements stripe={stripePromise}>
            <CheckoutForm total={total} couponCode={couponCode} />
          </Elements>
        </div>

        <div>
          <div className="card p-5 sticky top-24">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 dark:text-white text-base pt-1">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Suspense boundary yahan hai
export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="card p-6 h-64 animate-pulse" />
              <div className="card p-6 h-32 animate-pulse" />
            </div>
            <div className="card p-5 h-64 animate-pulse" />
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
