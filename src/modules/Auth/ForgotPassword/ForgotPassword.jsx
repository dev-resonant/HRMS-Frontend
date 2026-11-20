import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { Button, CircularProgress, Link, Stack } from "@mui/material";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Send from "@mui/icons-material/Send";
import Refresh from "@mui/icons-material/Refresh";
import { TextInput, InlineNotification } from "../../../components/ui/fields";
import { REGEX_EMAIL } from "../../../lib/validation-regex";
import { useTheme } from "@mui/material/styles";
import { useForgotPassword } from "./forgot-password-api";
import { AuthShell } from "../AuthShell";

const defaultInput = { email: "" };

export function ForgotPassword({ defaultValues = defaultInput }) {
  const brand = useTheme().palette.brand;
  const location = useLocation();
  const [isSent, setIsSent] = useState(false);

  if (location.state?.formdata) {
    defaultValues = { ...defaultValues, ...location.state.formdata };
  }

  const { control, handleSubmit, setError, watch, formState: { errors } } = useForm({ defaultValues });

  const forgotSubmit = useForgotPassword();
  const isLoading = forgotSubmit.isPending;

  const submit = (inputs) => {
    const form_data = new FormData();
    for (const key in inputs) {
      form_data.append(key, inputs[key]);
    }
    forgotSubmit.mutate(form_data, {
      onSuccess: () => setIsSent(true),
      onError: (axiosError) => {
        setError("root.serverError", {
          message: axiosError.response?.data?.message || "Failed to send reset link",
          type: axiosError.response?.status,
        });
      },
    });
  };

  return (
    <AuthShell title="Forgot password" tagline="Enter your work email to reset">
      {isSent ? (
        <Stack spacing={2}>
          <InlineNotification kind="success" title="Reset link sent" subtitle={`Check ${watch("email")} for instructions.`} />
          <Button variant="text" startIcon={<Refresh />} onClick={handleSubmit(submit)} disabled={isLoading}>
            Resend link
          </Button>
          <Button component={RouterLink} to="/login" variant="contained" size="large" sx={{ bgcolor: brand.ink }}>
            Back to sign in
          </Button>
        </Stack>
      ) : (
        <form noValidate onSubmit={handleSubmit(submit)}>
          <Stack spacing={2.5}>
            <Controller
              name="email"
              control={control}
              rules={{ required: "Email is required", pattern: { value: REGEX_EMAIL, message: "Enter a valid email" } }}
              render={({ field, fieldState: { error } }) => (
                <TextInput id="forgot-email" labelText="Email address" type="email" invalid={!!error} invalidText={error?.message} {...field} />
              )}
            />
            {errors?.root?.serverError && <InlineNotification kind="error" title="Failed" subtitle={errors.root.serverError.message} />}
            <Button
              type="submit"
              size="large"
              variant="contained"
              disabled={isLoading}
              endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <Send />}
              sx={{ bgcolor: brand.ink, "&:hover": { bgcolor: brand.primary } }}
            >
              {isLoading ? "Sending…" : "Send reset link"}
            </Button>
            <Link component={RouterLink} to="/login" underline="hover" sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, justifyContent: "center", fontWeight: 600 }}>
              <ArrowBack fontSize="small" /> Back to sign in
            </Link>
          </Stack>
        </form>
      )}
    </AuthShell>
  );
}
