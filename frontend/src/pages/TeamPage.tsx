import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import Loader from "../components/common/Loader";
import EmptyState from "../components/common/EmptyState";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useTeam } from "../features/teams/teamHooks";
import {
  useCreateTask,
  useDeleteTask,
  useTeamTasks,
  useUpdateTaskStatus,
} from "../features/tasks/taskHooks";
import TaskForm from "../features/tasks/TaskForm";
import { useAuthStore } from "../features/auth/authStore";
import type { User } from "../features/auth/authTypes";
import type { Task, TaskStatus } from "../features/tasks/taskTypes";
import { getErrorMessage, formatDate } from "../lib/utils";

const PAGE_SIZE = 5;

const tabs: Array<{ label: string; value: "all" | TaskStatus }> = [
  { label: "All Tasks", value: "all" },
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "doing" },
  { label: "Done", value: "done" },
];

function getUserName(user: Task["assignedUser"] | Task["createdBy"]) {
  return user && typeof user === "object" ? user.name : "—";
}

// function getTeamIdFromTask(task: Task) {
//   return typeof task.teamId === "string" ? task.teamId : task.teamId?._id;
// }

export default function TeamPage() {
  const { teamId = "" } = useParams();
  const user = useAuthStore((state) => state.user);

  const teamQuery = useTeam(teamId);
  const tasksQuery = useTeamTasks(teamId);
  const createTaskMutation = useCreateTask();
  const updateStatusMutation = useUpdateTaskStatus();
  const deleteTaskMutation = useDeleteTask();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | TaskStatus>("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const team = teamQuery.data;
  const members: User[] = team?.members ?? [];
  const tasks = tasksQuery.data ?? [];

  const handleCreateTask = async (values: {
    title: string;
    description: string;
    status: "todo" | "doing" | "done";
    assignedUser?: string;
    teamId: string;
  }) => {
    await createTaskMutation.mutateAsync(values);
    setShowCreateForm(false);
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

  const counts = useMemo(() => {
    return {
      all: tasks.length,
      todo: tasks.filter((task) => task.status === "todo").length,
      doing: tasks.filter((task) => task.status === "doing").length,
      done: tasks.filter((task) => task.status === "done").length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesTab = activeTab === "all" ? true : task.status === activeTab;

      const assignedName =
        task.assignedUser && typeof task.assignedUser === "object"
          ? task.assignedUser.name
          : "";

      const createdByName =
        task.createdBy && typeof task.createdBy === "object"
          ? task.createdBy.name
          : "";

      const matchesSearch =
        !normalizedSearch ||
        task.title.toLowerCase().includes(normalizedSearch) ||
        task.description.toLowerCase().includes(normalizedSearch) ||
        assignedName.toLowerCase().includes(normalizedSearch) ||
        createdByName.toLowerCase().includes(normalizedSearch);

      return matchesTab && matchesSearch;
    });
  }, [tasks, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));

  const paginatedTasks = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredTasks.slice(start, start + PAGE_SIZE);
  }, [filteredTasks, page]);

  const startItem = filteredTasks.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(page * PAGE_SIZE, filteredTasks.length);

  const goToPage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    setPage(nextPage);
  };

  const onTabChange = (value: "all" | TaskStatus) => {
    setActiveTab(value);
    setPage(1);
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
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
      <Card className="rounded-[28px]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              {team.name}
            </h1>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
              <p>Team ID: {team._id}</p>
              <p>Members: {members.length}</p>
              <p>Created: {new Date(team.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <Button
            className="rounded-full px-5 py-2.5"
            onClick={() => setShowCreateForm((prev) => !prev)}
          >
            <Plus size={16} className="mr-2" />
            {showCreateForm ? "Close" : "New Task"}
          </Button>
        </div>
      </Card>

      {showCreateForm && (
        <TaskForm
          teamId={teamId}
          members={members}
          isLoading={createTaskMutation.isPending}
          onSubmit={handleCreateTask}
        />
      )}

      {createTaskMutation.isError ? (
        <p className="text-sm text-red-500">
          {getErrorMessage(createTaskMutation.error)}
        </p>
      ) : null}

      <section className="space-y-5">
        <div className="flex flex-wrap items-center gap-6 border-b border-slate-200">
          {tabs.map((tab) => {
            const count =
              tab.value === "all" ? counts.all : counts[tab.value];

            const isActive = activeTab === tab.value;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => onTabChange(tab.value)}
                className={`inline-flex items-center gap-2 border-b-2 px-1 py-4 text-sm font-semibold transition ${
                  isActive
                    ? "border-violet-600 text-violet-600"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? "bg-violet-100 text-violet-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-md">
            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Search tasks or assignees..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-11"
            />
          </div>

          <p className="text-sm text-slate-500">
            Showing {startItem}-{endItem} of {filteredTasks.length} tasks
          </p>
        </div>

        {tasksQuery.isLoading ? <Loader /> : null}

        {filteredTasks.length ? (
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Task
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Assigned To
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created By
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedTasks.map((task) => {
                    const createdById =
                      task.createdBy && typeof task.createdBy === "object"
                        ? task.createdBy._id
                        : task.createdBy;

                    const canDelete =
                      !!user?._id && createdById === user._id;

                    return (
                      <tr
                        key={task._id}
                        className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-5 align-top">
                          <div className="max-w-[340px]">
                            <p className="truncate text-base font-semibold text-slate-900">
                              {task.title}
                            </p>
                            <p className="mt-1 truncate text-sm text-slate-500">
                              {task.description}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5 align-top">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              task.status === "todo"
                                ? "bg-slate-100 text-slate-700"
                                : task.status === "doing"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {task.status === "todo"
                              ? "To Do"
                              : task.status === "doing"
                              ? "In Progress"
                              : "Done"}
                          </span>
                        </td>

                        <td className="px-6 py-5 align-top text-sm text-slate-700">
                          {getUserName(task.assignedUser)}
                        </td>

                        <td className="px-6 py-5 align-top text-sm text-slate-700">
                          {getUserName(task.createdBy)}
                        </td>

                        <td className="px-6 py-5 align-top text-sm text-slate-500">
                          {formatDate(task.createdAt)}
                        </td>

                        <td className="px-6 py-5 align-top">
                          <div className="flex flex-col gap-2">
                            <select
                              value={task.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  task._id,
                                  e.target.value as TaskStatus
                                )
                              }
                              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400"
                            >
                              <option value="todo">todo</option>
                              <option value="doing">doing</option>
                              <option value="done">done</option>
                            </select>

                            {canDelete ? (
                              <button
                                type="button"
                                onClick={() => handleDelete(task._id)}
                                className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                              >
                                Delete
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        ) : !tasksQuery.isLoading ? (
          <EmptyState
            title="No tasks found"
            description="Try another search or create a new task."
          />
        ) : null}

        {filteredTasks.length > 0 && (
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-slate-500">
              Showing {startItem}-{endItem} of {filteredTasks.length} tasks
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2"
              >
                Previous
              </Button>

              <div className="px-3 text-sm font-medium text-slate-600">
                Page {page} of {totalPages}
              </div>

              <Button
                variant="secondary"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}