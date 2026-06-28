import { QueryProvider } from "./QueryProvider";
import { ToastProvider } from "./ToastProvider";
import { ThemeProvider, createTheme } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./AuthContext/AuthProvider";

const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    primary: {
      main: "#4F46E5",
      light: "#818CF8",
      dark: "#3730A3",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#0EA5E9",
      light: "#38BDF8",
      dark: "#0369A1",
    },
    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },
    divider: "#E2E8F0",
  },
  typography: {
    fontFamily: '"Outfit", "Plus Jakarta Sans", "Inter", "Roboto", sans-serif',
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        body {
          background-color: #F8FAFC;
        }
      `,
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 20px",
          transition: "all 0.2s ease-in-out",
        },
        containedPrimary: {
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          '&:hover': {
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        },
        outlined: {
          borderColor: "#CBD5E1",
          color: "#334155",
          backgroundColor: "#FFFFFF",
          '&:hover': {
            backgroundColor: "#F1F5F9",
            borderColor: "#94A3B8",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation0: {
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          border: "1px solid #E2E8F0",
          borderRadius: "12px",
        },
        elevation1: {
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          borderRadius: "12px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          backgroundColor: "#FFFFFF",
          transition: "all 0.2s ease-in-out",
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: "#94A3B8",
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: "#4F46E5",
            borderWidth: "2px",
          },
        },
        notchedOutline: {
          borderColor: "#E2E8F0",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #E2E8F0",
          padding: "20px 24px",
        },
        head: {
          fontWeight: 600,
          color: "#475569",
          backgroundColor: "#F8FAFC",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: "12px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
          border: "1px solid #E2E8F0",
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

