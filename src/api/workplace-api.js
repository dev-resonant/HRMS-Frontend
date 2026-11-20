import { useQuery } from "@tanstack/react-query";
import { useApi, useApiMutation, cleanParams } from "./helpers";

/* ───────── Shifts ───────── */
const SHIFTS = ["shifts"];

export function useShifts(includeInactive = true) {
  const api = useApi();
  return useQuery({
    queryKey: [...SHIFTS, includeInactive],
    queryFn: async () => (await api.get("shifts", { params: { includeInactive } })).data,
  });
}
export function useCreateShift() {
  const api = useApi();
  return useApiMutation({ mutationFn: (b) => api.post("shifts", b), invalidate: [SHIFTS], success: "Shift created" });
}
export function useUpdateShift() {
  const api = useApi();
  return useApiMutation({
    mutationFn: ({ id, body }) => api.put(`shifts/${id}`, body),
    invalidate: [SHIFTS],
    success: "Shift updated",
  });
}
export function useSetShiftStatus() {
  const api = useApi();
  return useApiMutation({
    mutationFn: ({ id, isActive }) => api.put(`shifts/${id}/status`, { isActive }),
    invalidate: [SHIFTS],
    success: "Shift status updated",
  });
}
export function useAssignShift() {
  const api = useApi();
  return useApiMutation({
    mutationFn: ({ id, employeeIds, effectiveFrom }) =>
      api.post(`shifts/${id}/assign`, { employeeIds, effectiveFrom: effectiveFrom || null }),
    success: (res) => `Shift assigned to ${res.data.employeeIds.length} employee(s)`,
  });
}

/* ───────── Office locations ───────── */
const LOCS = ["office-locations"];

export function useOfficeLocations(includeInactive = true) {
  const api = useApi();
  return useQuery({
    queryKey: [...LOCS, includeInactive],
    queryFn: async () => (await api.get("office-locations", { params: { includeInactive } })).data,
  });
}
export function useCreateOfficeLocation() {
  const api = useApi();
  return useApiMutation({
    mutationFn: (b) => api.post("office-locations", b),
    invalidate: [LOCS],
    success: "Office location created",
  });
}
export function useUpdateOfficeLocation() {
  const api = useApi();
  return useApiMutation({
    mutationFn: ({ id, body }) => api.put(`office-locations/${id}`, body),
    invalidate: [LOCS],
    success: "Office location updated",
  });
}
export function useSetOfficeLocationStatus() {
  const api = useApi();
  return useApiMutation({
    mutationFn: ({ id, isActive }) => api.put(`office-locations/${id}/status`, { isActive }),
    invalidate: [LOCS],
    success: "Office location status updated",
  });
}

/* ───────── Holidays ───────── */
const HOL = ["holidays"];

export function useHolidays(year) {
  const api = useApi();
  return useQuery({
    queryKey: [...HOL, year],
    queryFn: async () => (await api.get("holiday-calendar", { params: cleanParams({ year }) })).data,
  });
}
export function useCreateHoliday() {
  const api = useApi();
  return useApiMutation({ mutationFn: (b) => api.post("holiday-calendar", b), invalidate: [HOL], success: "Holiday added" });
}
export function useBulkHolidays() {
  const api = useApi();
  return useApiMutation({
    mutationFn: (holidays) => api.post("holiday-calendar/bulk", { holidays }),
    invalidate: [HOL],
    success: (res) => `${res.data.length} holiday(s) uploaded`,
  });
}
export function useUpdateHoliday() {
  const api = useApi();
  return useApiMutation({
    mutationFn: ({ id, body }) => api.put(`holiday-calendar/${id}`, body),
    invalidate: [HOL],
    success: "Holiday updated",
  });
}
export function useDeleteHoliday() {
  const api = useApi();
  return useApiMutation({
    mutationFn: (id) => api.delete(`holiday-calendar/${id}`),
    invalidate: [HOL],
    success: "Holiday deleted",
  });
}

/* ───────── Company settings ───────── */
const SETTINGS = ["company-settings"];

export function useCompanySettings() {
  const api = useApi();
  return useQuery({ queryKey: SETTINGS, queryFn: async () => (await api.get("company-settings")).data });
}
export function useUpdateCompanySettings() {
  const api = useApi();
  return useApiMutation({
    mutationFn: (body) => api.put("company-settings", body),
    invalidate: [SETTINGS],
    success: "Settings saved",
  });
}
