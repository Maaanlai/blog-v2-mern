import express from "express";
import { subscribeNewsletter, getSubscribers } from "../controllers/newsletter.js";
import { verifyJWT } from "../../../middlewares/index.js";

const router = express.Router();

// Public route for newsletter subscription
router.post("/subscribe", subscribeNewsletter);

// Protected route for getting subscribers (admin only)
router.get("/subscribers", verifyJWT, getSubscribers);

export default router;
