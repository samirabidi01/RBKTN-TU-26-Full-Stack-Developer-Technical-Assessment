import { useMutation, useQuery } from "@tanstack/react-query";
import { createTeam, getMyTeams, getTeamById, joinTeam } from "../../api/teamApi";
import { queryClient } from "../../app/providers";
import type { CreateTeamInput, JoinTeamInput } from "./teamTypes";

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: getMyTeams,
  });
}

export function useTeam(teamId: string) {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: () => getTeamById(teamId),
    enabled: !!teamId,
  });
}

export function useCreateTeam() {
  return useMutation({
    mutationFn: (payload: CreateTeamInput) => createTeam(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}

export function useJoinTeam() {
  return useMutation({
    mutationFn: (payload: JoinTeamInput) => joinTeam(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
}