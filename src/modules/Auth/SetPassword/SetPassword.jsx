import { Button, Link, Stack } from "@mui/material";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router";
import { PasswordInput, InlineNotification } from "../../../components/ui/fields";
import { useFormState } from "../../../components/ui/useFormState";
import { useSetPassword } from "../../../api/auth-api";
import { useTheme } from "@mui/material/styles";
import { AuthShell } from "../AuthShell";

/** Onboarding: /set-password?token=… from the invitation. Does not log the user in. */
export function SetPassword() {
  const brand = useTheme().palette.brand;
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const navigate = useNavigate();
  const setPassword = useSetPassword();
  const [form, set] = useFormState({ newPassword: "", confirm: "" });
  const mismatch = form.confirm !== "" && form.newPassword !== form.confirm;

  return (
    <AuthShell title="Set your password" tagline="Finish setting up your account">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPassword.mutate({ token, newPassword: form.newPassword }, { onSuccess: () => navigate("/login") });
        }}
      >
        <Stack spacing={2.5}>
          {!token && <InlineNotification kind="error" title="Invitation link is missing its token" subtitle="Open the link from your invitation again." />}
          <PasswordInput id="sp-new" labelText="New password" autoComplete="new-password" value={form.newPassword} onChange={set("newPassword")} />
          <PasswordInput
            id="sp-confirm"
            labelText="Confirm password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={set("confirm")}
            invalid={mismatch}
            invalidText="Passwords do not match"
          />
          <Button
            type="submit"
            size="large"
            variant="contained"
            disabled={!token || !form.newPassword || mismatch || !form.confirm || setPassword.isPending}
            sx={{ bgcolor: brand.ink, "&:hover": { bgcolor: brand.primary } }}
          >
            {setPassword.isPending ? "Saving…" : "Set password"}
          </Button>
          <Link component={RouterLink} to="/login" underline="hover" sx={{ textAlign: "center", fontWeight: 600 }}>
            Back to sign in
          </Link>
        </Stack>
      </form>
    </AuthShell>
  );
}
