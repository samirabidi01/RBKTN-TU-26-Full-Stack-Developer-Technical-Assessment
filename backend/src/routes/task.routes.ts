import { Router } from "express";
import {
  createTask,
  getMyTasks,
  getTeamTasks,
  updateTaskStatus,
  deleteTask
} from "../controllers/task.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, createTask);
router.get("/my-tasks", authMiddleware, getMyTasks);
router.get("/team/:teamId", authMiddleware, getTeamTasks);
router.patch("/:taskId/status", authMiddleware, updateTaskStatus);
router.delete("/:taskId", authMiddleware, deleteTask);

export default router;