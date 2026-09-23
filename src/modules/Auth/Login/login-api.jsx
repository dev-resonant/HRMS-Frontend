import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAxios } from "../../../hooks/useAxios";
import { useAuthContext } from "../../../context/AuthContext/AuthContextExport";

export function useLogin({ redirectionUrl } = {}) {
  const navigate = useNavigate();
  const { setToken } = useAuthContext();
  const { unprotectedAxios } = useAxios();

  return useMutation({
    mutationFn: ({ formdata }) => {
      return unprotectedAxios.post("auth/login", formdata);
    },
    onSuccess: (response, variables) => {
      toast.success(response.data.message || "Login Successful");
      setToken(response.data.token, response.data.user, variables?.remember);
      navigate(redirectionUrl || "/dashboard");
    },
    onError: (axiosError) => {
      console.error("Login error:", axiosError);
      toast.error(axiosError?.response?.data?.message || axiosError?.message || "Server Error");
    },
  });
}