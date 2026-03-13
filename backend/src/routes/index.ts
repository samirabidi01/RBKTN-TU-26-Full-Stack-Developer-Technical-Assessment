import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import teamRoutes from "./team.routes.js";
import taskRoutes from "./task.routes.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "API working" });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/teams", teamRoutes);
router.use("/tasks", taskRoutes);

export default router;