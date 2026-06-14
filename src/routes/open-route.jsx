import { createBrowserRouter, Navigate } from "react-router";
import { Logout } from "../modules/Auth/Logout/Logout.jsx";
import { Login } from "../modules/Auth/Login/Login.jsx";
import { Signup } from "../modules/Auth/Signup/Signup.jsx";
import { ForgotPassword } from "../modules/Auth/ForgotPassword/ForgotPassword";
import { ResetPassword } from "../modules/Auth/ResetPassword/ResetPassword.jsx";

export const open_routes = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
]);
