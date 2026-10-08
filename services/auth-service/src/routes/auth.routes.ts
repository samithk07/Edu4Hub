import { Router } from "express";

import { loginController } from "../controllers/auth.controller";
import {
  authenticate,
  AuthenticatedRequest,
} from "../middleware/auth.middleware";

const router = Router();

router.post("/login", loginController);

router.get(
  "/me",
  authenticate,
  (req: AuthenticatedRequest, res) => {
    return res.status(200).json({
      success: true,
      data: {
        user: req.user,
      },
    });
  }
);

export default router;