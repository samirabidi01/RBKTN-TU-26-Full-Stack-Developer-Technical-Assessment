import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/authStore";

export default function Navbar() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const onLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-lg font-bold text-slate-900">
          Team Task Manager
        </Link>

        <div className="flex items-center gap-3">
          <Link to="/profile" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            {user?.name || "Profile"}
          </Link>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}