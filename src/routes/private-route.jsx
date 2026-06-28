// src/routes/private-route.jsx
import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "../layouts/Layout.jsx";
import { Logout } from "../modules/Auth/Logout/Logout.jsx";
import { RolesList } from "../modules/Roles/RolesList.jsx";
import { AddRole } from "../modules/Roles/AddRole.jsx";
import { PermissionsList } from "../modules/Permissions/PermissionsList.jsx";
import { AddPermission } from "../modules/Permissions/AddPermission.jsx";

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
        path: "/roles/list",
        element: <RolesList />,
      },
      {
        path: "/roles/add",
        element: <AddRole />,
      },
      {
        path: "/permissions/list",
        element: <PermissionsList />,
      },
      {
        path: "/permissions/add",
        element: <AddPermission />,
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
