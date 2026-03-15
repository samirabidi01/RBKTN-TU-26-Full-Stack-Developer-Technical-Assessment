import { api } from "./axios";
import type {
  CreateTaskInput,
  Task,
  UpdateTaskStatusInput,
} from "../features/tasks/taskTypes";

export async function getAssignedTasks() {
  const { data } = await api.get<Task[]>("/tasks/my-tasks");
  return data;
}

export async function getTasksByTeam(teamId: string) {
  const { data } = await api.get<Task[]>(`/tasks/team/${teamId}`);
  return data;
}

export async function createTask(payload: CreateTaskInput) {
  const { data } = await api.post<Task>("/tasks", payload);
  return data;
}

export async function updateTaskStatus(
  taskId: string,
  payload: UpdateTaskStatusInput
) {
  const { data } = await api.patch<Task>(`/tasks/${taskId}/status`, payload);
  return data;
}

export async function deleteTask(taskId: string) {
  const { data } = await api.delete<{ message: string }>(`/tasks/${taskId}`);
  return data;
}