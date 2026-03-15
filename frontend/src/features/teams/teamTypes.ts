import type { User } from "../auth/authTypes";

export type Team = {
  _id: string;
  name: string;
  owner: User;
  members: User[];
  createdAt: string;
};

export type TeamDetails = Team;

export type CreateTeamInput = {
  name: string;
};

export type JoinTeamInput = {
  teamId: string;
};