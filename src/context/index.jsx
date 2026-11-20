import { QueryProvider } from "./QueryProvider";
import { ToastProvider } from "./ToastProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AppearanceProvider } from "../theme/AppearanceProvider";
import { AuthProvider } from "./AuthContext/AuthProvider";

export function Context({ children }) {
  return (
    <QueryProvider>
      <AppearanceProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </LocalizationProvider>
      </AppearanceProvider>
    </QueryProvider>
  );
}
