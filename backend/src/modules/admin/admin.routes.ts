import { Router } from "express";
import { adminService } from "./admin.service";
import { imageOptimizer } from "../../lib/imageOptimizer";

const router = Router();

router.get("/analytics", async (_req, res) => {
  try {
    const data = await adminService.getDashboardAnalytics();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/sync-health", async (_req, res) => {
  try {
    const data = await adminService.getSyncHealth();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Product Upload & Management Routes
router.get("/products", async (_req, res) => {
  try {
    const products = await adminService.getProducts();
    res.json({ success: true, data: products });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/products", async (req, res) => {
  try {
    const product = await adminService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Image Upload Endpoint with Non-Blocking Dimension Warnings
router.post("/products/upload-image", async (req, res) => {
  try {
    const { fileName, width, height } = req.body;
    const dummyBuffer = Buffer.from("FLIQ_IMAGE_BUFFER");

    const result = await imageOptimizer.optimizeProductImage(
      dummyBuffer,
      fileName || "product-image.jpg",
      width || 1920,
      height || 1080
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    await adminService.deleteProduct(req.params.id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Category & Featured Category Endpoints
router.get("/categories", async (_req, res) => {
  try {
    const categories = await adminService.getCategories();
    res.json({ success: true, data: categories });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const saved = await adminService.saveCategory(req.body);
    res.status(201).json({ success: true, data: saved });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.patch("/categories/:id/toggle-featured", async (req, res) => {
  try {
    const updated = await adminService.toggleFeaturedCategory(req.params.id);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    const result = await adminService.deleteCategory(req.params.id);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.message });
  }
});

export default router;
