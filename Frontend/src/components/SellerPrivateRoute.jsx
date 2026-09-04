import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const SellerPrivateRoute = ({ children }) => {
  const token = Cookies.get("sellerToken");

  if (!token) {
    return <Navigate to="/seller/login" />;
  }

  return children;
};

export default SellerPrivateRoute;
