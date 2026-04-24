"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, Tag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { formatPrice, calculateCartTotals } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponType, setCouponType] = useState<"percentage" | "fixed">(
    "percentage",
  );
  const [couponAmount, setCouponAmount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const { subtotal, tax } = calculateCartTotals(items);
  const discountAmount =
    couponType === "percentage"
      ? subtotal * (couponAmount / 100)
      : Math.min(couponAmount, subtotal);
  const total = subtotal - discountAmount + tax;

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    try {
      const res = await fetch(
        `/api/coupons?code=${encodeURIComponent(couponCode)}`,
      );
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
      const coupon = await res.json();
      setCouponType(coupon.discountType);
      setCouponAmount(coupon.amount);
      setDiscount(coupon.amount);
      toast.success(
        `Coupon applied! ${coupon.discountType === "percentage" ? coupon.amount + "% off" : "$" + coupon.amount + " off"}`,
      );
    } catch (err: any) {
      toast.error(err.message || "Invalid coupon");
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Looks like you haven't added any products yet.
        </p>
        <Link href="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        Shopping Cart ({items.length} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="card p-4 flex gap-4">
              <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                  {item.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-bold text-lg mt-1">
                  {formatPrice(item.price)}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-1.5 font-medium text-sm border-x border-gray-200 dark:border-gray-600">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.stock}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-white">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => {
                        removeItem(item.productId);
                        toast.success("Removed from cart");
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <button
              onClick={() => {
                clearCart();
                toast.success("Cart cleared");
              }}
              className="text-sm text-red-500 hover:underline"
            >
              Clear Cart
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {/* Coupon */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" /> Coupon Code
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="input flex-1 text-sm"
              />
              <Button
                onClick={applyCoupon}
                loading={applyingCoupon}
                variant="outline"
                size="sm"
              >
                Apply
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="card p-5">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Discount</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>Shipping</span>
                <span className="text-green-600 dark:text-green-400">Free</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Link
              href={`/checkout?coupon=${couponCode}`}
              className="btn-primary w-full mt-5 text-center block"
            >
              Proceed to Checkout
            </Link>
            <Link
              href="/products"
              className="text-sm text-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 block mt-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
