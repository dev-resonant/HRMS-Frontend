import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";

const page = (load, name) => lazy(() => load().then((m) => ({ default: m[name] })));

const Logout = page(() => import("../modules/Auth/Logout/Logout.jsx"), "Logout");
const Login = page(() => import("../modules/Auth/Login/Login.jsx"), "Login");
const Signup = page(() => import("../modules/Auth/Signup/Signup.jsx"), "Signup");
const ForgotPassword = page(() => import("../modules/Auth/ForgotPassword/ForgotPassword.jsx"), "ForgotPassword");
const ResetPassword = page(() => import("../modules/Auth/ResetPassword/ResetPassword.jsx"), "ResetPassword");
const SetPassword = page(() => import("../modules/Auth/SetPassword/SetPassword.jsx"), "SetPassword");

export const open_routes = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/set-password", element: <SetPassword /> },
  { path: "/logout", element: <Logout /> },
  { path: "*", element: <Navigate to="/login" /> },
]);
