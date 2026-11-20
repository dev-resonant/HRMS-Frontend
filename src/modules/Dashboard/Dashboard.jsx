import { useRef } from "react";
import { useNavigate } from "react-router";
import { Box, Button, Card, CardContent, Skeleton, Stack, Typography } from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import PeopleOutlined from "@mui/icons-material/PeopleOutlined";
import ApartmentOutlined from "@mui/icons-material/ApartmentOutlined";
import EventOutlined from "@mui/icons-material/EventOutlined";
import EditCalendarOutlined from "@mui/icons-material/EditCalendarOutlined";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { useAuthContext } from "../../context/AuthContext/AuthContextExport";
import { useEmployees } from "../../api/employees-api";
import { useDepartments } from "../../api/departments-api";
import { useLeaveApplications } from "../../api/leave-api";
import { useMispunchRequests } from "../../api/mispunch-api";
import { useReveal } from "../../components/motion/useReveal";
import { CountUp } from "../../components/motion/CountUp";

const ONE = { page: 1, pageSize: 1 };

const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};

/** Live counts from the API; "—" when the account may not see that data. */
export const Dashboard = () => {
  const brand = useTheme().palette.brand;
  const navigate = useNavigate();
  const ref = useRef(null);
  const { getData } = useAuthContext();
  const userName = getData()?.userData?.name || "there";
  useReveal(ref, ".dash-item", { y: 22, stagger: 0.08 });

  const employees = useEmployees({ ...ONE, status: "active" });
  const departments = useDepartments();
  const leave = useLeaveApplications({ ...ONE, status: "pending" });
  const mispunch = useMispunchRequests({ ...ONE, status: "pending" });

  const tiles = [
    { title: "Active employees", q: employees, value: employees.data?.totalCount, icon: PeopleOutlined, color: brand.primary, to: "/employees" },
    { title: "Departments", q: departments, value: departments.data?.length, icon: ApartmentOutlined, color: brand.ink, to: "/departments" },
    { title: "Pending leave requests", q: leave, value: leave.data?.totalCount, icon: EventOutlined, color: "#2E8B83", to: "/leave" },
    { title: "Pending punch corrections", q: mispunch, value: mispunch.data?.totalCount, icon: EditCalendarOutlined, color: brand.accent, to: "/mispunch" },
  ];

  return (
    <Box ref={ref} sx={{ position: "relative", zIndex: 1, maxWidth: 1440, mx: "auto", p: { xs: 2, sm: 3, lg: 4 }, display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Hero */}
      <Box
        className="dash-item"
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "28px",
          p: { xs: 3, md: 4.5 },
          color: "#fff",
          background: `linear-gradient(120deg, ${brand.ink} 0%, color-mix(in srgb, ${brand.ink} 55%, ${brand.primary}) 100%)`,
          boxShadow: `0 20px 50px ${alpha(brand.ink, 0.3)}`,
        }}
      >
        <Box sx={{ position: "absolute", right: -60, top: -80, width: 320, height: 320, borderRadius: "50%", background: alpha(brand.soft, 0.18) }} />
        <Box sx={{ position: "absolute", right: 90, bottom: -110, width: 220, height: 220, borderRadius: "50%", background: alpha(brand.accent, 0.28) }} />
        <Box sx={{ position: "relative" }}>
          <Typography sx={{ opacity: 0.8, fontWeight: 600, letterSpacing: "0.04em", fontSize: "0.8125rem", textTransform: "uppercase" }}>
            {new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}
          </Typography>
          <Typography variant="h4" component="h1" sx={{ mt: 0.5, fontSize: { xs: "1.6rem", md: "2.1rem" } }}>
            {greeting()}, {userName}
          </Typography>
          <Typography sx={{ opacity: 0.85, mt: 0.75 }}>Here is what needs your attention today.</Typography>
          <Stack direction="row" sx={{ gap: 1.25, flexWrap: "wrap", mt: 2.5 }}>
            <Button variant="contained" onClick={() => navigate("/leave")} sx={{ bgcolor: "#fff", color: brand.ink, "&:hover": { bgcolor: brand.soft } }}>
              Review leave requests
            </Button>
            <Button variant="outlined" onClick={() => navigate("/attendance")} sx={{ color: "#fff", borderColor: alpha("#fff", 0.5), "&:hover": { borderColor: "#fff", bgcolor: alpha("#fff", 0.1) } }}>
              Open attendance
            </Button>
          </Stack>
        </Box>
      </Box>

      {/* Live counts */}
      <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))" }}>
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <Card key={t.title} className="dash-item" sx={{ "&:hover": { transform: "translateY(-4px)" } }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
                  <Typography sx={{ color: "text.secondary", fontSize: "0.8125rem", fontWeight: 600 }}>{t.title}</Typography>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2.5, display: "grid", placeItems: "center", color: t.color, bgcolor: alpha(t.color, 0.12) }}>
                    <Icon fontSize="small" />
                  </Box>
                </Stack>
                <Typography component="div" sx={{ fontFamily: '"Plus Jakarta Sans Variable", sans-serif', fontWeight: 800, fontSize: "2.4rem", lineHeight: 1.1, mt: 1.5, mb: 1 }}>
                  {t.q.isLoading ? <Skeleton width={70} /> : <CountUp value={t.value} />}
                </Typography>
                <Button size="small" endIcon={<ArrowForward fontSize="small" />} onClick={() => navigate(t.to)} sx={{ ml: -1 }}>
                  View
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};
