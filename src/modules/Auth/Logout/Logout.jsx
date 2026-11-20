import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../../context/AuthContext/AuthContextExport";
import { useApi } from "../../../api/helpers";
import { logoutRequest } from "../../../api/auth-api";
import { LoadingScreen } from "../../../components/motion/LoadingScreen";

export function Logout() {
  const { setToken, getData } = useAuthContext();
  const navigate = useNavigate();
  const api = useApi();
  const queryClient = useQueryClient();

  useEffect(() => {
    // End the server session first (best effort), then always clear the local one.
    const hasSession = !!getData().token;
    const done = () => {
      queryClient.clear();
      setToken("clearToken");
      navigate("/login", { replace: true });
    };
    if (hasSession) logoutRequest(api).catch(() => {}).finally(done);
    else done();
    // Run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoadingScreen fullScreen label="Signing you out" />;
}
