// src/routes/private.routes.jsx
import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "../layouts/Layout.jsx";
import { Logout } from "../modules/Auth/Logout/Logout.jsx";

export const private_routes = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/dashboard",
        element: <>Dashboard</>,
      },
      {
        path: "/applications",
        element: <>Applications</>,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
      {
        path: "*",
        element: <Navigate to="/dashboard" />,
      },
    ],
  },
]);
