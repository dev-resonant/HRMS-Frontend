import { useLocation } from "react-router";
import { useLogin, useSendOtp, useVerifyOtp } from "./login-api";
import { LOGIN_TYPES } from "./login-constants";
import "./login.scss";
import { GlobalMultiLogin } from "./GlobalMultiLogin";
import { removeEmptyKeys } from "../../../lib/removeEmptyKeys";

export function Login() {
  const { state } = useLocation();
  const login = useLogin({ redirectionUrl: state?.redirectionUrl });
  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp({ redirectionUrl: state?.redirectionUrl });
  const isLoading = login.isPending || sendOtp.isPending || verifyOtp.isPending;

  return (
    <div className="login-page gradient-bg">
      <GlobalMultiLogin
        mode={LOGIN_TYPES.emailPassword}
        onLogin={(data, remember) => login.mutate({ formdata: removeEmptyKeys(data), remember })}
        sendOtp={(data) => sendOtp.mutate(removeEmptyKeys(data))}
        verifyOtp={(data, remember) => verifyOtp.mutate({ formdata: removeEmptyKeys(data), remember })}
        // social_login_options={["google", "apple", "microsoft", "email"]}
        isLoading={isLoading}
        // onGoogleLogin={() => console.debug("logged in by google")}
      />
    </div>
  );
}
