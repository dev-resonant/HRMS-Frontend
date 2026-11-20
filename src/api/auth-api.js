import { useQuery } from "@tanstack/react-query";
import { useApi, useApiMutation } from "./helpers";
import { useAxios } from "../hooks/useAxios";

/** GET /auth/me — current user, role and permission map. */
export function useMe() {
  const api = useApi();
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => (await api.get("auth/me")).data,
    staleTime: 5 * 60 * 1000,
  });
}

/** `can("leave", "approve_all")` against the permissions returned by /auth/me. */
export function usePermissions() {
  const { data: me, isLoading } = useMe();
  const can = (module, action) => !!me?.permissions?.[module]?.includes(action);
  const canAny = (module, actions) => actions.some((a) => can(module, a));
  return { me, isLoading, can, canAny };
}

/** POST /auth/change-password */
export function useChangePassword() {
  const api = useApi();
  return useApiMutation({
    mutationFn: (body) => api.post("auth/change-password", body),
    success: "Password changed",
    invalidate: [["me"]],
  });
}

/** POST /auth/set-password (anonymous, one-time invitation token). */
export function useSetPassword() {
  const { unprotectedAxios } = useAxios();
  return useApiMutation({
    mutationFn: (body) => unprotectedAxios.post("auth/set-password", body),
    success: "Password set. You can sign in now.",
  });
}

/** POST /auth/logout — ends the server session. Callers ignore failures. */
export function logoutRequest(api) {
  return api.post("auth/logout");
}
