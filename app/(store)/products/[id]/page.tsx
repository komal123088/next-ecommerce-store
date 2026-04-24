"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { IProduct, IReview } from "@/types";
import { StarRating } from "@/components/ui/StarRating";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ProductCard } from "@/components/store/ProductCard";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { formatPrice, formatDate } from "@/lib/utils";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, isWishlisted } = useWishlistStore();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [related, setRelated] = useState<IProduct[]>([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const wishlisted = product ? isWishlisted(product._id) : false;

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      const [productRes, reviewsRes] = await Promise.all([
        fetch(`/api/products/${id}`),
        fetch(`/api/reviews?productId=${id}`),
      ]);
      const [productData, reviewsData] = await Promise.all([
        productRes.json(),
        reviewsRes.json(),
      ]);
      setProduct(productData);
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      if (productData.category) {
        const relatedRes = await fetch(
          `/api/products?category=${typeof productData.category === "object" ? productData.category._id : productData.category}&limit=4`,
        );
        const { products } = await relatedRes.json();
        setRelated(products.filter((p: IProduct) => p._id !== id));
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || product.stock === 0) return;
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity,
      stock: product.stock,
    });
    toast.success(`${quantity} × ${product.name} added to cart!`);
  };

  const handleReviewSubmit = async () => {
    if (!session) {
      toast.error("Please sign in to leave a review");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please write a comment");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: id,
          rating: reviewRating,
          comment: reviewText,
        }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
      toast.success("Review submitted! It will appear after approval.");
      setReviewText("");
      setReviewRating(5);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-4">
          {[80, 60, 40, 40, 60, 40].map((w, i) => (
            <Skeleton key={i} className={`h-6 w-${w}%`} />
          ))}
        </div>
      </div>
    );
  }

  if (!product)
    return (
      <div className="text-center py-20 text-gray-500">Product not found</div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        {/* Image Gallery */}
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === selectedImage ? "border-blue-500" : "border-gray-200 dark:border-gray-700 opacity-70 hover:opacity-100"}`}
              >
                <Image
                  src={img}
                  alt={`${product.name} ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Product Info */}
        <div>
          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-2">
            {typeof product.category === "object" ? product.category.name : ""}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            {product.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating
              rating={product.avgRating}
              count={product.reviewCount}
              size="md"
            />
          </div>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-2 mb-6">
            {product.stock > 0 ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {product.stock} in stock
                </span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-600 font-medium">Out of stock</span>
              </>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantity:
            </span>
            <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-5 py-2 font-semibold text-gray-900 dark:text-white border-x border-gray-200 dark:border-gray-600">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              icon={<ShoppingCart className="w-5 h-5" />}
              size="lg"
              className="flex-1"
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                toggle(product._id);
                toast.success(
                  wishlisted ? "Removed from wishlist" : "Added to wishlist!",
                );
              }}
              icon={
                <Heart
                  className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`}
                />
              }
            >
              Wishlist
            </Button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-10 mb-16">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          Customer Reviews
        </h2>

        {session && (
          <div className="card p-6 mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Write a Review
            </h3>
            <div className="mb-4">
              <label className="label">Your Rating</label>
              <StarRating
                rating={reviewRating}
                size="md"
                interactive
                onChange={setReviewRating}
              />
            </div>
            <div className="mb-4">
              <label className="label">Your Review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
                className="input resize-none"
                placeholder="Share your experience with this product..."
              />
            </div>
            <Button onClick={handleReviewSubmit} loading={submittingReview}>
              Submit Review
            </Button>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="card p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {typeof review.user === "object"
                      ? review.user.name?.[0]
                      : "?"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">
                        {typeof review.user === "object"
                          ? review.user.name
                          : "Anonymous"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    <StarRating rating={review.rating} />
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {review.comment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
