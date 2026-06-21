/**
 * GlobalMultiSignup
 *
 * Supports:
 * - Email OTP
 * - Number OTP
 * - Email + Password
 *
 * Parent controls the mode using:  mode="emailOtp" | "numberOtp" | "emailPassword"
 */

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";

import { Eye, EyeOff, Globe } from "lucide-react";

import { Link } from "react-router";
import { REGEX_EMAIL, REGEX_PHONE_NO } from "../../../lib/validation-regex";
import { SOCIAL_SIGNUP_TYPES } from "./signup-constants";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Box,
} from "@mui/material";

export function GlobalMultiSignup({
  mode = "emailPassword",
  social_signup_options = [],
  sendOtp,
  verifyOtp,
  onSignup,
  isLoading = false,
}) {
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { control, handleSubmit, trigger, getValues, watch } = useForm({
    defaultValues: {
      email: "",
      number: "",
      otp: "",
      full_name: "",
      password: "",
      confirm_password: "",
    },
  });

  const buttonText = useMemo(() => {
    if (isLoading) return "Submitting...";
    if (otpSent) return "Verify OTP";
    return "Sign Up";
  }, [isLoading, otpSent]);

  const signupHandler = (data) => {
    onSignup?.(data);
  };

  const submitHandler = async (data) => {
    if (mode === "emailOtp" || mode === "numberOtp") {
      if (!otpSent) return sendOtpHandler();
      return verifyOtpHandler(data);
    }

    return signupHandler(data);
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

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
  };

  const PROVIDERS = {
    [SOCIAL_SIGNUP_TYPES.google]: { label: "Google", handler: handleGoogleSignup, icon: <Globe /> },
  };

  return (
    <Box className="signup-container">
      <Typography variant="h4" component="h1" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit(submitHandler)} className="signup-form">
          {/* EMAIL OTP */}
          {mode === "emailOtp" && (
            <>
              {!otpSent && (
                <>
                  <Controller
                    name="full_name"
                    control={control}
                    rules={{
                      required: "Full name required",
                      minLength: { value: 3, message: "Min 3 chars" },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        id="fullname-input"
                        label="Full Name"
                        placeholder="Enter full name"
                        autoComplete="name"
                        error={!!error}
                        fullWidth
                        required
                        helperText={error?.message}
                        sx={{ mb: 2 }}
                      />
                    )}
                  />
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
                </>
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
                <>
                  <Controller
                    name="full_name"
                    control={control}
                    rules={{
                      required: "Full name required",
                      minLength: { value: 3, message: "Min 3 chars" },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        id="fullname-input-number"
                        label="Full Name"
                        placeholder="Enter full name"
                        autoComplete="name"
                        error={!!error}
                        fullWidth
                        required
                        helperText={error?.message}
                        sx={{ mb: 2 }}
                      />
                    )}
                  />
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
                </>
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
                name="full_name"
                control={control}
                rules={{
                  required: "Full name required",
                  minLength: { value: 3, message: "Min 3 chars" },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    id="fullname-input-password"
                    label="Full Name"
                    placeholder="Enter full name"
                    autoComplete="name"
                    error={!!error}
                    fullWidth
                    required
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />

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
                    autoComplete="new-password"
                    fullWidth
                    required
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <EyeOff /> : <Eye />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    helperText={error?.message}
                    sx={{ mb: 2 }}
                  />
                )}
              />

              <Controller
                name="confirm_password"
                control={control}
                rules={{
                  required: "Confirm password required",
                  validate: (value) => value === watch("password") || "Passwords do not match",
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    id="confirm-password-input"
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    error={!!error}
                    autoComplete="new-password"
                    fullWidth
                    required
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                              {showConfirmPassword ? <EyeOff /> : <Eye />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                    helperText={error?.message}
                  />
                )}
              />
            </>
          )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2, alignItems: "stretch" }}>
          {/* SUBMIT BUTTON */}
          <Button
            type="submit"
            variant="contained"
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            disabled={isLoading}
            fullWidth
          >
            {buttonText}
          </Button>

          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "primary.main", textDecoration: "none", fontWeight: 500 }}>
                Login
              </Link>
            </Typography>
          </Box>

          {social_signup_options.length > 0 && (
            <Box className="social-signup-wrapper">
              <Typography color="text.secondary" variant="body2" align="center">
                Or
              </Typography>

              <Box className="social-signup-buttons" sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {social_signup_options.map((key) => {
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
        </Box>
      </form>
    </Box>
  );
}
