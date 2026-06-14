import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAxios } from "../../../hooks/useAxios";
import { useAuthContext } from "../../../context/AuthContext/AuthContextExport";
import { isDemo, validateDemoCredentials } from "../../../utils/demoAuth";

const demoMode = isDemo();

export function useLogin({ redirectionUrl } = {}) {
  const navigate = useNavigate();
  const { setToken } = useAuthContext();
  const { protectedAxios } = useAxios();

  return useMutation({
    mutationFn: (formdata) => {
      if (demoMode) {
        console.debug("Using demo mode for login", formdata);
        return validateDemoCredentials(formdata, "auth/login");
      }
      return protectedAxios.post("auth/login", formdata);
    },
    onSuccess: (response) => {
      toast.success(response.data.message || "Login Successful");
      setToken(response.data.data.token);
      navigate(redirectionUrl || "/dashboard");
    },
    onError: (axiosError) => {
      toast.error(axiosError?.response?.data?.message || "Server Error");
    },
  });
}

export function useSendOtp() {
  const { protectedAxios } = useAxios();

  return useMutation({
    mutationFn: (formdata) => {
      if (demoMode) {
        return validateDemoCredentials(formdata, "auth/sendOtp");
      }
      return protectedAxios.post("auth/sendOtp", formdata);
    },
    onSuccess: (response) => {
      toast.success(response.data.message || "OTP sent successfully");
    },
    onError: (axiosError) => {
      toast.error(axiosError?.response?.data?.message || "Server Error");
    },
  });
}

export function useVerifyOtp({ redirectionUrl } = {}) {
  const navigate = useNavigate();
  const { setToken } = useAuthContext();
  const { protectedAxios } = useAxios();

  return useMutation({
    mutationFn: (formdata) => {
      if (demoMode) {
        return validateDemoCredentials(formdata, "auth/verifyOtp");
      }
      return protectedAxios.post("auth/verifyOtp", formdata);
    },
    onSuccess: (response) => {
      toast.success(response.data.message || "OTP verified successfully");
      setToken(response.data.data.token);
      navigate(redirectionUrl || "/");
    },
    onError: (axiosError) => {
      toast.error(axiosError?.response?.data?.message || "Server Error");
    },
  });
}
