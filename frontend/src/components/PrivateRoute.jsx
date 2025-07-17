import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth();

  console.log("PrivateRoute - isAuthenticated:", isAuthenticated);
  console.log("PrivateRoute - loading:", loading);
  console.log("PrivateRoute - user:", user);
  console.log("PrivateRoute - requiredRole:", requiredRole);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Yükleniyor...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    if (requiredRole === "admin" && !user?.isAdmin) {
      console.warn("Role uyumsuzluğu: Kullanıcı isAdmin değil, erişim engellendi.");
      return <Navigate to="/" replace />;
    }
    // İleride başka roller varsa buraya ekleyebilirsin
  }

  return children;
};

export default PrivateRoute;
