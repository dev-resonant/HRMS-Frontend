import { QueryProvider } from "./QueryProvider";
import { ToastProvider } from "./ToastProvider";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./AuthContext/AuthProvider";

const theme = createTheme({
  palette: {
    mode: "light",
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

