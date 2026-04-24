"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { IProduct } from "@/types";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: IProduct;
  view?: "grid" | "list";
}

export function ProductCard({ product, view = "grid" }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: 1,
      stock: product.stock,
    });
    toast.success("Added to cart!");
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggle(product._id);
    toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist!");
  };

  if (view === "list") {
    return (
      <Link
        href={`/products/${product._id}`}
        className="card flex gap-4 p-4 hover:shadow-md transition-shadow group"
      >
        <div className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">
            {product.name}
          </h3>
          <StarRating rating={product.avgRating} count={product.reviewCount} />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleWishlist}
                className={cn(
                  "p-2 rounded-lg border transition-colors",
                  wishlisted
                    ? "border-red-300 text-red-500"
                    : "border-gray-200 dark:border-gray-600 hover:border-red-300 hover:text-red-500 dark:hover:text-red-400",
                )}
              >
                <Heart
                  className={cn("w-4 h-4", wishlisted && "fill-current")}
                />
              </button>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary text-xs py-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/products/${product._id}`}
      className="card overflow-hidden hover:shadow-lg transition-all duration-300 group relative"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="danger">Out of Stock</Badge>
          </div>
        )}
        {product.stock > 0 && product.stock < 10 && (
          <div className="absolute top-2 left-2">
            <Badge variant="warning">Low Stock</Badge>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 right-2">
            <Badge variant="info">Featured</Badge>
          </div>
        )}
        <button
          onClick={handleWishlist}
          className={cn(
            "absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow flex items-center justify-center transition-all hover:scale-110",
            product.featured && "top-10",
            wishlisted && "text-red-500",
          )}
        >
          <Heart className={cn("w-4 h-4", wishlisted && "fill-current")} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full btn-primary text-xs py-2 shadow-lg"
          >
            <ShoppingCart className="w-4 h-4" />
            Quick Add to Cart
          </button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
          {typeof product.category === "object" ? product.category.name : ""}
        </p>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>
        <StarRating rating={product.avgRating} count={product.reviewCount} />
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {formatPrice(product.price)}
          </span>
          {product.stock > 0 && (
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              {product.stock} left
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
