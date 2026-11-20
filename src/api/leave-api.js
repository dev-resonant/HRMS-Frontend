import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useApi, useApiMutation, cleanParams } from "./helpers";

const TYPES = ["leave", "types"];
const BAL = ["leave", "balance"];
const APPS = ["leave", "applications"];

/** GET /leave/types */
export function useLeaveTypes(includeInactive = false) {
  const api = useApi();
  return useQuery({
    queryKey: [...TYPES, includeInactive],
    queryFn: async () => (await api.get("leave/types", { params: { includeInactive } })).data,
  });
}

export function useCreateLeaveType() {
  const api = useApi();
  return useApiMutation({
    mutationFn: (body) => api.post("leave/types", body),
    invalidate: [TYPES],
    success: "Leave type created",
  });
}

export function useUpdateLeaveType() {
  const api = useApi();
  return useApiMutation({
    mutationFn: ({ id, body }) => api.put(`leave/types/${id}`, body),
    invalidate: [TYPES],
    success: "Leave type updated",
  });
}

export function useSetLeaveTypeStatus() {
  const api = useApi();
  return useApiMutation({
    mutationFn: ({ id, isActive }) => api.put(`leave/types/${id}/status`, { isActive }),
    invalidate: [TYPES],
    success: "Leave type status updated",
  });
}

/** GET /leave/balance (own) or /leave/balance/{employeeId} */
export function useLeaveBalance({ employeeId, year } = {}, enabled = true) {
  const api = useApi();
  return useQuery({
    queryKey: [...BAL, employeeId ?? "me", year],
    queryFn: async () =>
      (
        await api.get(employeeId ? `leave/balance/${employeeId}` : "leave/balance", {
          params: cleanParams({ year }),
        })
      ).data,
    enabled,
    retry: false,
  });
}

/** POST /leave/balance/{employeeId}/adjust */
export function useAdjustBalance() {
  const api = useApi();
  return useApiMutation({
    mutationFn: ({ employeeId, ...body }) => api.post(`leave/balance/${employeeId}/adjust`, body),
    invalidate: [BAL],
    success: "Balance adjusted",
  });
}

/** GET /leave/applications */
export function useLeaveApplications(params, enabled = true) {
  const api = useApi();
  return useQuery({
    queryKey: [...APPS, params],
    queryFn: async () => (await api.get("leave/applications", { params: cleanParams(params) })).data,
    enabled,
    placeholderData: keepPreviousData,
  });
}

/** POST /leave/applications */
export function useApplyLeave() {
  const api = useApi();
  return useApiMutation({
    mutationFn: (body) => api.post("leave/applications", body),
    invalidate: [APPS, BAL],
    success: "Leave application submitted",
  });
}

const decide = (action, success) =>
  function useDecision() {
    const api = useApi();
    return useApiMutation({
      mutationFn: ({ id, remarks }) =>
        api.put(`leave/applications/${id}/${action}`, action === "cancel" ? undefined : { remarks }),
      invalidate: [APPS, BAL],
      success,
    });
  };

export const useApproveLeave = decide("approve", "Leave approved");
export const useRejectLeave = decide("reject", "Leave rejected");
export const useCancelLeave = decide("cancel", "Leave cancelled");
