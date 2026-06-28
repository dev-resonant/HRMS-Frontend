import { 
  LayoutDashboard as Dashboard, 
  Users as Employees,
  Building2 as Departments,
  Shield as Roles,
  BarChart3 as AuditLogs,
  Settings as SettingsIcon,
  Key as PermissionsIcon
} from "lucide-react";

export const sidebarMenu = [
  {
    label: "Dashboard",
    icon: <Dashboard size={20} />,
    url: "/dashboard",
  },
  {
    label: "Employees",
    icon: <Employees size={20} />,
    url: "/employees",
  },
  {
    label: "Departments",
    icon: <Departments size={20} />,
    url: "/departments",
  },
  {
    label: "Roles",
    icon: <Roles size={20} />,
    url: "/roles/list",
  },
  {
    label: "Permissions",
    icon: <PermissionsIcon size={20} />,
    url: "/permissions/list",
  },
  {
    label: "Audit Logs",
    icon: <AuditLogs size={20} />,
    url: "/audit-logs",
  },
  {
    label: "Settings",
    icon: <SettingsIcon size={20} />,
    url: "/settings",
  },
];

