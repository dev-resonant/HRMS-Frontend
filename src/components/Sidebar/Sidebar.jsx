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
  IconButton,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import "./sidebar.scss";
import { ChevronDown, ChevronUp, SkipBackFilled, SkipForwardFilled } from "@carbon/icons-react";
import { sidebarMenu } from "./constant";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const collapsedWidth = 60;
  const expandedWidth = 200;
  const [open, setOpen] = useState(false);
  const [isToggleClick, setIsToggleClick] = useState(false);

  // State to manage which parent item is expanded
  const [expandedItemKey, setExpandedItemKey] = useState(null);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const renderMenuItem = (item) => {
    // Generate a unique key based on item properties
    const itemKey = item.url || item.label.toLowerCase().replaceAll(/\s+/g, "-");

    // Check if item has children (nested menu)
    if (item.children) {
      const isExpanded = expandedItemKey === itemKey;
      const isAnyChildSelected = item.children.some((child) => location.pathname === child.url);

      return (
        <React.Fragment key={itemKey}>
          <ListItem disablePadding>
            <ListItemButton
              selected={isAnyChildSelected}
              onClick={() => setExpandedItemKey(isExpanded ? null : itemKey)}
              sx={{ justifyContent: open ? "initial" : "center", px: 2.5 }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center" }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.label} />}
              {open && (isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
            </ListItemButton>
          </ListItem>

          <Collapse in={isExpanded && open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => {
                const childKey = child.url || `${itemKey}-${child.label.toLowerCase().replaceAll(/\s+/g, "-")}`;
                return (
                  <ListItem key={childKey} disablePadding>
                    <ListItemButton
                      selected={location.pathname === child.url}
                      onClick={() => handleNavigation(child.url)}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center" }}>
                        {child.icon}
                      </ListItemIcon>
                      {open && <ListItemText primary={child.label} />}
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
    return (
      <ListItem key={itemKey} disablePadding>
        <ListItemButton
          selected={location.pathname === item.url || (item.url === "/dashboard" && location.pathname === "/")}
          onClick={() => handleNavigation(item.url)}
          sx={{ justifyContent: open ? "initial" : "center", px: 2.5 }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: open ? 2 : "auto", justifyContent: "center" }}>
            {item.icon}
          </ListItemIcon>
          {open && <ListItemText primary={item.label} />}
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <aside>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? expandedWidth : collapsedWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? expandedWidth : collapsedWidth,
            boxSizing: "border-box",
            transition: "width 0.3s",
          },
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => {
          if (!isToggleClick) {
            setOpen(false);
          }
        }}
        className={`${open && isToggleClick ? "drawer-open" : "drawer-close"} drawer`}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "flex-start" : "center",
              padding: 2,
              minHeight: 64,
              gap: 1,
            }}
          >
            <img src="/images/Digiwagon-favicon.svg" alt="Digiwagon" width="24" />
            {open && <span>Digiwagon</span>}
          </Box>

          <List sx={{ flexGrow: 1 }}>{sidebarMenu.map((item) => renderMenuItem(item))}</List>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              padding: 1,
              borderTop: 1,
              borderColor: "divider",
            }}
          >
            <IconButton onClick={() => setIsToggleClick((prev) => !prev)} size="small">
              {isToggleClick ? <SkipBackFilled size={16} /> : <SkipForwardFilled size={16} />}
            </IconButton>
          </Box>
        </Box>
      </Drawer>
    </aside>
  );
};
