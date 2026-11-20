import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useApi, useApiMutation, cleanParams } from "./helpers";

const KEY = ["mispunch"];

/** GET /mispunch-requests */
export function useMispunchRequests(params) {
  const api = useApi();
  return useQuery({
    queryKey: [...KEY, params],
    queryFn: async () => (await api.get("mispunch-requests", { params: cleanParams(params) })).data,
    placeholderData: keepPreviousData,
  });
}

/** POST /mispunch-requests */
export function useCreateMispunch() {
  const api = useApi();
  return useApiMutation({
    mutationFn: (body) => api.post("mispunch-requests", body),
    invalidate: [KEY],
    success: "Correction request raised",
  });
}

const decide = (action, success) =>
  function useDecision() {
    const api = useApi();
    return useApiMutation({
      mutationFn: ({ id, remarks }) => api.put(`mispunch-requests/${id}/${action}`, { remarks }),
      invalidate: [KEY, ["attendance"]],
      success,
    });
  };

export const useApproveMispunch = decide("approve", "Request approved");
export const useRejectMispunch = decide("reject", "Request rejected");
