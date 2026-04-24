import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
        Order Confirmed!
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Thank you for your purchase. Your order has been placed and we'll send
        you a confirmation email shortly.
      </p>
      <div className="card p-5 mb-8 text-left">
        <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
          <Package className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <div>
            <p className="font-medium">Estimated delivery: 3-5 business days</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Free standard shipping
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-center">
        <Link
          href="/account/orders"
          className="btn-primary flex items-center gap-2"
        >
          View Orders <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/products" className="btn-secondary">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
