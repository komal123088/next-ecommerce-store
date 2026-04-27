"use client";

import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlistStore";
import { ProductCard } from "@/components/store/ProductCard";
import { IProduct } from "@/types";
import { Heart } from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
  const { items } = useWishlistStore();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setLoading(false);
      return;
    }
    Promise.all(
      items.map((id) => fetch(`/api/products/${id}`).then((r) => r.json())),
    ).then((prods) => {
      setProducts(prods.filter((p) => !p.error));
      setLoading(false);
    });
  }, [items]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 mb-8 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="h-56 bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
        My Wishlist ({items.length})
      </h1>
      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Your wishlist is empty
          </p>
          <Link href="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
