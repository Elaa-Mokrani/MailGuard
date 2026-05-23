import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const session = localStorage.getItem("mailguard_session");
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
