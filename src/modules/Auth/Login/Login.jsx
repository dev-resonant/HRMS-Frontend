import { useLocation } from "react-router";
import { useLogin } from "./login-api";
import { removeEmptyKeys } from "../../../lib/removeEmptyKeys";
import { GlobalMultiLogin } from "./GlobalMultiLogin";

export function Login() {
  const { state } = useLocation();
  const login = useLogin({ redirectionUrl: state?.redirectionUrl });

  return (
    <GlobalMultiLogin
      onLogin={(data, remember) => login.mutate({ formdata: removeEmptyKeys(data), remember })}
      isLoading={login.isPending}
    />
  );
}
