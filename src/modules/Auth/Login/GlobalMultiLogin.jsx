/**
 * GlobalMultiLogin
 *
 * Supports:
 * - Email OTP
 * - Number OTP
 * - Email + Password
 * - Username + Password
 *
 * Parent controls the mode using:  mode="emailOtp" | "numberOtp" | "emailPassword" | "usernamePassword"
 */

import React, { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";

import { Link } from "react-router";
import { REGEX_EMAIL, REGEX_PHONE_NO } from "../../../lib/validation-regex";
import { SOCIAL_LOGIN_TYPES } from "./login-constants";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  CircularProgress,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Box,
} from "@mui/material";

export function GlobalMultiLogin({
  mode = "usernamePassword",
  social_login_options = [],
  sendOtp,
  verifyOtp,
  onLogin,
  isLoading = false,
}) {
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { control, handleSubmit, trigger, getValues, watch } = useForm({
    defaultValues: {
      email: "",
      number: "",
      otp: "",
      user_name: "",
      password: "",
    },
  });

  const buttonText = useMemo(() => {
    if (isLoading) return "Submitting...";
    if (otpSent) return "Verify OTP";
    return "Submit";
  }, [isLoading, otpSent]);

  const loginHandler = (data) => {
    onLogin?.(data);
  };

  const submitHandler = async (data) => {
    if (mode === "emailOtp" || mode === "numberOtp") {
      if (!otpSent) return sendOtpHandler();
      return verifyOtpHandler(data);
    }

    return loginHandler(data);
  };

  const sendOtpHandler = async () => {
    const field = mode === "emailOtp" ? "email" : "number";

    const isValid = await trigger(field);
    if (!isValid) return;

    const value = getValues(field);

    sendOtp?.({
      [field]: value,
    });

    setOtpSent(true);
  };

  const verifyOtpHandler = async (data) => {
    const isValid = await trigger("otp");
    if (!isValid) return;

    verifyOtp?.({
      ...data,
      type: mode === "emailOtp" ? "email" : "number",
    });
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const PROVIDERS = {
    [SOCIAL_LOGIN_TYPES.google]: { label: "Google", handler: handleGoogleLogin, icon: <GoogleIcon /> },
    // [SOCIAL_LOGIN_TYPES.microsoft]: {
    //   label: "Microsoft",
    //   icon: <Microsoft />,
    //   handler: onMicrosoftLogin,
    // },
    // [SOCIAL_LOGIN_TYPES.email]: { label: "Email", icon: <Email />, handler: onEmailLogin },
    // [SOCIAL_LOGIN_TYPES.apple]: { label: "Apple", icon: <Apple />, handler: onAppleLogin },
  };

  return (
    <Card className="login-container" elevation={3}>
      <CardHeader title="Login" />
      <CardContent>
        <form onSubmit={handleSubmit(submitHandler)} className="login-form">
          {/* EMAIL OTP */}
          {mode === "emailOtp" && (
            <>
              {!otpSent && (
                <TextField
                  id="email-input"
                  label="Email"
                  placeholder="Enter email"
                  type="email"
                  fullWidth
                  required
                  error={!!control._formState.errors.email}
                  helperText={control._formState.errors.email?.message}
                  {...control.register("email", {
                    required: "Email required",
                    pattern: { value: REGEX_EMAIL, message: "Invalid email" },
                  })}
                />
              )}

              {otpSent && (
                <TextField
                  id="otp"
                  label="OTP"
                  placeholder="Enter otp"
                  fullWidth
                  required
                  error={!!control._formState.errors.otp}
                  helperText={control._formState.errors.otp?.message}
                  {...control.register("otp", {
                    required: "OTP required",
                    minLength: { value: 4, message: "Min 4 digits" },
                    maxLength: { value: 6, message: "Max 6 digits" },
                  })}
                />
              )}
            </>
          )}

          {/* NUMBER OTP */}
          {mode === "numberOtp" && (
            <>
              {!otpSent && (
                <TextField
                  id="mobile-number"
                  label="Mobile Number"
                  placeholder="Enter mobile number"
                  fullWidth
                  required
                  error={!!control._formState.errors.number}
                  helperText={control._formState.errors.number?.message}
                  {...control.register("number", {
                    minLength: { value: 10, message: "Min 10 digits" },
                    required: "Mobile number required",
                    pattern: { value: REGEX_PHONE_NO, message: "Enter valid 10-digit number" },
                  })}
                />
              )}

              {otpSent && (
                <TextField
                  id="otp-sent"
                  label="OTP"
                  placeholder="Enter otp"
                  fullWidth
                  required
                  error={!!control._formState.errors.otp}
                  helperText={control._formState.errors.otp?.message}
                  {...control.register("otp", {
                    required: "OTP required",
                    minLength: { value: 4, message: "Min 4 digits" },
                    maxLength: { value: 6, message: "Max 6 digits" },
                  })}
                />
              )}
            </>
          )}

          {/* EMAIL + PASSWORD */}
          {mode === "emailPassword" && (
            <>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email required",
                  pattern: { value: REGEX_EMAIL, message: "Invalid email" },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    id="email-input-password"
                    label="Email"
                    placeholder="Enter email"
                    autoComplete="username"
                    error={!!error}
                    type="email"
                    fullWidth
                    required
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password required",
                  minLength: { value: 6, message: "Min 6 chars" },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    id="password-input"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    error={!!error}
                    autoComplete="current-password"
                    fullWidth
                    required
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    helperText={error?.message}
                  />
                )}
              />
              <Box className="forgot-password-login" sx={{ textAlign: "right", mt: 1 }}>
                <Link
                  to={{ pathname: "/forgot-password" }}
                  state={{ formdata: { email: watch("email") } }}
                  className="forgot-password-link"
                >
                  Forgot Password ?
                </Link>
              </Box>
            </>
          )}

          {/* USERNAME + PASSWORD */}
          {mode === "usernamePassword" && (
            <>
              <Controller
                name="user_name"
                control={control}
                rules={{
                  required: "Username required",
                  minLength: { value: 3, message: "Min 3 chars" },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    id="username-input"
                    {...field}
                    label="Username"
                    placeholder="Enter username"
                    autoComplete="username"
                    error={!!error}
                    fullWidth
                    required
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password required",
                  minLength: { value: 6, message: "Min 6 chars" },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    id="password-input"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    error={!!error}
                    autoComplete="current-password"
                    fullWidth
                    required
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    helperText={error?.message}
                  />
                )}
              />
              <Box className="forgot-password-login" sx={{ textAlign: "right", mt: 1 }}>
                <Link
                  to={{ pathname: "/forgot-password" }}
                  state={{ formdata: { email: watch("email") } }}
                  className="forgot-password-link"
                >
                  Forgot Password ?
                </Link>
              </Box>
            </>
          )}
        </form>
      </CardContent>
      <CardActions sx={{ flexDirection: "column", gap: 2, p: 2, alignItems: "stretch" }}>
        {/* SUBMIT BUTTON */}
        <Button
          onClick={handleSubmit(submitHandler)}
          variant="contained"
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          disabled={isLoading}
          fullWidth
        >
          {buttonText}
        </Button>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link to="/signup" style={{ color: "primary.main", textDecoration: "none", fontWeight: 500 }}>
              Sign Up
            </Link>
          </Typography>
        </Box>

        {social_login_options.length > 0 && (
          <Box className="social-login-wrapper">
            <Typography color="text.secondary" variant="body2" align="center">
              Or
            </Typography>

            <Box className="social-login-buttons" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {social_login_options.map((key) => {
                const provider = PROVIDERS[key];
                if (!provider) return null;

                return (
                  <Button
                    key={key}
                    variant="outlined"
                    onClick={provider.handler}
                    startIcon={provider.icon}
                    fullWidth
                  >
                    Continue with {provider.label}
                  </Button>
                );
              })}
            </Box>
          </Box>
        )}
      </CardActions>
    </Card>
  );
}
