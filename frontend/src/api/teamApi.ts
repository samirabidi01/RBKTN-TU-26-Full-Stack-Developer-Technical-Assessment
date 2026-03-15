import { api } from "./axios";
import type {
  Team,
  TeamDetails,
  CreateTeamInput,
  JoinTeamInput,
} from "../features/teams/teamTypes";

export async function getMyTeams() {
  const { data } = await api.get<Team[]>("/teams");
  return data;
}

export async function createTeam(payload: CreateTeamInput) {
  const { data } = await api.post<Team>("/teams", payload);
  return data;
}

export async function joinTeam(payload: JoinTeamInput) {
  const { data } = await api.post<Team>("/teams/join", payload);
  return data;
}

export async function getTeamById(teamId: string) {
  const { data } = await api.get<TeamDetails>(`/teams/${teamId}`);
  return data;
}