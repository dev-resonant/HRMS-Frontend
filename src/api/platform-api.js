import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useApi, useApiMutation, cleanParams, getWithEtag } from "./helpers";

/* ───────── Roles ───────── */
const ROLES = ["roles"];

/** GET /roles */
export function useRoles() {
  const api = useApi();
  return useQuery({ queryKey: ROLES, queryFn: async () => (await api.get("roles")).data, retry: false });
}

/** PUT /platform/roles/{id}/permissions — If-Match required, ETag fetched from GET /roles/{id}. */
export function useUpdateRolePermissions() {
  const api = useApi();
  return useApiMutation({
    mutationFn: async ({ id, permissions }) => {
      const { etag } = await getWithEtag(api, `roles/${id}`);
      return api.put(`platform/roles/${id}/permissions`, { permissions }, { headers: { "If-Match": etag } });
    },
    invalidate: [ROLES, ["me"]],
    success: "Role permissions updated",
  });
}

/* ───────── Platform companies ───────── */
const COMPANIES = ["platform", "companies"];

export function useCompanies(params) {
  const api = useApi();
  return useQuery({
    queryKey: [...COMPANIES, params],
    queryFn: async () => (await api.get("platform/companies", { params: cleanParams(params) })).data,
    placeholderData: keepPreviousData,
    retry: false,
  });
}
export function useCreateCompany() {
  const api = useApi();
  return useApiMutation({
    mutationFn: (b) => api.post("platform/companies", b),
    invalidate: [COMPANIES],
    success: (res) =>
      res.data.initialAdministrator?.invitationDeliveryConfigured
        ? "Company created and invitation sent"
        : "Company created (invitation kept; no delivery channel configured)",
  });
}
/** PUT /platform/companies/{id} — If-Match required. */
export function useUpdateCompany() {
  const api = useApi();
  return useApiMutation({
    mutationFn: async ({ id, body }) => {
      const { etag } = await getWithEtag(api, `platform/companies/${id}`);
      return api.put(`platform/companies/${id}`, body, { headers: { "If-Match": etag } });
    },
    invalidate: [COMPANIES],
    success: "Company updated",
  });
}
/** PUT /platform/companies/{id}/status — If-Match required. */
export function useSetCompanyStatus() {
  const api = useApi();
  return useApiMutation({
    mutationFn: async ({ id, isActive, reason }) => {
      const { etag } = await getWithEtag(api, `platform/companies/${id}`);
      return api.put(`platform/companies/${id}/status`, { isActive, reason }, { headers: { "If-Match": etag } });
    },
    invalidate: [COMPANIES],
    success: "Company status updated",
  });
}
/** PUT /platform/companies/{companyId}/employees/{employeeId}/role — If-Match = the employee's ETag. */
export function useAssignPlatformRole() {
  const api = useApi();
  return useApiMutation({
    mutationFn: async ({ companyId, employeeId, roleId, reason, etag }) =>
      api.put(
        `platform/companies/${companyId}/employees/${employeeId}/role`,
        { roleId, reason },
        { headers: { "If-Match": etag } }
      ),
    invalidate: [COMPANIES],
    success: (res) => `Role changed to ${res.data.roleDisplayName}`,
  });
}
