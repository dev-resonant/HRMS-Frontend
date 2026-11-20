import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useApi, useApiMutation, cleanParams } from "./helpers";

const KEY = ["attendance"];

/** GET /attendance/today */
export function useTodayAttendance(enabled = true) {
  const api = useApi();
  return useQuery({
    queryKey: [...KEY, "today"],
    queryFn: async () => (await api.get("attendance/today")).data,
    enabled,
    retry: false,
  });
}

/** POST /attendance/punch */
export function usePunch() {
  const api = useApi();
  return useApiMutation({
    mutationFn: (body) => api.post("attendance/punch", { source: "web", ...body }),
    invalidate: [KEY],
    success: (res) => `Punched ${res.data.punchType}`,
  });
}

/** GET /attendance/history — caller's own daily summaries. */
export function useAttendanceHistory(params, enabled = true) {
  const api = useApi();
  return useQuery({
    queryKey: [...KEY, "history", params],
    queryFn: async () => (await api.get("attendance/history", { params: cleanParams(params) })).data,
    enabled,
    retry: false,
  });
}

/** GET /attendance — one employee, paged. */
export function useEmployeeAttendance(params, enabled = true) {
  const api = useApi();
  return useQuery({
    queryKey: [...KEY, "employee", params],
    queryFn: async () => (await api.get("attendance", { params: cleanParams(params) })).data,
    enabled,
    placeholderData: keepPreviousData,
  });
}

/** GET /attendance/team */
export function useTeamAttendance(params, enabled = true) {
  const api = useApi();
  return useQuery({
    queryKey: [...KEY, "team", params],
    queryFn: async () => (await api.get("attendance/team", { params: cleanParams(params) })).data,
    enabled,
    placeholderData: keepPreviousData,
  });
}

/** POST /attendance/manual-punch (HR correction) */
export function useManualPunch() {
  const api = useApi();
  return useApiMutation({
    mutationFn: (body) => api.post("attendance/manual-punch", body),
    invalidate: [KEY],
    success: "Manual punch recorded",
  });
}
