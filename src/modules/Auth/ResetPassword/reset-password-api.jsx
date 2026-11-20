import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../../config/env";

export function useResetPassword(token) {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (formdata) => {
      return axios
        .create({
          baseURL: API_BASE_URL,
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
