import express from "express";

// middlewares
import { verifyJWT } from "../../../middlewares/index.js";

import {
  signup,
  signin,
  googleAuth,
  changePassword,
} from "../controllers/auth.js";
import { getMyInfo } from "../controllers/users.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google-auth", googleAuth);
router.post("/change-password", verifyJWT, changePassword);
router.get("/me", verifyJWT, getMyInfo);

export default router;
