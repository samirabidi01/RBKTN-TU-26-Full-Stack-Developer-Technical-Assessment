import { useParams } from "react-router-dom";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import Card from "../components/ui/Card";
import { useTeam } from "../features/teams/teamHooks";
import {
  useCreateTask,
  useDeleteTask,
  useTeamTasks,
  useUpdateTaskStatus,
} from "../features/tasks/taskHooks";
import TaskForm from "../features/tasks/TaskForm";
import TaskCard from "../features/tasks/TaskCard";
import { useAuthStore } from "../features/auth/authStore";
import type { User } from "../features/auth/authTypes";
import { getErrorMessage } from "../lib/utils";

export default function TeamPage() {
  const { teamId = "" } = useParams();
  const user = useAuthStore((state) => state.user);

  const teamQuery = useTeam(teamId);
  const tasksQuery = useTeamTasks(teamId);
  const createTaskMutation = useCreateTask();
  const updateStatusMutation = useUpdateTaskStatus();
  const deleteTaskMutation = useDeleteTask();

  const team = teamQuery.data;
  const members: User[] = team?.members ?? [];

  const handleCreateTask = async (values: {
    title: string;
    description: string;
    status: "todo" | "doing" | "done";
    assignedUser?: string;
    teamId: string;
  }) => {
    await createTaskMutation.mutateAsync(values);
  };

  const handleStatusChange = async (
    taskId: string,
    status: "todo" | "doing" | "done"
  ) => {
    await updateStatusMutation.mutateAsync({ taskId, payload: { status } });
  };

  const handleDelete = async (taskId: string) => {
    await deleteTaskMutation.mutateAsync(taskId);
  };

  if (teamQuery.isLoading) return <Loader />;

  if (!team) {
    return (
      <EmptyState
        title="Team not found"
        description="The team does not exist or you do not have access."
      />
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">{team.name}</h1>
        <div className="mt-4 grid gap-2 text-sm text-slate-500 md:grid-cols-3">
          <p>Team ID: {team._id}</p>
          <p>Members: {members.length}</p>
          <p>Created at: {new Date(team.createdAt).toLocaleString()}</p>
        </div>
      </Card>

      <TaskForm
        teamId={teamId}
        members={members}
        isLoading={createTaskMutation.isPending}
        onSubmit={handleCreateTask}
      />

      {createTaskMutation.isError ? (
        <p className="text-sm text-red-500">
          {getErrorMessage(createTaskMutation.error)}
        </p>
      ) : null}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Team Tasks</h2>
          <p className="text-sm text-slate-500">All tasks for this team.</p>
        </div>

        {tasksQuery.isLoading ? <Loader /> : null}

        {tasksQuery.data?.length
          ? tasksQuery.data.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                currentUserId={user?._id}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))
          : !tasksQuery.isLoading && (
              <EmptyState
                title="No tasks yet"
                description="Create the first task for this team."
              />
            )}
      </section>
    </div>
  );
}