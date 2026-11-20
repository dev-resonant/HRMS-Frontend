import axios from "axios";
import { useAuthContext } from "../context/AuthContext/AuthContextExport";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/env";

export function useAxios() {
  const { getData, setToken } = useAuthContext();
  const { token } = getData();
  const protectedAxios = axios.create({
    baseURL: API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  // Expired/invalid session: sign out. (403 is a permission error, not a session error.)
  protectedAxios.interceptors.response.use(
    (response) => response,
    (axiosError) => {
      if (axiosError?.response?.status === 401) setToken("clearToken");
      return Promise.reject(axiosError);
    }
  );

  const unprotectedAxios = axios.create({
    baseURL: API_BASE_URL,
  });

  function handleError(axiosError, notify = true) {
    console.error(axiosError);
    notify && toast.error(axiosError?.response?.data?.message || axiosError?.message || "Server Error");
    if ([401, 403].includes(axiosError?.response?.status)) {
      setToken("clearToken");
    }
    throw axiosError;
  }

  return { protectedAxios, handleError, unprotectedAxios };
}
