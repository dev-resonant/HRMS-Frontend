import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useAxios } from "../../../hooks/useAxios";
import { useAuthContext } from "../../../context/AuthContext/AuthContextExport";
import { isDemo, validateDemoCredentials } from "../../../utils/demoAuth";

const demoMode = isDemo();

export function useSignup({ redirectionUrl } = {}) {
  const navigate = useNavigate();
  const { setToken } = useAuthContext();
  const { protectedAxios } = useAxios();

  return useMutation({
    mutationFn: (formdata) => {
      if (demoMode) {
        console.debug("Using demo mode for signup", formdata);
        return validateDemoCredentials(formdata, "auth/signup");
      }
      return protectedAxios.post("auth/signup", formdata);
    },
    onSuccess: (response) => {
      toast.success(response.data.message || "Signup Successful");
      setToken(response.data.data.token);
      navigate(redirectionUrl || "/");
    },
    onError: (axiosError) => {
      toast.error(axiosError?.response?.data?.message || "Server Error");
    },
  });
}

export function useSendSignupOtp() {
  const { protectedAxios } = useAxios();

  return useMutation({
    mutationFn: (formdata) => {
      if (demoMode) {
        return validateDemoCredentials(formdata, "auth/signup/sendOtp");
      }
      return protectedAxios.post("auth/signup/sendOtp", formdata);
    },
    onSuccess: (response) => {
      toast.success(response.data.message || "OTP sent successfully");
    },
    onError: (axiosError) => {
      toast.error(axiosError?.response?.data?.message || "Server Error");
    },
  });
}

export function useVerifySignupOtp({ redirectionUrl } = {}) {
  const navigate = useNavigate();
  const { setToken } = useAuthContext();
  const { protectedAxios } = useAxios();

  return useMutation({
    mutationFn: (formdata) => {
      if (demoMode) {
        return validateDemoCredentials(formdata, "auth/signup/verifyOtp");
      }
      return protectedAxios.post("auth/signup/verifyOtp", formdata);
    },
    onSuccess: (response) => {
      toast.success(response.data.message || "Signup successful");
      setToken(response.data.data.token);
      navigate(redirectionUrl || "/");
    },
    onError: (axiosError) => {
      toast.error(axiosError?.response?.data?.message || "Server Error");
    },
  });
}
