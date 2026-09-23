import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  InlineLoading,
  Heading,
  Stack,
} from "@carbon/react";
import { ArrowRight, Enterprise } from "@carbon/icons-react";
import { REGEX_EMAIL } from "../../../lib/validation-regex";
import "./login.scss";

export function GlobalMultiLogin({
  onLogin,
  isLoading = false,
}) {
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const buttonText = useMemo(() => {
    if (isLoading) return "Signing in...";
    return "Sign In";
  }, [isLoading]);

  const loginHandler = (data, remember) => {
    onLogin?.(data, remember);
  };

  const submitHandler = async (data) => {
    return loginHandler(data, rememberMe);
  };

  const handleFillDemo = () => {
    setValue("email", "het@gmail.com");
    setValue("password", "Het@1234");
  };

  return (
    <div className="simple-auth-page">
      <div className="simple-login-container animate-fade-in">
        {/* Simple Brand Header */}
        <div className="simple-auth-header">
          <div className="brand-badge">
            <Enterprise size={24} />
          </div>
          <Heading className="brand-title">ProHRM</Heading>
          <p className="brand-tagline">Sign in to your account</p>
        </div>

        {/* Demo Quick Auto-Fill */}
        <div className="simple-demo-pill">
          <span>Demo: <strong>het@gmail.com</strong> / <strong>Het@1234</strong></span>
          <button type="button" onClick={handleFillDemo} className="fill-btn">
            Auto-fill
          </button>
        </div>

        <form onSubmit={handleSubmit(submitHandler)} className="simple-login-form">
          <Stack gap={5}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: { value: REGEX_EMAIL, message: "Invalid email address" },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextInput
                  id="login-email"
                  labelText="Email"
                  placeholder="het@gmail.com"
                  type="email"
                  required
                  invalid={!!error}
                  invalidText={error?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
              }}
              render={({ field, fieldState: { error } }) => (
                <PasswordInput
                  id="login-password"
                  labelText="Password"
                  placeholder="Het@1234"
                  required
                  invalid={!!error}
                  invalidText={error?.message}
                  {...field}
                />
              )}
            />

            <div className="form-sub-row">
              <Checkbox
                id="remember-me"
                labelText="Remember me"
                checked={rememberMe}
                onChange={(_, { checked }) => setRememberMe(checked)}
              />
              <Link
                to="/forgot-password"
                state={{ formdata: { email: getValues("email") } }}
                className="forgot-link"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              size="lg"
              className="submit-btn"
              disabled={isLoading}
              renderIcon={isLoading ? null : ArrowRight}
            >
              {isLoading ? (
                <InlineLoading status="active" description="Signing in..." />
              ) : (
                buttonText
              )}
            </Button>

            <div className="signup-link-row">
              Don&apos;t have an account? <Link to="/signup">Create account</Link>
            </div>
          </Stack>
        </form>
      </div>
    </div>
  );
}