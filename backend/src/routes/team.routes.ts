import { Router } from "express";
import {
  createTeam,
  joinTeam,
  getMyTeams
} from "../controllers/team.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createTeam);
router.post("/join/:teamId", authMiddleware, joinTeam);
router.get("/", authMiddleware, getMyTeams);

export default router;