import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Loader from "../components/common/Loader";
import { useProfile, useUpdateProfile } from "../features/profile/profileHooks";
import { formatDate, getErrorMessage } from "../lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function ProfilePage() {
  const profileQuery = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      name: profileQuery.data?.name || "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    await updateProfileMutation.mutateAsync(values);
  };

  if (profileQuery.isLoading) return <Loader />;

  if (!profileQuery.data) {
    return (
      <Card>
        <p className="text-sm text-red-500">Failed to load profile.</p>
      </Card>
    );
  }

  const profile = profileQuery.data;

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
        <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
          <p><span className="font-semibold text-slate-900">Email:</span> {profile.email}</p>
          <p><span className="font-semibold text-slate-900">Role:</span> {profile.role}</p>
          <p><span className="font-semibold text-slate-900">Created at:</span> {formatDate(profile.createdAt)}</p>
          <p><span className="font-semibold text-slate-900">User ID:</span> {profile._id}</p>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">Update Name</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <Input
            label="Name"
            error={form.formState.errors.name?.message}
            {...form.register("name")}
          />

          {updateProfileMutation.isError ? (
            <p className="text-sm text-red-500">{getErrorMessage(updateProfileMutation.error)}</p>
          ) : null}

          {updateProfileMutation.isSuccess ? (
            <p className="text-sm text-emerald-600">Profile updated successfully.</p>
          ) : null}

          <Button type="submit" isLoading={updateProfileMutation.isPending}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
}