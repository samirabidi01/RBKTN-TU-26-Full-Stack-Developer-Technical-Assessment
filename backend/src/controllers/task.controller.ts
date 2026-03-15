import type { Response } from "express";
import mongoose from "mongoose";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import Task from "../models/task.model.js";
import Team from "../models/team.model.js";

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, assignedUser, teamId, status } = req.body;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!title || !title.trim() || !teamId) {
      return res.status(400).json({
        message: "Title and teamId are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: "Invalid teamId" });
    }

    if (assignedUser && !mongoose.Types.ObjectId.isValid(assignedUser)) {
      return res.status(400).json({ message: "Invalid assignedUser id" });
    }

    if (status && !["todo", "doing", "done"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isMember = team.members.some(
      (memberId) => memberId.toString() === currentUserId
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this team",
      });
    }

    if (assignedUser) {
      const isAssignedUserMember = team.members.some(
        (memberId) => memberId.toString() === assignedUser
      );

      if (!isAssignedUserMember) {
        return res.status(400).json({
          message: "Assigned user must be a member of the team",
        });
      }
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || "",
      status: status || "todo",
      assignedUser: assignedUser
        ? new mongoose.Types.ObjectId(assignedUser)
        : null,
      teamId: new mongoose.Types.ObjectId(teamId),
      createdBy: new mongoose.Types.ObjectId(currentUserId),
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedUser", "name email")
      .populate("createdBy", "name email")
      .populate("teamId", "name");

    return res.status(201).json(populatedTask);
  } catch (error) {
    return res.status(500).json({
      message: "Server error while creating task",
    });
  }
};

export const getMyTasks = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const tasks = await Task.find({
      assignedUser: new mongoose.Types.ObjectId(currentUserId),
    })
      .populate("assignedUser", "name email")
      .populate("createdBy", "name email")
      .populate("teamId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching assigned tasks",
    });
  }
};

export const getTeamTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { teamId } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (typeof teamId !== "string" || !mongoose.Types.ObjectId.isValid(teamId)) {
                  return res.status(400).json({
                    message: "Invalid teamId"
                  });
                }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isMember = team.members.some(
      (memberId) => memberId.toString() === currentUserId
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not allowed to view this team's tasks",
      });
    }

    const tasks = await Task.find({ teamId: new mongoose.Types.ObjectId(teamId) })
      .populate("assignedUser", "name email")
      .populate("createdBy", "name email")
      .populate("teamId", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching team tasks",
    });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (typeof taskId !== "string" || !mongoose.Types.ObjectId.isValid(taskId)) {
                  return res.status(400).json({
                    message: "Invalid taskId"
                  });
                }

    if (!status || !["todo", "doing", "done"].includes(status)) {
      return res.status(400).json({
        message: "Status must be one of: todo, doing, done",
      });
    }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const team = await Team.findById(task.teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isMember = team.members.some(
      (memberId) => memberId.toString() === currentUserId
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not allowed to update this task",
      });
    }

    task.status = status;
    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate("assignedUser", "name email")
      .populate("createdBy", "name email")
      .populate("teamId", "name");

    return res.status(200).json(updatedTask);
  } catch (error) {
    return res.status(500).json({
      message: "Server error while updating task status",
    });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const currentUserId = req.user?.id;
    const currentUserRole = req.user?.role;

    if (!currentUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (typeof taskId !== "string" || !mongoose.Types.ObjectId.isValid(taskId)) {
                  return res.status(400).json({
                    message: "Invalid taskId"
                  });
                }

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const isOwner = task.createdBy.toString() === currentUserId;
    const isAdmin = currentUserRole === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You can only delete your own tasks",
      });
    }

    await task.deleteOne();

    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while deleting task",
    });
  }
};