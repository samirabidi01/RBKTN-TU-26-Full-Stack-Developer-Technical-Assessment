import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useLogin } from "../features/auth/useAuth";
import { getErrorMessage } from "../lib/utils";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await loginMutation.mutateAsync(values);
      navigate(from, { replace: true });
    } catch {
      // handled in UI
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-500">Access your teams and tasks.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register("email")} />
          <Input label="Password" type="password" placeholder="******" error={errors.password?.message} {...register("password")} />

          {loginMutation.isError ? (
            <p className="text-sm text-red-500">{getErrorMessage(loginMutation.error)}</p>
          ) : null}

          <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
            Login
          </Button>
        </form>

        <p className="mt-4 text-sm text-slate-500">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-slate-900">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}