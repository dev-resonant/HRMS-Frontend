import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import "./sidebar.scss";
import { ChevronDown, ChevronUp, User as UserIcon, Building2 as LogoIcon } from "lucide-react";
import { sidebarMenu } from "./constant";

export const Sidebar = ({ isCollapsed, onMouseEnter, onMouseLeave }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarWidth = isCollapsed ? 80 : 280;

  const [expandedItemKey, setExpandedItemKey] = useState(null);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const renderMenuItem = (item) => {
    const itemKey = item.url || item.label.toLowerCase().replaceAll(/\s+/g, "-");

    // Menu item with children (parent item)
    if (item.children) {
      const isExpanded = expandedItemKey === itemKey;
      const isAnyChildSelected = item.children.some((child) => location.pathname === child.url);

      return (
        <React.Fragment key={itemKey}>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              selected={isAnyChildSelected}
              onClick={() => setExpandedItemKey(isExpanded ? null : itemKey)}
              sx={{
                minHeight: 50,
                justifyContent: "initial",
                px: 1.25,
                py: 0.5,
                color: "#fff",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
                "&.Mui-selected": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  sx: { fontSize: "0.95rem", fontWeight: 500 },
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: "auto",
                }}
              >
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Box>
            </ListItemButton>
          </ListItem>

          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
              {item.children.map((child) => {
                const childKey =
                  child.url || `${itemKey}-${child.label.toLowerCase().replaceAll(/\s+/g, "-")}`;
                const isChildSelected = location.pathname === child.url;

                return (
                  <ListItem key={childKey} disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      selected={isChildSelected}
                      onClick={() => handleNavigation(child.url)}
                      sx={{
                        minHeight: 40,
                        pl: 2.5,
                        justifyContent: "initial",
                        fontSize: "0.9rem",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                        "&.Mui-selected": {
                          backgroundColor: "rgba(255, 255, 255, 0.25)",
                          color: "#fff",
                          fontWeight: 600,
                          "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.25)",
                          },
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 2,
                          justifyContent: "center",
                          color: "inherit",
                        }}
                      >
                        {child.icon && <Box sx={{ display: "flex" }}>{child.icon}</Box>}
                      </ListItemIcon>
                      <ListItemText
                        primary={child.label}
                        primaryTypographyProps={{
                          sx: { fontSize: "0.9rem" },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Collapse>
        </React.Fragment>
      );
    }

    // Regular menu item without children
    const isSelected = location.pathname === item.url || (item.url === "/dashboard" && location.pathname === "/");

    return (
      <ListItem key={itemKey} disablePadding sx={{ display: "block" }}>
        <ListItemButton
          selected={isSelected}
          onClick={() => handleNavigation(item.url)}
          sx={{
            minHeight: 50,
            justifyContent: isCollapsed ? "center" : "initial",
            px: isCollapsed ? 1.5 : 1.25,
            py: 0.5,
            color: "#fff",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
            "&.Mui-selected": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            },
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: isCollapsed ? 0 : 2,
              justifyContent: "center",
              color: "inherit",
              transition: "margin-right 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.label}
            primaryTypographyProps={{
              sx: { 
                fontSize: "0.95rem", 
                fontWeight: 500,
              },
            }}
          />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <aside onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Drawer
        variant="permanent"
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "& .MuiDrawer-paper": {
            width: sidebarWidth,
            boxSizing: "border-box",
            backgroundColor: "#3F4B8D",
            display: "flex",
            flexDirection: "column",
            borderRight: "none",
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            overflowX: "hidden",
          },
        }}
        className="drawer"
      >
        {/* Header with Logo and Title */}
        <Box
          sx={{
            display: "flex",
            alignItems: isCollapsed ? "center" : "flex-start",
            flexDirection: "column",
            justifyContent: "center",
            px: 1.25,
            py: 1.25,
            minHeight: 64,
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            gap: 0.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: isCollapsed ? "center" : "flex-start", gap: isCollapsed ? 0 : 1, width: "100%", overflow: "hidden" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "#fff",
                flexShrink: 0,
              }}
            >
              <LogoIcon size={18} />
            </Box>
            <Typography 
              className="sidebar-fade"
              sx={{ 
                fontWeight: 700, 
                fontSize: "1.05rem", 
                color: "#fff",
              }}
            >
              ProHRM
            </Typography>
          </Box>
          <Typography 
            className="sidebar-fade"
            sx={{ 
              fontSize: "0.75rem", 
              color: "rgba(255, 255, 255, 0.8)", 
              fontWeight: 500,
              mt: 0.5,
            }}
          >
            ENTERPRISE SUITE
          </Typography>
        </Box>

        {/* Menu Items */}
        <List
          sx={{
            flexGrow: 1,
            py: 1,
            px: 0,
            overflow: "auto",
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "3px",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.3)",
              },
            },
          }}
        >
          {sidebarMenu.map((item) => renderMenuItem(item))}
        </List>

        {/* User Profile Footer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            gap: isCollapsed ? 0 : 2,
            py: 1,
            px: 1.25,
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            },
          }}
        >
          <Avatar
            sx={{
              width: 40,
              height: 40,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              color: "#fff",
              flexShrink: 0,
            }}
          >
            <UserIcon size={20} />
          </Avatar>
          <Box
            className="sidebar-fade"
          >
            <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: "#fff" }}>
              Admin User
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.7)" }}>
              Administrator
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </aside>
  );
};
