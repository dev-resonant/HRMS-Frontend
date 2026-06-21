import { useState } from "react";
import {
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  InputBase,
  Badge,
  Tooltip,
} from "@mui/material";

import "./header.scss";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../context/AuthContext/AuthContextExport";
import { 
  User, 
  Info as Information, 
  Moon as Asleep, 
  LogOut as Logout, 
  BookOpen as Wikis,
  Search as SearchIcon,
  Bell as BellIcon,
  Settings as SettingsIcon,
  Building2 as LogoIcon,
} from "lucide-react";

const CarbonIcons = {
  User,
  Information,
  Asleep,
  Logout,
  Wikis,
  SearchIcon,
  BellIcon,
  SettingsIcon,
};

const IconMapper = ({ name, size = 18 }) => {
  const IconComp = CarbonIcons[name];
  return IconComp ? <IconComp size={size} /> : null;
};

export const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { getData } = useAuthContext();
  const user = getData();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [notificationAnchor, setNotificationAnchor] = useState(null);

  const open = Boolean(anchorEl);
  const notificationOpen = Boolean(notificationAnchor);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationOpen = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  // Handle item click
  const onMenuItemClick = (action) => {
    console.log("Clicked:", action);

    if (action === "Logout") {
      navigate("/logout");
    }
    if (action === "profile") {
      navigate("/profile");
    }

    handleClose();
  };

  const userName = user?.userData?.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <AppBar 
      position="static" 
      className="custom-header"
      sx={{
        backgroundColor: "#fff",
        color: "#333",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: 64,
          px: 3,
          gap: 3,
        }}
      >
        {/* Left Section - Logo and Search */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, minWidth: 0 }}>
          {/* Logo */}
          <Tooltip title="Toggle Sidebar">
            <Box
              onClick={onToggleSidebar}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: "50%",
                backgroundColor: "#3F4B8D",
                color: "#fff",
                flexShrink: 0,
                cursor: "pointer",
                transition: "transform 0.2s ease, background-color 0.2s ease",
                "&:hover": {
                  backgroundColor: "#2e3a75",
                  transform: "scale(1.05)",
                },
                "&:active": {
                  transform: "scale(0.95)",
                },
              }}
            >
              <LogoIcon size={22} />
            </Box>
          </Tooltip>

          {/* Search */}
          <Box
            className="header-search"
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#f5f5f5",
              borderRadius: "6px",
              px: 2,
              py: 1,
              width: "250px",
              gap: 1,
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#efefef",
              },
              "&:focus-within": {
                boxShadow: "0 2px 8px rgba(63, 75, 141, 0.2)",
              },
            }}
          >
            <SearchIcon size={16} color="#999" />
            <InputBase
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              sx={{
                flex: 1,
                fontSize: "0.85rem",
                "& input::placeholder": {
                  color: "#999",
                  opacity: 1,
                },
              }}
            />
          </Box>
        </Box>

        {/* Right Section - Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              onClick={handleNotificationOpen}
              sx={{
                color: "#666",
                size: "small",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                },
              }}
            >
              <Badge badgeContent={3} color="error">
                <BellIcon size={20} />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notificationAnchor}
            open={notificationOpen}
            onClose={handleNotificationClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                width: 300,
                maxHeight: 400,
                mt: 1,
              },
            }}
          >
            <MenuItem disabled sx={{ pb: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Notifications
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  New Leave Request
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  5 minutes ago
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  System Update
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  2 hours ago
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  New Employee Added
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  1 day ago
                </Typography>
              </Box>
            </MenuItem>
          </Menu>

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton
              sx={{
                color: "#666",
                size: "small",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.05)",
                },
              }}
            >
              <SettingsIcon size={20} />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ my: 1.5, mx: 0.5 }} />

          {/* User Avatar and Menu */}
          <Tooltip title="User Menu">
            <IconButton
              onClick={handleOpen}
              sx={{
                p: 0.5,
                "&:hover": {
                  opacity: 0.8,
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#3F4B8D",
                  color: "#fff",
                  width: 40,
                  height: 40,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {userInitial}
              </Avatar>
            </IconButton>
          </Tooltip>

          {/* User Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                width: 240,
                mt: 1,
              },
            }}
          >
            <MenuItem disabled sx={{ pb: 1 }}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {userName}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {user?.userData?.role || "Administrator"}
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => onMenuItemClick("Logout")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                fontSize: "0.9rem",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Logout size={18} />
              </ListItemIcon>
              <Typography sx={{ fontSize: "0.9rem" }}>
                Logout
              </Typography>
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
