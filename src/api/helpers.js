import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAxios } from "../hooks/useAxios";

/** Best human-readable message from an axios/ProblemDetails error. */
export function errorMessage(error) {
  const data = error?.response?.data;
  if (data?.errors && typeof data.errors === "object") {
    const flat = Object.values(data.errors).flat().join(", ");
    if (flat) return flat;
  }
  return data?.message || data?.detail || data?.title || error?.message || "Server Error";
}

/** Drop empty query params so they are not sent as `?x=`. */
export function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
}

/** GET that also returns the ETag header (needed for If-Match on updates). */
export async function getWithEtag(api, url, config) {
  const res = await api.get(url, config);
  return { data: res.data, etag: res.headers?.etag ?? null };
}

/** The authenticated axios instance (Bearer token, 401 handling). */
export function useApi() {
  return useAxios().protectedAxios;
}

/**
 * Mutation wrapper: toasts errors, optionally toasts success and
 * invalidates the given query keys.
 */
export function useApiMutation({ mutationFn, invalidate = [], success, onDone }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (res, vars) => {
      invalidate.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));
      if (success) toast.success(typeof success === "function" ? success(res, vars) : success);
      onDone?.(res, vars);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}
