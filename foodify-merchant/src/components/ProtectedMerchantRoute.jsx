import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

export default function ProtectedMerchantRoute() {
  const { user, restaurantOwner, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  if (!user || !restaurantOwner) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
