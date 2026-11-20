import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import SettingsOutlined from "@mui/icons-material/SettingsOutlined";
import LogoutOutlined from "@mui/icons-material/LogoutOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";
import { useAuthContext } from "../../context/AuthContext/AuthContextExport";

export const Header = ({ onToggleSidebar }) => {
  const brand = useTheme().palette.brand;
  const navigate = useNavigate();
  const { getData } = useAuthContext();
  const user = getData();

  const [searchValue, setSearchValue] = useState("");
  const [userAnchor, setUserAnchor] = useState(null);

  const data = user?.userData;
  const userName = data?.name || data?.user_name || "User";
  const userRole = data?.roleDisplayName || data?.role || "Employee";
  const userEmail = data?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

  const go = (path) => {
    setUserAnchor(null);
    navigate(path);
  };

  return (
    <Box
      component="header"
      aria-label="ProHRM header"
      sx={{
        height: 64,
        px: { xs: 1.5, md: 3 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        bgcolor: "#fff",
        borderBottom: "1px solid",
        borderColor: "divider",
        boxShadow: "0 1px 12px rgba(0,0,0,0.03)",
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, minWidth: 0 }}>
        <IconButton aria-label="Toggle sidebar" onClick={onToggleSidebar}>
          <MenuIcon />
        </IconButton>
        <TextField
          size="small"
          placeholder="Search anything (employees, leave, shifts)…"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{ maxWidth: 440, display: { xs: "none", sm: "block" }, "& .MuiOutlinedInput-root": { bgcolor: brand.bg } }}
          slotProps={{
            htmlInput: { "aria-label": "Search" },
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <IconButton aria-label="Settings" onClick={() => navigate("/settings")}>
          <SettingsOutlined />
        </IconButton>
        <Button color="inherit" onClick={(e) => setUserAnchor(e.currentTarget)} aria-label="User profile" sx={{ minWidth: 0, px: 0.75, borderRadius: 6 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: brand.primary, fontSize: "0.85rem" }}>{userInitial}</Avatar>
          <ExpandMore fontSize="small" />
        </Button>
      </Box>

      {/* User menu */}
      <Popover
        open={!!userAnchor}
        anchorEl={userAnchor}
        onClose={() => setUserAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 300, maxWidth: "calc(100vw - 32px)", mt: 1 } } }}
      >
        <Box sx={{ p: 2, display: "flex", gap: 1.5, alignItems: "center" }}>
          <Avatar sx={{ width: 48, height: 48, bgcolor: brand.primary }}>{userInitial}</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontWeight: 700 }}>{userName}</Typography>
            <Typography noWrap sx={{ color: "text.secondary", fontSize: "0.8125rem" }}>{userEmail}</Typography>
            <Chip size="small" color="primary" label={userRole} sx={{ mt: 0.5 }} />
          </Box>
        </Box>
        <Divider />
        <Box sx={{ p: 1, display: "grid" }}>
          <Button color="inherit" startIcon={<LockOutlined fontSize="small" />} sx={{ justifyContent: "flex-start" }} onClick={() => go("/change-password")}>
            Change password
          </Button>
          <Button color="inherit" startIcon={<SettingsOutlined fontSize="small" />} sx={{ justifyContent: "flex-start" }} onClick={() => go("/settings")}>
            Workspace settings
          </Button>
        </Box>
        <Divider />
        <Box sx={{ p: 1 }}>
          <Button fullWidth color="error" startIcon={<LogoutOutlined fontSize="small" />} onClick={() => go("/logout")}>
            Sign out
          </Button>
        </Box>
      </Popover>
    </Box>
  );
};
