import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, UserCircle2, LogOut, Sparkles } from "lucide-react";
import { useAuthStore } from "../../features/auth/authStore";

function navClass(isActive: boolean) {
  return `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-violet-100 text-violet-700"
      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
  }`;
}

export default function Sidebar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const onLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <aside className="flex min-h-[calc(100vh-2rem)] flex-col rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
      <div className="mb-8 flex items-center gap-3 px-2 pt-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white">
          <Sparkles size={18} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Task-M</h1>
        </div>
      </div>

      <nav className="space-y-2">
        <NavLink to="/" className={({ isActive }) => navClass(isActive)}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => navClass(isActive)}>
          <UserCircle2 size={18} />
          Profile
        </NavLink>
      </nav>

      <div className="mt-auto border-t border-slate-200 pt-4">
        <div className="flex items-center justify-between rounded-2xl p-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-sm font-bold uppercase text-white">
              {user?.name?.[0] || "U"}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-slate-500">
                {user?.email || ""}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}