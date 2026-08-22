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
import { ArrowRight, Enterprise, Globe } from "@carbon/icons-react";
import { REGEX_EMAIL, REGEX_PHONE_NO } from "../../../lib/validation-regex";
import { SOCIAL_LOGIN_TYPES } from "./login-constants";
import "./login.scss";

export function GlobalMultiLogin({
  social_login_options = ["google"],
  sendOtp,
  verifyOtp,
  onLogin,
  isLoading = false,
}) {
  const [activeTab, setActiveTab] = useState("password");
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    control,
    handleSubmit,
    trigger,
    getValues,
    watch,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "het@gmail.com",
      number: "",
      otp: "",
      password: "Het@1234",
    },
  });

  const buttonText = useMemo(() => {
    if (isLoading) return "Signing in...";
    if (otpSent) return "Verify & Sign In";
    if (activeTab === "password") return "Sign In";
    return "Send Passcode";
  }, [isLoading, otpSent, activeTab]);

  const loginHandler = (data, remember) => {
    onLogin?.(data, remember);
  };

  const submitHandler = async (data) => {
    if (activeTab === "emailOtp" || activeTab === "numberOtp") {
      if (!otpSent) return sendOtpHandler();
      return verifyOtpHandler(data);
    }
    return loginHandler(data, rememberMe);
  };

  const sendOtpHandler = async () => {
    const field = activeTab === "emailOtp" ? "email" : "number";
    const isValid = await trigger(field);
    if (!isValid) return;

    const value = getValues(field);
    sendOtp?.({ [field]: value });
    setOtpSent(true);
  };

  const verifyOtpHandler = async (data) => {
    const isValid = await trigger("otp");
    if (!isValid) return;

    verifyOtp?.(
      {
        ...data,
        type: activeTab === "emailOtp" ? "email" : "number",
      },
      rememberMe
    );
  };

  const handleFillDemo = () => {
    setValue("email", "het@gmail.com");
    setValue("password", "Het@1234");
  };

  const handleGoogleLogin = () => {
    console.debug("Google login clicked");
  };

  const PROVIDERS = {
    [SOCIAL_LOGIN_TYPES.google]: {
      label: "Google",
      handler: handleGoogleLogin,
      icon: Globe,
    },
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

        {/* Mode Switcher Tabs */}
        <div className="simple-auth-tabs">
          <button
            type="button"
            className={`tab-item ${activeTab === "password" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("password");
              setOtpSent(false);
            }}
          >
            Password
          </button>
          <button
            type="button"
            className={`tab-item ${activeTab === "emailOtp" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("emailOtp");
              setOtpSent(false);
            }}
          >
            Email OTP
          </button>
          <button
            type="button"
            className={`tab-item ${activeTab === "numberOtp" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("numberOtp");
              setOtpSent(false);
            }}
          >
            Phone OTP
          </button>
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
            {/* Password Login */}
            {activeTab === "password" && (
              <>
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
                    state={{ formdata: { email: watch("email") } }}
                    className="forgot-link"
                  >
                    Forgot password?
                  </Link>
                </div>
              </>
            )}

            {/* Email OTP */}
            {activeTab === "emailOtp" && (
              <>
                {!otpSent ? (
                  <TextInput
                    id="login-email-otp"
                    labelText="Email Address"
                    placeholder="het@gmail.com"
                    type="email"
                    required
                    invalid={!!errors.email}
                    invalidText={errors.email?.message}
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: REGEX_EMAIL, message: "Invalid email" },
                    })}
                  />
                ) : (
                  <TextInput
                    id="login-otp-code"
                    labelText="OTP Code"
                    placeholder="Enter 4-digit OTP (1234)"
                    required
                    invalid={!!errors.otp}
                    invalidText={errors.otp?.message}
                    {...register("otp", {
                      required: "OTP is required",
                    })}
                  />
                )}
              </>
            )}

            {/* Phone OTP */}
            {activeTab === "numberOtp" && (
              <>
                {!otpSent ? (
                  <TextInput
                    id="login-phone-otp"
                    labelText="Mobile Number"
                    placeholder="9327536128"
                    required
                    invalid={!!errors.number}
                    invalidText={errors.number?.message}
                    {...register("number", {
                      required: "Mobile number is required",
                      pattern: {
                        value: REGEX_PHONE_NO,
                        message: "Enter valid 10-digit number",
                      },
                    })}
                  />
                ) : (
                  <TextInput
                    id="login-phone-otp-code"
                    labelText="OTP Code"
                    placeholder="Enter 4-digit OTP (1234)"
                    required
                    invalid={!!errors.otp}
                    invalidText={errors.otp?.message}
                    {...register("otp", {
                      required: "OTP is required",
                    })}
                  />
                )}
              </>
            )}

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

            {social_login_options.length > 0 && (
              <div className="social-section">
                <div className="or-divider">
                  <span>OR</span>
                </div>
                {social_login_options.map((key) => {
                  const provider = PROVIDERS[key];
                  if (!provider) return null;
                  const Icon = provider.icon;
                  return (
                    <Button
                      key={key}
                      kind="tertiary"
                      size="md"
                      onClick={provider.handler}
                      renderIcon={Icon}
                      className="social-btn"
                    >
                      Sign in with {provider.label}
                    </Button>
                  );
                })}
              </div>
            )}
          </Stack>
        </form>
      </div>
    </div>
  );
}
