import { Suspense, useState } from "react";
import { Outlet, useLocation, Link as RouterLink } from "react-router";
import { Box, Breadcrumbs, Drawer, Link, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Sidebar, SIDEBAR_WIDTH } from "../components/Sidebar/Sidebar";
import { Header } from "../components/Header/Header";
import { AnimatedBackground } from "../components/motion/AnimatedBackground";
import { LoadingScreen } from "../components/motion/LoadingScreen";

export const Layout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [isSidebarLocked, setIsSidebarLocked] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  const isExpanded = isSidebarLocked || isSidebarHovered;
  const pathSegments = location.pathname.split("/").filter(Boolean);

  const toggleSidebar = () => (isMobile ? setDrawerOpen((o) => !o) : setIsSidebarLocked((prev) => !prev));

  return (
    <Box sx={{ position: "relative", height: "100dvh", width: "100%", display: "flex", overflow: "hidden" }}>
      <AnimatedBackground />
      {isMobile ? (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          slotProps={{ paper: { sx: { width: SIDEBAR_WIDTH, maxWidth: "85vw", border: 0 } } }}
        >
          <Sidebar isCollapsed={false} onNavigate={() => setDrawerOpen(false)} />
        </Drawer>
      ) : (
        <Sidebar
          isCollapsed={!isExpanded}
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
        />
      )}
      <Box sx={{ position: "relative", zIndex: 1, flex: 1, minWidth: 0, display: "flex", flexDirection: "column", height: "100%" }}>
        <Header onToggleSidebar={toggleSidebar} />
        <Box sx={{ px: { xs: 2, sm: 3, lg: 4 }, pt: 1.5, pb: 0, overflowX: "auto" }}>
          <Breadcrumbs aria-label="Page navigation breadcrumb" sx={{ fontSize: "0.8125rem", whiteSpace: "nowrap", maxWidth: 1440, mx: "auto" }}>
            <Link component={RouterLink} to="/dashboard" underline="hover" color="text.secondary">
              Home
            </Link>
            {pathSegments.map((segment, index) => {
              const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
              const name = segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
              return index === pathSegments.length - 1 ? (
                <Typography key={url} sx={{ fontSize: "inherit", fontWeight: 700 }}>
                  {name}
                </Typography>
              ) : (
                <Link key={url} component={RouterLink} to={url} underline="hover" color="text.secondary">
                  {name}
                </Link>
              );
            })}
          </Breadcrumbs>
        </Box>
        <Box component="main" sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
          <Suspense fallback={<LoadingScreen label="Loading page" />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>
    </Box>
  );
};
