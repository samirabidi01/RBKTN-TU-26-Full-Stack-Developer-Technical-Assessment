import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import type { User } from "../auth/authTypes";
import type { TaskStatus } from "./taskTypes";

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  status: z.enum(["todo", "doing", "done"]),
  assignedUser: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type Props = {
  teamId: string;
  members: User[];
  isLoading?: boolean;
  onSubmit: (values: {
    title: string;
    description: string;
    status: TaskStatus;
    assignedUser?: string;
    teamId: string;
  }) => void;
};

export default function TaskForm({ teamId, members, isLoading, onSubmit }: Props) {
  const normalizedMembers = useMemo(() => members ?? [], [members]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      assignedUser: "",
    },
  });

  const submitHandler = (values: FormValues) => {
    onSubmit({
      ...values,
      assignedUser: values.assignedUser || undefined,
      teamId,
    });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Create Task</h3>

      <Input
        label="Title"
        placeholder="Fix auth flow"
        error={errors.title?.message}
        {...register("title")}
      />

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
        <textarea
          rows={4}
          placeholder="Describe the task..."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
          {...register("description")}
        />
        {errors.description?.message ? (
          <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Status</label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            {...register("status")}
          >
            <option value="todo">todo</option>
            <option value="doing">doing</option>
            <option value="done">done</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Assign to</label>
          <select
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-slate-900"
            {...register("assignedUser")}
          >
            <option value="">Unassigned</option>
            {normalizedMembers.map((member) => (
              <option key={member._id} value={member._id}>
                {member.name} ({member.email})
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" isLoading={isLoading}>
        Create Task
      </Button>
    </form>
  );
}