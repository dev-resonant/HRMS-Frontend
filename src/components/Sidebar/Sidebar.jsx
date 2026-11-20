import { useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { useReveal } from "../motion/useReveal";
import { Avatar, Box, Chip, Tooltip, Typography } from "@mui/material";
import ApartmentRounded from "@mui/icons-material/ApartmentRounded";
import { useTheme } from "@mui/material/styles";
import { useAuthContext } from "../../context/AuthContext/AuthContextExport";
import { sidebarSections } from "./constant";

export const SIDEBAR_WIDTH = 264;
export const SIDEBAR_COLLAPSED_WIDTH = 72;

export const Sidebar = ({ isCollapsed, onMouseEnter, onMouseLeave, onNavigate }) => {
  const brand = useTheme().palette.brand;
  const routerNavigate = useNavigate();
  const navigate = (path) => {
    routerNavigate(path);
    onNavigate?.();
  };
  const location = useLocation();
  const navRef = useRef(null);
  useReveal(navRef, ".nav-item", { y: 0, x: -14, stagger: 0.025, duration: 0.45 });
  const { getData } = useAuthContext();
  const user = getData()?.userData;
  const userName = user?.name ?? "User";
  const userRole = user?.roleDisplayName ?? user?.role ?? "";

  const fade = {
    opacity: isCollapsed ? 0 : 1,
    transition: "opacity 0.15s ease",
    whiteSpace: "nowrap",
    pointerEvents: isCollapsed ? "none" : "auto",
  };

  return (
    <Box
      component="aside"
      aria-label="ProHRM navigation"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      sx={{
        width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH,
        transition: "width 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        height: "100%",
        background: `linear-gradient(185deg, ${brand.ink} 0%, color-mix(in srgb, ${brand.ink} 78%, ${brand.primary}) 100%)`,
        color: brand.bg,
        boxShadow: "4px 0 24px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flexShrink: 0,
        zIndex: 10,
      }}
    >
      {/* Brand */}
      <Box
        onClick={() => navigate("/dashboard")}
        sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, height: 64, cursor: "pointer", flexShrink: 0 }}
      >
        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: brand.accent, display: "grid", placeItems: "center", flexShrink: 0 }}>
          <ApartmentRounded sx={{ color: "#fff" }} />
        </Box>
        <Box sx={{ ...fade, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontFamily: '"Plus Jakarta Sans Variable", sans-serif', fontWeight: 800, fontSize: "1.1rem", color: "#fff" }}>ProHRM</Typography>
            <Chip label="v1.0" size="small" sx={{ height: 18, fontSize: "0.65rem", bgcolor: brand.soft, color: brand.ink }} />
          </Box>
          <Typography sx={{ fontSize: "0.65rem", letterSpacing: "0.12em", color: brand.soft }}>ENTERPRISE SUITE</Typography>
        </Box>
      </Box>

      {/* Navigation */}
      <Box component="nav" ref={navRef} sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", px: 1.25, py: 1 }}>
        {sidebarSections.map((section) => (
          <Box key={section.category} sx={{ mb: 1.5 }}>
            <Typography sx={{ ...fade, px: 1.5, py: 0.75, fontSize: "0.65rem", letterSpacing: "0.12em", fontWeight: 700, color: "rgba(168,218,220,0.7)" }}>
              {section.category}
            </Typography>
            {section.items.map((item) => {
              const selected = location.pathname === item.url || (item.url === "/dashboard" && location.pathname === "/");
              const Icon = item.icon;
              return (
                <Tooltip key={item.url} title={isCollapsed ? item.label : ""} placement="right">
                  <Box
                    component="button"
                    className="nav-item"
                    type="button"
                    onClick={() => navigate(item.url)}
                    sx={{
                      all: "unset",
                      boxSizing: "border-box",
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 1.5,
                      py: 1,
                      mb: 0.25,
                      borderRadius: 2,
                      cursor: "pointer",
                      position: "relative",
                      color: selected ? "#fff" : "rgba(241,250,238,0.78)",
                      bgcolor: selected ? "rgba(69,123,157,0.55)" : "transparent",
                      "&:hover": { bgcolor: selected ? "rgba(69,123,157,0.65)" : "rgba(168,218,220,0.12)" },
                      "&:focus-visible": { outline: `2px solid ${brand.soft}` },
                      "&::before": selected
                        ? { content: '""', position: "absolute", left: -6, top: 8, bottom: 8, width: 3, borderRadius: 2, bgcolor: brand.accent }
                        : undefined,
                    }}
                  >
                    <Icon fontSize="small" sx={{ flexShrink: 0 }} />
                    <Typography sx={{ ...fade, flex: 1, fontSize: "0.875rem", fontWeight: selected ? 600 : 500 }}>{item.label}</Typography>
                    {item.badge && (
                      <Chip label={item.badge} size="small" sx={{ ...fade, height: 18, fontSize: "0.65rem", bgcolor: brand.soft, color: brand.ink }} />
                    )}
                  </Box>
                </Tooltip>
              );
            })}
          </Box>
        ))}
      </Box>

      {/* User footer */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, p: 2, borderTop: "1px solid rgba(168,218,220,0.2)", flexShrink: 0 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: brand.primary, fontSize: "0.9rem" }}>{userName.charAt(0).toUpperCase()}</Avatar>
        <Box sx={{ ...fade, minWidth: 0 }}>
          <Typography noWrap sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff" }}>{userName}</Typography>
          <Typography noWrap sx={{ fontSize: "0.7rem", color: brand.soft }}>{userRole}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
