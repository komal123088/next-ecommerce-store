"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { Skeleton } from "@/components/ui/Skeleton";
import { IReview } from "@/types";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const res = await fetch("/api/reviews");
    const data = await res.json();
    setReviews(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateReview = async (id: string, updates: any) => {
    await fetch(`/api/reviews`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    toast.success("Review updated");
    load();
  };

  const deleteReview = async (id: string) => {
    await fetch(`/api/reviews`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    toast.success("Review deleted");
    load();
  };

  return (
    <div className="min-h-screen">
      <AdminHeader title="Reviews" subtitle="Manage customer reviews" />

      <div className="p-6">
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {[
                    "Product",
                    "User",
                    "Rating",
                    "Comment",
                    "Date",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="table-header text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 7 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <Skeleton className="h-4" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : reviews.map((review) => (
                      <tr
                        key={review._id}
                        className="hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-white font-medium text-xs">
                          {typeof review.product === "object"
                            ? review.product.name?.slice(0, 25) + "..."
                            : "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {typeof review.user === "object"
                            ? review.user.name
                            : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <StarRating rating={review.rating} />
                        </td>
                        <td className="px-4 py-3 text-slate-400 max-w-xs">
                          <p className="truncate">{review.comment}</p>
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {formatDate(review.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={review.approved ? "success" : "warning"}
                          >
                            {review.approved ? "Approved" : "Pending"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {!review.approved && (
                              <button
                                onClick={() =>
                                  updateReview(review._id, { approved: true })
                                }
                                className="p-1.5 rounded text-slate-400 hover:text-green-400 hover:bg-slate-700 transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            {review.approved && (
                              <button
                                onClick={() =>
                                  updateReview(review._id, { approved: false })
                                }
                                className="p-1.5 rounded text-slate-400 hover:text-yellow-400 hover:bg-slate-700 transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteReview(review._id)}
                              className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>{" "}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
