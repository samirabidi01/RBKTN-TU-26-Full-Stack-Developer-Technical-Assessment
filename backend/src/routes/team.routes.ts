import { Router } from "express";
import {
  createTeam,
  joinTeam,
  getMyTeams,
  getTeamById,
} from "../controllers/team.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createTeam);
router.post("/join", authMiddleware, joinTeam);
router.get("/", authMiddleware, getMyTeams);
router.get("/:teamId", authMiddleware, getTeamById);

export default router;