import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-[#f6f7fb] p-4">
      <main className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_1fr]">
        <Sidebar />
        <div className="rounded-[28px] bg-transparent">
          <Outlet />
        </div>
      </main>
    </div>
  );
}