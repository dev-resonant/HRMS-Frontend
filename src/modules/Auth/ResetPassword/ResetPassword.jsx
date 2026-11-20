import { useForm, Controller } from "react-hook-form";
import { useSearchParams, useNavigate, Link as RouterLink } from "react-router";
import { Box, Button, CircularProgress, Link, Stack, Typography } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Check from "@mui/icons-material/Check";
import Remove from "@mui/icons-material/Remove";
import { PasswordInput, InlineNotification } from "../../../components/ui/fields";
import { useTheme } from "@mui/material/styles";
import { useResetPassword } from "./reset-password-api";
import { AuthShell } from "../AuthShell";

const defaultInput = { password: "", confirm_password: "" };

export function ResetPassword() {
  const brand = useTheme().palette.brand;
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const reset = useResetPassword(token);
  const isLoading = reset.isPending;

  const { handleSubmit, control, watch, getValues, setError, formState: { errors } } = useForm({ defaultValues: defaultInput });

  const passwordVal = watch("password") || "";
  const rules = [
    { label: "At least 8 characters", valid: passwordVal.length >= 8 },
    { label: "At least one number or special char", valid: /[\d!@#$%^&*()]/.test(passwordVal) },
  ];

  const submit = (inputs) => {
    const form_data = new FormData();
    for (const key in inputs) {
      form_data.append(key, inputs[key]);
    }
    form_data.append("token", token);
    reset.mutate(form_data, {
      onSuccess: () => navigate("/login"),
      onError: (axiosError) => {
        setError("root.serverError", {
          message: axiosError.response?.data?.message || "Password reset failed.",
          type: axiosError.response?.status,
        });
      },
    });
  };

  return (
    <AuthShell title="New password" tagline="Set your new password">
      <form noValidate onSubmit={handleSubmit(submit)}>
        <Stack spacing={2}>
          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required", minLength: { value: 8, message: "Must be at least 8 characters" } }}
            render={({ field, fieldState: { error } }) => (
              <PasswordInput id="reset-password" labelText="New password" autoComplete="new-password" invalid={!!error} invalidText={error?.message} {...field} />
            )}
          />

          <Box>
            {rules.map((r) => (
              <Box key={r.label} sx={{ display: "flex", alignItems: "center", gap: 0.75, fontSize: "0.8125rem", color: r.valid ? "success.main" : "text.secondary" }}>
                {r.valid ? <Check sx={{ fontSize: 16 }} /> : <Remove sx={{ fontSize: 16 }} />}
                <Typography sx={{ fontSize: "inherit" }}>{r.label}</Typography>
              </Box>
            ))}
          </Box>

          <Controller
            name="confirm_password"
            control={control}
            rules={{
              required: "Please confirm your password",
              validate: (value) => value === getValues("password") || "Passwords do not match",
            }}
            render={({ field, fieldState: { error } }) => (
              <PasswordInput id="reset-confirm-password" labelText="Confirm password" autoComplete="new-password" invalid={!!error} invalidText={error?.message} {...field} />
            )}
          />

          {errors?.root?.serverError && <InlineNotification kind="error" title="Failed" subtitle={errors.root.serverError.message} />}

          <Button
            type="submit"
            size="large"
            variant="contained"
            disabled={isLoading}
            endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <ArrowForward />}
            sx={{ bgcolor: brand.ink, "&:hover": { bgcolor: brand.primary } }}
          >
            {isLoading ? "Saving…" : "Update password"}
          </Button>

          <Link component={RouterLink} to="/login" underline="hover" align="center" sx={{ textAlign: "center", fontWeight: 600 }}>
            Back to sign in
          </Link>
        </Stack>
      </form>
    </AuthShell>
  );
}
