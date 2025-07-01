import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

export default function PrivateRoute({ children }) {
  const { user } = UserAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}
