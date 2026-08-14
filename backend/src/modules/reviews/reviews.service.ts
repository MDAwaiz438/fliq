export interface ReviewItem {
  id: string;
  productSlug: string;
  authorName: string;
  city: string;
  rating: number; // 1 - 5
  fitSentiment: "RUNS_SMALL" | "TRUE_TO_SIZE" | "RUNS_LARGE";
  purchasedSize: string;
  reviewTitle: string;
  reviewBody: string;
  verifiedBuyer: boolean;
  images?: string[];
  createdAt: string;
}

// Initial In-Memory / Seed Database of Verified UGC Reviews
let REVIEWS_STORE: ReviewItem[] = [
  {
    id: "rev_1",
    productSlug: "viscose-embroidered-shirt",
    authorName: "Kabir M.",
    city: "Mumbai",
    rating: 5,
    fitSentiment: "TRUE_TO_SIZE",
    purchasedSize: "L",
    reviewTitle: "Best summer resort box fit shirt I own",
    reviewBody: "Fabric quality is insane. 160GSM viscose has a heavy silky drape that doesn't stick in humid weather. The Cuban collar sits flat and doesn't roll.",
    verifiedBuyer: true,
    images: ["/images/shirt_viscose.png"],
    createdAt: "2026-08-10T14:30:00.000Z"
  },
  {
    id: "rev_2",
    productSlug: "viscose-embroidered-shirt",
    authorName: "Devansh R.",
    city: "Bengaluru",
    rating: 5,
    fitSentiment: "TRUE_TO_SIZE",
    purchasedSize: "M",
    reviewTitle: "Hand embroidery is crisp and premium",
    reviewBody: "Mother of pearl buttons add such a luxury tactile touch. Paired it with the cream straight chinos and got endless compliments.",
    verifiedBuyer: true,
    createdAt: "2026-08-08T11:20:00.000Z"
  },
  {
    id: "rev_3",
    productSlug: "viscose-embroidered-shirt",
    authorName: "Aman V.",
    city: "Delhi NCR",
    rating: 5,
    fitSentiment: "RUNS_LARGE",
    purchasedSize: "XL",
    reviewTitle: "Proper streetwear drape",
    reviewBody: "Slightly oversized in the shoulders which is exactly what I wanted. Definitely stick to your true size for relaxed boxy fit.",
    verifiedBuyer: true,
    createdAt: "2026-08-02T09:15:00.000Z"
  },
  {
    id: "rev_4",
    productSlug: "distortion-hoodie",
    authorName: "Rohan S.",
    city: "Pune",
    rating: 5,
    fitSentiment: "TRUE_TO_SIZE",
    purchasedSize: "L",
    reviewTitle: "450GSM loopback fleece is indestructible",
    reviewBody: "Heavyweight structured hood stays up without falling flat. The cobalt distress stitching is subtle and looks ultra high-end.",
    verifiedBuyer: true,
    images: ["/images/product_distortion.png"],
    createdAt: "2026-08-11T16:45:00.000Z"
  }
];

class ReviewsService {
  /**
   * Retrieves verified reviews for a specific product
   */
  getReviewsForProduct(productSlug: string) {
    const cleanSlug = productSlug.toLowerCase();
    const matches = REVIEWS_STORE.filter(
      (r) =>
        r.productSlug.toLowerCase() === cleanSlug ||
        cleanSlug.includes(r.productSlug.toLowerCase()) ||
        r.productSlug.toLowerCase().includes(cleanSlug)
    );

    const totalCount = matches.length;
    const avgRating = totalCount > 0
      ? Number((matches.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1))
      : 5.0;

    const fitDistribution = {
      runsSmall: matches.filter((r) => r.fitSentiment === "RUNS_SMALL").length,
      trueToSize: matches.filter((r) => r.fitSentiment === "TRUE_TO_SIZE").length,
      runsLarge: matches.filter((r) => r.fitSentiment === "RUNS_LARGE").length
    };

    return {
      success: true,
      productSlug,
      averageRating: avgRating,
      totalReviews: totalCount,
      fitDistribution,
      reviews: matches
    };
  }

  /**
   * Adds a new customer review
   */
  addReview(data: Omit<ReviewItem, "id" | "verifiedBuyer" | "createdAt">) {
    if (!data.productSlug || !data.rating || !data.reviewBody) {
      throw new Error("productSlug, rating, and reviewBody are required");
    }

    const newReview: ReviewItem = {
      id: `rev_${Date.now()}`,
      productSlug: data.productSlug,
      authorName: data.authorName || "Verified Customer",
      city: data.city || "India",
      rating: Math.min(5, Math.max(1, Number(data.rating))),
      fitSentiment: data.fitSentiment || "TRUE_TO_SIZE",
      purchasedSize: data.purchasedSize || "M",
      reviewTitle: data.reviewTitle || "Excellent quality",
      reviewBody: data.reviewBody,
      verifiedBuyer: true,
      images: data.images || [],
      createdAt: new Date().toISOString()
    };

    REVIEWS_STORE.unshift(newReview);
    return { success: true, message: "Review posted successfully", review: newReview };
  }
}

export default new ReviewsService();
