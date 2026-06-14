import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { REGEX_EMAIL } from "../../../lib/validation-regex";
import { useForgotPassword } from "./forgot-password-api";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import LoginIcon from "@mui/icons-material/Login";
import "./forgot-password.scss";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  TextField,
  Typography,
  Box,
} from "@mui/material";

const defaultInput = {
  email: "",
};

export function ForgotPassword({ defaultValues = defaultInput }) {
  const location = useLocation();
  const [isSent, setIsSent] = useState(false);
  if (location.state?.formdata) defaultValues = { ...defaultValues, ...location.state.formdata };
  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: defaultValues });
  const forgotSubmit = useForgotPassword();

  const submit = (inputs) => {
    const form_data = new FormData();
    for (const key in inputs) {
      form_data.append(key, inputs[key]);
    }
    forgotSubmit.mutate(form_data, {
      onSuccess: () => setIsSent(true),
      onError: (axiosError) => {
        setError("root.serverError", { message: axiosError.response.data.message, type: axiosError.response.status });
      },
    });
  };

  return (
    <div className="forgot-password-page gradient-bg">
      <Card className="forgot-password-container" elevation={3}>
        <CardHeader title="Forgot Password" />
        <CardContent>
          {isSent ? (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                Password reset link has been sent to your email: {watch("email")}.
                <br />
                The Link will expire in 24 Hr.
              </Typography>
              <Link to="/Login" className="login-link">
                <LoginIcon color="primary" sx={{ fontSize: "16px", color: "#1c57e4" }} /> Click Here to Login
              </Link>
            </Box>
          ) : (
            <>
              <img src="/images/norquest_newlogo.png" alt="" />
              <form noValidate onSubmit={handleSubmit(submit)} style={{ marginTop: "1rem" }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Enter your email address for the verification process. We Will send you a link to change your password
                  to the email provided
                </Typography>

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
                      placeholder="Enter email"
                      label="Email"
                      autoComplete="username"
                      error={!!error}
                      type="email"
                      fullWidth
                      helperText={error?.message}
                    />
                  )}
                />
                {errors?.root?.serverError && (
                  <Typography color="error" variant="caption" sx={{ mt: 2 }}>
                    {errors.root.serverError.message}
                  </Typography>
                )}
              </form>
            </>
          )}
        </CardContent>
        <CardActions sx={{ flexDirection: "column", gap: 2, p: 2, alignItems: "stretch" }}>
          {!isSent && (
            <>
              <Button variant="contained" onClick={handleSubmit(submit)} fullWidth>
                Send Reset Link
              </Button>
              <Link to={{ pathname: "/login" }} className="login-link" style={{ textAlign: "center" }}>
                <ArrowLeftIcon sx={{ color: "#1c57e4" }} />
                Back to Login
              </Link>
            </>
          )}
        </CardActions>
      </Card>
    </div>
  );
}
