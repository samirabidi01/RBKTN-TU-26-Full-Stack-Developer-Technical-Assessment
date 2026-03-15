import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import AppShell from "../components/layout/AppShell";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import TeamPage from "../pages/TeamPage";
import ProfilePage from "../pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/", element: <DashboardPage /> },
          { path: "/teams/:teamId", element: <TeamPage /> },
          { path: "/profile", element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);