import { Router, Request, Response } from "express";
import reviewsService from "./reviews.service";

const router = Router();

// GET /api/reviews/:slug
router.get("/:slug", (req: Request, res: Response): void => {
  try {
    const { slug } = req.params;
    const result = reviewsService.getReviewsForProduct(slug);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reviews
router.post("/", (req: Request, res: Response): void => {
  try {
    const {
      productSlug,
      authorName,
      city,
      rating,
      fitSentiment,
      purchasedSize,
      reviewTitle,
      reviewBody,
      images
    } = req.body;

    const result = reviewsService.addReview({
      productSlug,
      authorName,
      city,
      rating,
      fitSentiment,
      purchasedSize,
      reviewTitle,
      reviewBody,
      images
    });

    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
