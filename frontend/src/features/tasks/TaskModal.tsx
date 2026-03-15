import Modal from "../../components/ui/Modal";
import TaskForm from "./TaskForm";
import type { User } from "../auth/authTypes";
import type { Task } from "./taskTypes";

type Props = {
  open: boolean;
  task: Task | null;
  teamId: string;
  members: User[];
  isLoading?: boolean;
  errorMessage?: string;
  onClose: () => void;
  onSubmit: (values: {
    title: string;
    description: string;
    status: "todo" | "doing" | "done";
    assignedUser?: string;
    teamId: string;
  }) => void;
};

export default function UpdateTaskModal({
  open,
  task,
  teamId,
  members,
  isLoading,
  errorMessage,
  onClose,
  onSubmit,
}: Props) {
  if (!task) return null;

  const assignedUserId =
    task.assignedUser && typeof task.assignedUser === "object"
      ? task.assignedUser._id
      : task.assignedUser || "";

  return (
    <Modal open={open} title="Update Task" onClose={onClose}>
      <TaskForm
  teamId={teamId}
  members={members}
  isLoading={isLoading}
  onSubmit={onSubmit}
/>

      {errorMessage ? (
        <p className="mt-3 text-sm text-red-500">{errorMessage}</p>
      ) : null}
    </Modal>
  );
}