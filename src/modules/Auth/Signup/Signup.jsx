import { useLocation } from "react-router";
import { useSignup, useSendSignupOtp, useVerifySignupOtp } from "./signup-api";
import { SIGNUP_TYPES } from "./signup-constants";
import "./signup.scss";
import { GlobalMultiSignup } from "./GlobalMultiSignup";
import { removeEmptyKeys } from "../../../lib/removeEmptyKeys";

export function Signup() {
  const { state } = useLocation();
  const signup = useSignup({ redirectionUrl: state?.redirectionUrl });
  const sendOtp = useSendSignupOtp();
  const verifyOtp = useVerifySignupOtp({ redirectionUrl: state?.redirectionUrl });
  const isLoading = signup.isPending || sendOtp.isPending || verifyOtp.isPending;

  return (
    <div className="signup-page gradient-bg">
      <GlobalMultiSignup
        mode={SIGNUP_TYPES.emailPassword}
        onSignup={(data) => signup.mutate(removeEmptyKeys(data))}
        sendOtp={(data) => sendOtp.mutate(removeEmptyKeys(data))}
        verifyOtp={(data) => verifyOtp.mutate(removeEmptyKeys(data))}
        social_signup_options={["google"]}
        isLoading={isLoading}
      />
    </div>
  );
}
