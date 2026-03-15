import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Clock3,
  Plus,
  Sparkles,
  Users,
  UserPlus,
} from "lucide-react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import TeamCard from "../features/teams/TeamCard";
import TaskCard from "../features/tasks/TaskCard";
import {
  useTeams,
  useCreateTeam,
  useJoinTeam,
} from "../features/teams/teamHooks";
import {
  useAssignedTasks,
  useDeleteTask,
  useUpdateTaskStatus,
} from "../features/tasks/taskHooks";
import { useAuthStore } from "../features/auth/authStore";
import { getErrorMessage } from "../lib/utils";

const createTeamSchema = z.object({
  name: z.string().min(2, "Team name must be at least 2 characters"),
});

const joinTeamSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
});

type CreateTeamValues = z.infer<typeof createTeamSchema>;
type JoinTeamValues = z.infer<typeof joinTeamSchema>;

function StatCard({
  title,
  value,
  icon,
  accentClass,
  footer,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  accentClass: string;
  footer?: React.ReactNode;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>

        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accentClass}`}>
          {icon}
        </div>
      </div>

      {footer ? <div className="mt-5">{footer}</div> : null}
    </Card>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  const teamsQuery = useTeams();
  const assignedTasksQuery = useAssignedTasks();
  const createTeamMutation = useCreateTeam();
  const joinTeamMutation = useJoinTeam();
  const updateStatusMutation = useUpdateTaskStatus();
  const deleteTaskMutation = useDeleteTask();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  const createTeamForm = useForm<CreateTeamValues>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: { name: "" },
  });

  const joinTeamForm = useForm<JoinTeamValues>({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: { teamId: "" },
  });

  const onCreateTeam = async (values: CreateTeamValues) => {
    try {
      await createTeamMutation.mutateAsync(values);
      createTeamForm.reset();
      setShowCreateForm(false);
    } catch {}
  };

  const onJoinTeam = async (values: JoinTeamValues) => {
    try {
      await joinTeamMutation.mutateAsync(values);
      joinTeamForm.reset();
      setShowJoinForm(false);
    } catch {}
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

  const tasks = assignedTasksQuery.data ?? [];
  const teams = teamsQuery.data ?? [];

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const inProgress = tasks.filter((task) => task.status === "doing").length;
    const completed = tasks.filter((task) => task.status === "done").length;
    const completionRate =
      totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

    return {
      totalTasks,
      inProgress,
      completed,
      completionRate,
      teams: teams.length,
    };
  }, [tasks, teams]);

  return (
    <div className="space-y-8 px-2 py-4">
      <section>
        <h1 className="text-4xl font-bold tracking-tight text-slate-950">
          Welcome back,{" "}
          <span className="text-violet-600">{user?.name || "there"}</span> 👋
        </h1>
        <p className="mt-3 text-lg text-slate-500">
          Here's what's happening across your teams.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={<Sparkles className="text-blue-600" size={22} />}
          accentClass="bg-blue-100"
        />

        <StatCard
          title="In Progress"
          value={stats.inProgress}
          icon={<Clock3 className="text-amber-600" size={22} />}
          accentClass="bg-amber-100"
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle2 className="text-emerald-600" size={22} />}
          accentClass="bg-emerald-100"
          footer={
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="text-slate-500">Completion</span>
                <span className="font-semibold text-emerald-600">
                  {stats.completionRate}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>
          }
        />

        <StatCard
          title="Teams"
          value={stats.teams}
          icon={<Users className="text-violet-600" size={22} />}
          accentClass="bg-violet-100"
        />
      </section>


      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-950">Your Teams</h2>
              <p className="text-sm text-slate-500">
                Teams you created or joined.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                className="rounded-full px-5 py-2.5"
                onClick={() => {
                  setShowJoinForm((prev) => !prev);
                  setShowCreateForm(false);
                }}
              >
                <UserPlus size={16} className="mr-2" />
                Join
              </Button>

              <Button
                className="rounded-full px-5 py-2.5"
                onClick={() => {
                  setShowCreateForm((prev) => !prev);
                  setShowJoinForm(false);
                }}
              >
                <Plus size={16} className="mr-2" />
                New team
              </Button>
            </div>
          </div>

          {showCreateForm && (
            <Card>
              <h3 className="text-lg font-semibold text-slate-900">
                Create a new team
              </h3>
              <form
                onSubmit={createTeamForm.handleSubmit(onCreateTeam)}
                className="mt-4 space-y-4"
              >
                <Input
                  label="Team Name"
                  placeholder="Frontend Team"
                  error={createTeamForm.formState.errors.name?.message}
                  {...createTeamForm.register("name")}
                />
                {createTeamMutation.isError ? (
                  <p className="text-sm text-red-500">
                    {getErrorMessage(createTeamMutation.error)}
                  </p>
                ) : null}
                <Button type="submit" isLoading={createTeamMutation.isPending}>
                  Create Team
                </Button>
              </form>
            </Card>
          )}

          {showJoinForm && (
            <Card>
              <h3 className="text-lg font-semibold text-slate-900">
                Join an existing team
              </h3>
              <form
                onSubmit={joinTeamForm.handleSubmit(onJoinTeam)}
                className="mt-4 space-y-4"
              >
                <Input
                  label="Team ID"
                  placeholder="Paste team ID"
                  error={joinTeamForm.formState.errors.teamId?.message}
                  {...joinTeamForm.register("teamId")}
                />
                {joinTeamMutation.isError ? (
                  <p className="text-sm text-red-500">
                    {getErrorMessage(joinTeamMutation.error)}
                  </p>
                ) : null}
                <Button type="submit" isLoading={joinTeamMutation.isPending}>
                  Join Team
                </Button>
              </form>
            </Card>
          )}

          {teamsQuery.isLoading ? <Loader /> : null}

          {teams.length ? (
            <div className="grid gap-4">
              {teams.map((team) => (
                <TeamCard key={team._id} team={team} />
              ))}
            </div>
          ) : !teamsQuery.isLoading ? (
            <EmptyState
              title="No teams yet"
              description="Create a team or join one using a team ID."
            />
          ) : null}
        </div>

        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Recent Activity
            </h2>
            <p className="text-sm text-slate-500">
              Tasks currently assigned to you.
            </p>
          </div>

          {assignedTasksQuery.isLoading ? <Loader /> : null}

          {tasks.length ? (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  currentUserId={user?._id}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : !assignedTasksQuery.isLoading ? (
            <EmptyState
              title="No assigned tasks"
              description="Tasks assigned to you will appear here."
            />
          ) : null}
        </div>
      </section>
    </div>
  );
}