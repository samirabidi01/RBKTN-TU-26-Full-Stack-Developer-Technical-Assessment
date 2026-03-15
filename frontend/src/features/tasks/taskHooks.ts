import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  getAssignedTasks,
  getTasksByTeam,
  updateTaskStatus,
} from "../../api/taskApi";
import { queryClient } from "../../app/providers";
import type { CreateTaskInput, UpdateTaskStatusInput } from "./taskTypes";

export function useAssignedTasks() {
  return useQuery({
    queryKey: ["assignedTasks"],
    queryFn: getAssignedTasks,
  });
}

export function useTeamTasks(teamId: string) {
  return useQuery({
    queryKey: ["teamTasks", teamId],
    queryFn: () => getTasksByTeam(teamId),
    enabled: !!teamId,
  });
}

export function useCreateTask() {
  return useMutation({
    mutationFn: (payload: CreateTaskInput) => createTask(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["teamTasks", variables.teamId] });
      queryClient.invalidateQueries({ queryKey: ["assignedTasks"] });
    },
  });
}

export function useUpdateTaskStatus() {
  return useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: UpdateTaskStatusInput;
    }) => updateTaskStatus(taskId, payload),
    onSuccess: (task) => {
      const teamId =
        typeof task.teamId === "string" ? task.teamId : task.teamId._id;

      queryClient.invalidateQueries({ queryKey: ["teamTasks", teamId] });
      queryClient.invalidateQueries({ queryKey: ["assignedTasks"] });
    },
  });
}

export function useDeleteTask() {
  return useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teamTasks"] });
      queryClient.invalidateQueries({ queryKey: ["assignedTasks"] });
    },
  });
}