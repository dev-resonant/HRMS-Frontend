import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export function useResetPassword(token) {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formdata) => {
      return axios
        .create({
          baseURL: import.meta.env.VITE_SERVER_HOST,
          headers: { Authorization: `Bearer ${token}` },
        })
        .post("auth/reset/password", formdata);
    },
    onSuccess: (response) => {
      toast.success(response.data.message || "Password reset successfully");
      navigate("/login");
    },
    onError: (axiosError) => {
      toast.error(axiosError.response.data.message || "Server Error");
    },
  });
}
