import Card from "../../components/ui/Card";
import type { Task, TaskStatus } from "./taskTypes";
import { formatDate } from "../../lib/utils";

type Props = {
  task: Task;
  currentUserId?: string;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onDelete?: (taskId: string) => void;
};

const statusClassMap: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-700",
  doing: "bg-amber-100 text-amber-700",
  done: "bg-emerald-100 text-emerald-700",
};

export default function TaskCard({
  task,
  currentUserId,
  onStatusChange,
  onDelete,
}: Props) {
  const assignedUserName =
    task.assignedUser && typeof task.assignedUser === "object"
      ? task.assignedUser.name
      : "Unassigned";

  const createdById =
    task.createdBy && typeof task.createdBy === "object"
      ? task.createdBy._id
      : task.createdBy;

  const teamName =
    task.teamId && typeof task.teamId === "object"
      ? task.teamId.name
      : "Team";

  const canDelete = !!currentUserId && createdById === currentUserId;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900">
              {task.title}
            </h3>
            <p className="mt-1 truncate text-sm text-slate-500">{teamName}</p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${statusClassMap[task.status]}`}
          >
            {task.status}
          </span>
        </div>

        {task.description ? (
          <p className="line-clamp-2 text-sm text-slate-600">{task.description}</p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
          <span>Assigned: {assignedUserName}</span>
          <span>•</span>
          <span>{formatDate(task.createdAt)}</span>
        </div>

        {(onStatusChange || canDelete) && (
          <div className="flex flex-wrap items-center gap-3">
            {onStatusChange && (
              <select
                value={task.status}
                onChange={(e) =>
                  onStatusChange(task._id, e.target.value as TaskStatus)
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-400"
              >
                <option value="todo">todo</option>
                <option value="doing">doing</option>
                <option value="done">done</option>
              </select>
            )}

            {canDelete && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(task._id)}
                className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}