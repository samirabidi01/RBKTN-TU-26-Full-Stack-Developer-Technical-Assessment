import type { Response } from "express";
import mongoose from "mongoose";
import type { AuthRequest } from "../middlewares/auth.middleware.js";
import Team from "../models/team.model.js";

export const createTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Team name is required"
      });
    }

    const team = await Team.create({
      name: name.trim(),
      owner: new mongoose.Types.ObjectId(currentUserId),
      members: [new mongoose.Types.ObjectId(currentUserId)]
    });

    const populatedTeam = await Team.findById(team._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    return res.status(201).json({
      message: "Team created successfully",
      team: populatedTeam
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while creating team"
    });
  }
};

export const joinTeam = async (req: AuthRequest, res: Response) => {
  try {
    const { teamId } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    if (typeof teamId !== "string" || !mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({
        message: "Invalid teamId"
      });
    }

    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found"
      });
    }

    const isAlreadyMember = team.members.some(
      (memberId) => memberId.toString() === currentUserId
    );

    if (isAlreadyMember) {
      return res.status(400).json({
        message: "You are already a member of this team"
      });
    }

    team.members.push(new mongoose.Types.ObjectId(currentUserId));
    await team.save();

    const updatedTeam = await Team.findById(team._id)
      .populate("owner", "name email")
      .populate("members", "name email");

    return res.status(200).json({
      message: "Joined team successfully",
      team: updatedTeam
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while joining team"
    });
  }
};

export const getMyTeams = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    const teams = await Team.find({
      members: new mongoose.Types.ObjectId(currentUserId)
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Teams fetched successfully",
      count: teams.length,
      teams
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error while fetching teams"
    });
  }
};