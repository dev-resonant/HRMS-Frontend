import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link as RouterLink } from "react-router";
import { Box, Button, CircularProgress, Link, Stack, Typography } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import { TextInput, PasswordInput, Checkbox } from "../../../components/ui/fields";
import { REGEX_EMAIL } from "../../../lib/validation-regex";
import { useTheme } from "@mui/material/styles";
import { AuthShell } from "../AuthShell";

export function GlobalMultiLogin({ onLogin, isLoading = false }) {
  const brand = useTheme().palette.brand;
  const [rememberMe, setRememberMe] = useState(false);

  const { control, handleSubmit, getValues } = useForm({
    defaultValues: { email: "", password: "" },
  });

  return (
    <AuthShell title="ProHRM" tagline="Sign in to your account">
      <form onSubmit={handleSubmit((data) => onLogin?.(data, rememberMe))} noValidate>
        <Stack spacing={2.5}>
          <Controller
            name="email"
            control={control}
            rules={{ required: "Email is required", pattern: { value: REGEX_EMAIL, message: "Invalid email address" } }}
            render={({ field, fieldState: { error } }) => (
              <TextInput id="login-email" labelText="Email" type="email" autoComplete="username" invalid={!!error} invalidText={error?.message} {...field} />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required" }}
            render={({ field, fieldState: { error } }) => (
              <PasswordInput id="login-password" labelText="Password" autoComplete="current-password" invalid={!!error} invalidText={error?.message} {...field} />
            )}
          />

          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Checkbox id="remember-me" labelText="Remember me" checked={rememberMe} onChange={(_, { checked }) => setRememberMe(checked)} />
            <Link component={RouterLink} to="/forgot-password" state={{ formdata: { email: getValues("email") } }} underline="hover" sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
              Forgot password?
            </Link>
          </Box>

          <Button
            type="submit"
            size="large"
            variant="contained"
            disabled={isLoading}
            endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <ArrowForward />}
            sx={{ bgcolor: brand.ink, "&:hover": { bgcolor: brand.primary } }}
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>

          <Typography align="center" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
            Don&apos;t have an account?{" "}
            <Link component={RouterLink} to="/signup" underline="hover" sx={{ fontWeight: 600 }}>
              Create account
            </Link>
          </Typography>
        </Stack>
      </form>
    </AuthShell>
  );
}
