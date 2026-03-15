import type { User } from "../auth/authTypes";

export type TaskStatus = "todo" | "doing" | "done";

export type TaskTeam = {
  _id: string;
  name: string;
};

export type Task = {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedUser?: User | null;
  teamId: string | TaskTeam;
  createdBy: string | User;
  createdAt: string;
};

export type CreateTaskInput = {
  title: string;
  description: string;
  status: TaskStatus;
  assignedUser?: string;
  teamId: string;
};

export type UpdateTaskStatusInput = {
  status: TaskStatus;
};