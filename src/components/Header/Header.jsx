import { useState } from "react";
import {
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Select,
  FormControl,
  Box,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
} from "@mui/material";
import { userMenuOptions } from "./constant";
import "./header.scss";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../context/AuthContext/AuthContextExport";
import { User, Information, Translate, Asleep, Logout, Wikis } from "@carbon/icons-react";

const CarbonIcons = {
  User,
  Information,
  Translate,
  Asleep,
  Logout,
  Wikis,
};

const IconMapper = ({ name }) => {
  const IconComp = CarbonIcons[name];
  return IconComp ? <IconComp /> : null;
};

export const Header = () => {
  const navigate = useNavigate();
  const { getData } = useAuthContext();
  const user = getData();
  const [anchorEl, setAnchorEl] = useState(null);
  const [language, setLanguage] = useState("en");

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
    console.log("Language changed to:", event.target.value);
  };

  // Handle item click
  const onMenuItemClick = (action) => {
    console.log("Clicked:", action);

    // Example actions
    if (action === "Logout") {
      navigate("/logout");
    }
    if (action === "profile") {
      console.log("Navigate to profile page");
    }

    handleClose();
  };

  return (
    <AppBar position="static" className="custom-header" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "flex-end" }}>
        <Avatar onClick={handleOpen} sx={{ cursor: "pointer", bgcolor: "primary.main" }}>
          {user?.userData?.name?.charAt(0).toUpperCase() || "U"}
        </Avatar>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          aria-label="User menu"
          slotProps={{
            list: {
              autoFocusItem: true,
            },
          }}
        >
          {userMenuOptions.map((item) => {
            if (item.divider) {
              return <Divider key={item.id} />;
            }

            if (item.type === "select") {
              return (
                <MenuItem
                  key={item.id}
                  sx={{
                    "&:hover": { backgroundColor: "transparent" },
                    cursor: "default",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <ListItemIcon sx={{ display: "flex", alignItems: "center", minWidth: 40 }}>
                    <IconMapper name={item.icon} />
                  </ListItemIcon>
                  <FormControl
                    size="small"
                    variant="standard"
                    sx={{ minWidth: 120, display: "flex", alignItems: "start" }}
                  >
                    <Select
                      value={language}
                      onChange={handleLanguageChange}
                      displayEmpty
                      disableUnderline
                      sx={{ fontSize: "0.875rem", "& .MuiSelect-select": { display: "flex", alignItems: "center" } }}
                    >
                      {item.options.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </MenuItem>
              );
            }

            return (
              <MenuItem
                key={item.id}
                onClick={() => !item.component && onMenuItemClick(item.action)}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ListItemIcon sx={{ display: "flex", alignItems: "center", minWidth: 40 }}>
                  <IconMapper name={item.icon} />
                </ListItemIcon>
                {item.component ? (
                  <Box sx={{ display: "flex", alignItems: "center", width: "100%", justifyContent: "space-between" }}>
                    <Typography sx={{ fontSize: "0.875rem" }}>{item.label}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center" }} onClick={(e) => e.stopPropagation()}>
                      {item.component}
                    </Box>
                  </Box>
                ) : (
                  <Typography sx={{ fontSize: "0.875rem" }}>
                    {item.action === "profile"
                      ? (user?.userData?.name ?? "").replace(/^./, (c) => c.toUpperCase())
                      : item.label}
                  </Typography>
                )}
              </MenuItem>
            );
          })}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
