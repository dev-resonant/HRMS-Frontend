// src/routes/private-route.jsx
import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Layout } from "../layouts/Layout.jsx";

// Each page is its own chunk; <Layout/> shows a loading screen while a chunk or its data arrives.
const page = (load, name) => lazy(() => load().then((m) => ({ default: m[name] })));

const Dashboard = page(() => import("../modules/Dashboard/Dashboard.jsx"), "Dashboard");
const Logout = page(() => import("../modules/Auth/Logout/Logout.jsx"), "Logout");
const RolesList = page(() => import("../modules/Roles/RolesList.jsx"), "RolesList");
const Employees = page(() => import("../modules/Employees/Employees.jsx"), "Employees");
const Departments = page(() => import("../modules/Departments/Departments.jsx"), "Departments");
const Attendance = page(() => import("../modules/Attendance/Attendance.jsx"), "Attendance");
const Leave = page(() => import("../modules/Leave/Leave.jsx"), "Leave");
const Mispunch = page(() => import("../modules/Mispunch/Mispunch.jsx"), "Mispunch");
const Shifts = page(() => import("../modules/Workplace/Shifts.jsx"), "Shifts");
const OfficeLocations = page(() => import("../modules/Workplace/OfficeLocations.jsx"), "OfficeLocations");
const Holidays = page(() => import("../modules/Workplace/Holidays.jsx"), "Holidays");
const Settings = page(() => import("../modules/Settings/Settings.jsx"), "Settings");
const Companies = page(() => import("../modules/Platform/Companies.jsx"), "Companies");
const ChangePassword = page(() => import("../modules/Auth/ChangePassword/ChangePassword.jsx"), "ChangePassword");

export const private_routes = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/employees", element: <Employees /> },
      { path: "/departments", element: <Departments /> },
      { path: "/attendance", element: <Attendance /> },
      { path: "/leave", element: <Leave /> },
      { path: "/mispunch", element: <Mispunch /> },
      { path: "/shifts", element: <Shifts /> },
      { path: "/office-locations", element: <OfficeLocations /> },
      { path: "/holidays", element: <Holidays /> },
      { path: "/settings", element: <Settings /> },
      { path: "/platform/companies", element: <Companies /> },
      { path: "/change-password", element: <ChangePassword /> },
      { path: "/roles/list", element: <RolesList /> },
      { path: "/logout", element: <Logout /> },
      { path: "*", element: <Navigate to="/dashboard" /> },
    ],
  },
]);
