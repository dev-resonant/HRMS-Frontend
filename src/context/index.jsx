import { QueryProvider } from "./QueryProvider";
import { ToastProvider } from "./ToastProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./AuthContext/AuthProvider";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#251B72",
    },
    secondary: {
      main: "#9c27b0",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          padding: "10px 22px",
          fontWeight: 600,
        },
        containedPrimary: {
          backgroundColor: "#251B72",
          color: "#fff",
          '&:hover': {
            backgroundColor: "#3626AB",
          },
        },
        outlinedPrimary: {
          borderWidth: "1.5px",
          padding:"0.5rem"
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: "#9CA3AF",
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: "#9CA3AF",
          },
        },
        notchedOutline: {
          borderColor: "#9CA3AF",
        },
      },
    },
  },
});

export function Context({ children }) {
  return (
    <QueryProvider>
      <ToastProvider>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AuthProvider>
      </ToastProvider>
    </QueryProvider>
  );
}

