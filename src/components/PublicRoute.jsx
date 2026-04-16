import { Navigate } from "react-router-dom";

export function PublicRoute({ session, children }) {
  if (session) {
    return <Navigate to="/" replace />;
  }
  return children;
}