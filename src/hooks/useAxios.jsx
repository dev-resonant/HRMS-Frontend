import axios from "axios";
import { useAuthContext } from "../context/AuthContext/AuthContextExport";
import { toast } from "react-toastify";

export function useAxios() {
  const { getData, setToken } = useAuthContext();
  const { token } = getData();
  const protectedAxios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });

  const unprotectedAxios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  function handleError(axiosError, notify = true) {
    console.error(axiosError);
    notify && toast.error(axiosError.response?.data?.message || "Server Error");
    if ([401, 403].includes(axiosError.response.status)) {
      setToken("clearToken");
    }
    throw axiosError;
  }

  return { protectedAxios, handleError, unprotectedAxios };
}
