import { useAxios } from "../../../hooks/useAxios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export function useForgotPassword() {
  const { protectedAxios } = useAxios();

  return useMutation({
    mutationFn: (form_data) => protectedAxios.post("auth/reset/email", form_data),
    onSuccess: (response) => {
      toast.success(response.data.message || "Email sent successfully");
    },
    onError: (axiosError) => {
      toast.error(axiosError.response.data.message || "Server Error");
    },
  });
}

