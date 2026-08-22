import { QueryProvider } from "./QueryProvider";
import { ToastProvider } from "./ToastProvider";
import { Theme } from "@carbon/react";
import { AuthProvider } from "./AuthContext/AuthProvider";

export function Context({ children }) {
  return (
    <QueryProvider>
      <ToastProvider>
        <AuthProvider>
          <Theme theme="white">
            {children}
          </Theme>
        </AuthProvider>
      </ToastProvider>
    </QueryProvider>
  );
}


