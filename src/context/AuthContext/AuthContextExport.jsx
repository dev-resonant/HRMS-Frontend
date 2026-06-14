import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("Use this Context inside Auth Context Only");
  return context;
}
