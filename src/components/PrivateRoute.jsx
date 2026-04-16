import { Navigate } from "react-router-dom";

export function PrivateRoute({ session, children }) {
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return children;
}