import {
  Dashboard,
  UserMultiple,
  Enterprise,
  Security,
  Password,
  Events,
  Settings,
} from "@carbon/icons-react";

export const sidebarSections = [
  {
    category: "OVERVIEW",
    items: [
      {
        label: "Dashboard",
        icon: Dashboard,
        url: "/dashboard",
      },
    ],
  },
  {
    category: "ORGANIZATION",
    items: [
      {
        label: "Employees",
        icon: UserMultiple,
        url: "/employees",
      },
      {
        label: "Departments",
        icon: Enterprise,
        url: "/departments",
      },
    ],
  },
  {
    category: "ACCESS & SECURITY",
    items: [
      {
        label: "Roles",
        icon: Security,
        url: "/roles/list",
        badge: "4",
      },
      {
        label: "Permissions",
        icon: Password,
        url: "/permissions/list",
        badge: "Matrix",
      },
    ],
  },
  {
    category: "COMPLIANCE & SYSTEM",
    items: [
      {
        label: "Audit Logs",
        icon: Events,
        url: "/audit-logs",
      },
      {
        label: "Settings",
        icon: Settings,
        url: "/settings",
      },
    ],
  },
];
