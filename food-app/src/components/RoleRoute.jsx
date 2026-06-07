import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RoleRoute({
  children,
  requireCustomer = false,
  requireRestaurantOwner = false,
  redirectTo = "/login",
}) {
  const {
    user,
    restaurantOwner,
  } = useContext(
    AuthContext
  );

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireRestaurantOwner && !restaurantOwner) {
    return <Navigate to={redirectTo} replace />;
  }

  if (requireCustomer && restaurantOwner) {
    return <Navigate to="/restaurant-dashboard" replace />;
  }

  return children;
}
