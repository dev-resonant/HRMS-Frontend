import { Application, ApplicationMobile, Dashboard, Events, Account } from "@carbon/icons-react";

export const sidebarMenu = [
  {
    label: "Dashboard",
    icon: <Dashboard />,
    url: "/dashboard",
    divider: false,
  },
  {
    label: "Users",
    icon: <Events />,
    url: "/Users",
  },
  {
    label: "Group Of Application",
    icon: <Application />,
    children: [
      {
        label: "Applications",
        icon: <ApplicationMobile />,
        url: "/applications",
      },
    ],
  },
  {
    label: "Manage",
    icon: <Account />,
    children: [
      {
        label: "Role",
        url: "/role",
      },
    ],
  },
];

