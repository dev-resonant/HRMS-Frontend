import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAxios } from "../../../hooks/useAxios";
import { useAuthContext } from "../../../context/AuthContext/AuthContextExport";

export function useSignup({ redirectionUrl } = {}) {
  const navigate = useNavigate();
  const { setToken } = useAuthContext();
  const { unprotectedAxios } = useAxios();

  return useMutation({
    mutationFn: (formdata) => {
      return unprotectedAxios.post("auth/signup", formdata);
    },
    onSuccess: (response) => {
      toast.success(response.data.message || "Signup Successful");
      setToken(response.data.token, response.data.user);
      navigate(redirectionUrl || "/");
    },
    onError: (axiosError) => {
      toast.error(axiosError?.response?.data?.message || "Server Error");
    },
  });
}