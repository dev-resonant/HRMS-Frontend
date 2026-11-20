import { useForm, Controller } from "react-hook-form";
import { Link as RouterLink } from "react-router";
import { Button, CircularProgress, Divider, Link, Stack, Typography } from "@mui/material";
import ArrowForward from "@mui/icons-material/ArrowForward";
import Public from "@mui/icons-material/Public";
import { TextInput, PasswordInput } from "../../../components/ui/fields";
import { REGEX_EMAIL } from "../../../lib/validation-regex";
import { useTheme } from "@mui/material/styles";
import { SOCIAL_SIGNUP_TYPES } from "./signup-constants";
import { AuthShell } from "../AuthShell";

const PROVIDERS = {
  [SOCIAL_SIGNUP_TYPES.google]: {
    label: "Google",
    handler: () => console.debug("Google signup clicked"),
    icon: Public,
  },
};

export function GlobalMultiSignup({ social_signup_options = ["google"], onSignup, isLoading = false }) {
  const brand = useTheme().palette.brand;
  const { control, handleSubmit, getValues } = useForm({
    defaultValues: { email: "", full_name: "", password: "", confirm_password: "" },
  });

  return (
    <AuthShell title="Create ProHRM account" tagline="Get started in seconds">
      <form onSubmit={handleSubmit((data) => onSignup?.(data))} noValidate>
        <Stack spacing={2}>
          <Controller
            name="full_name"
            control={control}
            rules={{ required: "Full name is required" }}
            render={({ field, fieldState: { error } }) => (
              <TextInput id="signup-fullname" labelText="Full name" invalid={!!error} invalidText={error?.message} {...field} />
            )}
          />
          <Controller
            name="email"
            control={control}
            rules={{ required: "Email is required", pattern: { value: REGEX_EMAIL, message: "Invalid email address" } }}
            render={({ field, fieldState: { error } }) => (
              <TextInput id="signup-email" labelText="Work email" type="email" invalid={!!error} invalidText={error?.message} {...field} />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{ required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" } }}
            render={({ field, fieldState: { error } }) => (
              <PasswordInput id="signup-password" labelText="Password" autoComplete="new-password" invalid={!!error} invalidText={error?.message} {...field} />
            )}
          />
          <Controller
            name="confirm_password"
            control={control}
            rules={{
              required: "Please confirm your password",
              validate: (value) => value === getValues("password") || "Passwords do not match",
            }}
            render={({ field, fieldState: { error } }) => (
              <PasswordInput id="signup-confirm-password" labelText="Confirm password" autoComplete="new-password" invalid={!!error} invalidText={error?.message} {...field} />
            )}
          />

          <Button
            type="submit"
            size="large"
            variant="contained"
            disabled={isLoading}
            endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <ArrowForward />}
            sx={{ bgcolor: brand.ink, "&:hover": { bgcolor: brand.primary } }}
          >
            {isLoading ? "Creating account…" : "Create account"}
          </Button>

          <Typography align="center" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
            Already have an account?{" "}
            <Link component={RouterLink} to="/login" underline="hover" sx={{ fontWeight: 600 }}>
              Sign in
            </Link>
          </Typography>

          {social_signup_options.length > 0 && (
            <>
              <Divider>OR</Divider>
              {social_signup_options.map((key) => {
                const provider = PROVIDERS[key];
                if (!provider) return null;
                const Icon = provider.icon;
                return (
                  <Button key={key} variant="outlined" startIcon={<Icon />} onClick={provider.handler}>
                    Sign up with {provider.label}
                  </Button>
                );
              })}
            </>
          )}
        </Stack>
      </form>
    </AuthShell>
  );
}
