import { useQuery } from "@tanstack/react-query";
import { useApi, useApiMutation } from "./helpers";

const KEY = ["departments"];

/** GET /departments — flat list; build the tree from parentDepartmentId. */
export function useDepartments() {
  const api = useApi();
  return useQuery({ queryKey: KEY, queryFn: async () => (await api.get("departments")).data });
}

/** POST /departments */
export function useCreateDepartment() {
  const api = useApi();
  return useApiMutation({
    mutationFn: (body) => api.post("departments", body),
    invalidate: [KEY],
    success: "Department created",
  });
}

/** PUT /departments/{id} */
export function useUpdateDepartment() {
  const api = useApi();
  return useApiMutation({
    mutationFn: ({ id, body }) => api.put(`departments/${id}`, body),
    invalidate: [KEY],
    success: "Department updated",
  });
}

/** DELETE /departments/{id} */
export function useDeleteDepartment() {
  const api = useApi();
  return useApiMutation({
    mutationFn: (id) => api.delete(`departments/${id}`),
    invalidate: [KEY],
    success: "Department deleted",
  });
}

/** POST /departments/{id}/reassign-employees */
export function useReassignEmployees() {
  const api = useApi();
  return useApiMutation({
    mutationFn: ({ id, toDepartmentId, employeeIds }) =>
      api.post(`departments/${id}/reassign-employees`, { toDepartmentId, employeeIds }),
    invalidate: [KEY, ["employees"]],
    success: (res) => `${res.data.reassignedCount} employee(s) moved`,
  });
}
