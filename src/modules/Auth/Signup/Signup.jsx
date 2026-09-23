import { useLocation } from "react-router";
import { useSignup } from "./signup-api";
import { removeEmptyKeys } from "../../../lib/removeEmptyKeys";
import { GlobalMultiSignup } from "./GlobalMultiSignup";

export function Signup() {
  const { state } = useLocation();
  const signup = useSignup({ redirectionUrl: state?.redirectionUrl });
  const isLoading = signup.isPending;

  return (
    <div className="signup-page gradient-bg">
      <GlobalMultiSignup
        onSignup={(data) => signup.mutate(removeEmptyKeys(data))}
        isLoading={isLoading}
      />
    </div>
  );
}