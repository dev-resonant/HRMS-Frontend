import DashboardOutlined from "@mui/icons-material/DashboardOutlined";
import PeopleOutline from "@mui/icons-material/PeopleOutlined";
import ApartmentOutlined from "@mui/icons-material/ApartmentOutlined";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import AccessTimeOutlined from "@mui/icons-material/AccessTimeOutlined";
import EventOutlined from "@mui/icons-material/EventOutlined";
import EditCalendarOutlined from "@mui/icons-material/EditCalendarOutlined";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import ScheduleOutlined from "@mui/icons-material/ScheduleOutlined";
import BusinessOutlined from "@mui/icons-material/BusinessOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import BeachAccessOutlined from "@mui/icons-material/BeachAccessOutlined";

export const sidebarSections = [
  {
    category: "OVERVIEW",
    items: [{ label: "Dashboard", icon: DashboardOutlined, url: "/dashboard" }],
  },
  {
    category: "ORGANIZATION",
    items: [
      { label: "Employees", icon: PeopleOutline, url: "/employees" },
      { label: "Departments", icon: ApartmentOutlined, url: "/departments" },
    ],
  },
  {
    category: "TIME & ATTENDANCE",
    items: [
      { label: "Attendance", icon: AccessTimeOutlined, url: "/attendance" },
      { label: "Leave", icon: EventOutlined, url: "/leave" },
      { label: "Punch corrections", icon: EditCalendarOutlined, url: "/mispunch" },
      { label: "Shifts", icon: ScheduleOutlined, url: "/shifts" },
      { label: "Office locations", icon: PlaceOutlined, url: "/office-locations" },
      { label: "Holidays", icon: BeachAccessOutlined, url: "/holidays" },
    ],
  },
  {
    category: "ACCESS & SECURITY",
    items: [
      { label: "Roles", icon: ShieldOutlined, url: "/roles/list" },
      { label: "Change password", icon: LockOutlined, url: "/change-password" },
    ],
  },
  {
    category: "SYSTEM",
    items: [
      { label: "Company settings", icon: SettingsOutlined, url: "/settings" },
      { label: "Companies", icon: BusinessOutlined, url: "/platform/companies" },
    ],
  },
];
