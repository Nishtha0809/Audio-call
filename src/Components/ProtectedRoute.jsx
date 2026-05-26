import React from "react";

import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  // GET TOKEN
  const token = localStorage.getItem("token");

  // IF TOKEN NOT FOUND
  if (!token) {

    // REDIRECT TO LOGIN
    return <Navigate to="/login" />;

  }

  // SHOW PAGE
  return children;
}

export default ProtectedRoute;