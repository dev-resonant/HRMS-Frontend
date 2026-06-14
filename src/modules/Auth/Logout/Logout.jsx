import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../../context/AuthContext/AuthContextExport";

export function Logout() {
  const { setToken } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    setToken("clearToken");
    navigate("/login", { replace: true });
  }, [navigate, setToken]);

  return null;
}
