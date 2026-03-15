import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Sparkles, UserPlus } from "lucide-react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useRegister } from "../features/auth/useAuth";
import { getErrorMessage } from "../lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await registerMutation.mutateAsync(values);
      navigate("/login", { replace: true });
    } catch {
      // handled in UI
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7fb] px-4 py-6 lg:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="flex items-center justify-center p-6 sm:p-8 lg:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">Task-M</p>
                  <p className="text-sm text-slate-500">Create your account</p>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)] sm:p-8">
              <div>
                <p className="text-sm font-medium text-violet-600">Get started</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                  Create your account
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Join your workspace and start managing teams and tasks.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Samir Abidi"
                  error={errors.name?.message}
                  {...register("name")}
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register("email")}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="Create a secure password"
                  error={errors.password?.message}
                  {...register("password")}
                />

                {registerMutation.isError ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {getErrorMessage(registerMutation.error)}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  className="w-full rounded-2xl py-3.5 text-base"
                  isLoading={registerMutation.isPending}
                >
                  <span className="flex items-center gap-2">
                    Register
                    <ArrowRight size={18} />
                  </span>
                </Button>
              </form>

              <div className="mt-6 text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-violet-600 transition hover:text-violet-500"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.35),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_28%)]" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/20">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xl font-bold">Task-M</p>
              <p className="text-sm text-slate-300">Build productive teams faster</p>
            </div>
          </div>

          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 backdrop-blur">
              <UserPlus size={16} />
              Join the workspace
            </div>

            <h1 className="mt-6 text-5xl font-bold leading-tight">
              Organize your team tasks with clarity.
            </h1>

            <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
              Create teams, assign tasks, manage progress, and keep your full-stack
              workflow structured from day one.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Simple team creation and collaboration",
                "Fast task assignment and status updates",
                "Clean dashboard with actionable insights",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-200">
                  <CheckCircle2 size={18} className="text-violet-400" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-3xl font-bold">Teams</p>
              <p className="mt-2 text-sm text-slate-400">
                Create and join team workspaces easily
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <p className="text-3xl font-bold">Tasks</p>
              <p className="mt-2 text-sm text-slate-400">
                Track progress from todo to done
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}