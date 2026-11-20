import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useApi, useApiMutation, cleanParams, getWithEtag } from "./helpers";

const KEY = ["employees"];

/** GET /employees — paged, searchable, filterable. */
export function useEmployees(params) {
  const api = useApi();
  return useQuery({
    queryKey: [...KEY, "list", params],
    queryFn: async () => (await api.get("employees", { params: cleanParams(params) })).data,
    placeholderData: keepPreviousData,
  });
}

/** GET /employees/{id} (with ETag). */
export function useEmployee(id) {
  const api = useApi();
  return useQuery({
    queryKey: [...KEY, "one", id],
    queryFn: () => getWithEtag(api, `employees/${id}`),
    enabled: !!id,
  });
}

/** POST /employees */
export function useCreateEmployee() {
  const api = useApi();
  return useApiMutation({
    mutationFn: (body) => api.post("employees", body),
    invalidate: [KEY],
    success: "Employee created. A password-setup invitation was issued.",
  });
}

/** PUT /employees/{id} — If-Match is sent when an ETag is known. */
export function useUpdateEmployee() {
  const api = useApi();
  return useApiMutation({
    mutationFn: ({ id, etag, body }) =>
      api.put(`employees/${id}`, body, etag ? { headers: { "If-Match": etag } } : undefined),
    invalidate: [KEY],
    success: "Employee updated",
  });
}

/** PUT /employees/{id}/deactivate */
export function useDeactivateEmployee() {
  const api = useApi();
  return useApiMutation({
    mutationFn: ({ id, lastWorkingDate }) => api.put(`employees/${id}/deactivate`, { lastWorkingDate }),
    invalidate: [KEY],
    success: (res) =>
      `Employee deactivated (${res.data.sessionsRevoked} session(s) revoked)` +
      (res.data.directReportsNeedingReassignment
        ? `. ${res.data.directReportsNeedingReassignment} direct report(s) need a new manager.`
        : ""),
  });
}

/** PUT /employees/{id}/profile — self-service contact details. */
export function useUpdateOwnProfile() {
  const api = useApi();
  return useApiMutation({
    mutationFn: ({ id, body }) => api.put(`employees/${id}/profile`, body),
    invalidate: [KEY],
    success: "Profile updated",
  });
}

/** PUT /employees/{id}/role — If-Match is mandatory, so the current ETag is fetched first. */
export function useAssignRole() {
  const api = useApi();
  return useApiMutation({
    mutationFn: async ({ id, roleId, reason }) => {
      const { etag } = await getWithEtag(api, `employees/${id}`);
      return api.put(`employees/${id}/role`, { roleId, reason }, { headers: { "If-Match": etag } });
    },
    invalidate: [KEY],
    success: (res) => `Role changed to ${res.data.roleDisplayName}`,
  });
}

/** POST /employees/{id}/invitation */
export function useInviteEmployee() {
  const api = useApi();
  return useApiMutation({
    mutationFn: (id) => api.post(`employees/${id}/invitation`),
    success: (res) =>
      res.data.deliveryConfigured
        ? "Invitation sent"
        : "Invitation issued (no delivery channel configured yet)",
  });
}

/** PUT /employees/{employeeId}/office-location */
export function useAssignOfficeLocation() {
  const api = useApi();
  return useApiMutation({
    mutationFn: ({ employeeId, officeLocationId }) =>
      api.put(`employees/${employeeId}/office-location`, { officeLocationId: officeLocationId || null }),
    invalidate: [KEY],
    success: "Office location updated",
  });
}
