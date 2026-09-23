import { useLocation } from "react-router";
import { useLogin } from "./login-api";
import { removeEmptyKeys } from "../../../lib/removeEmptyKeys";
import { GlobalMultiLogin } from "./GlobalMultiLogin";
import "./login.scss";

export function Login() {
  const { state } = useLocation();
  const login = useLogin({ redirectionUrl: state?.redirectionUrl });
  const isLoading = login.isPending;

  return (
    <div className="login-page gradient-bg">
      <GlobalMultiLogin
        onLogin={(data, remember) => login.mutate({ formdata: removeEmptyKeys(data), remember })}
        isLoading={isLoading}
      />
    </div>
  );
}