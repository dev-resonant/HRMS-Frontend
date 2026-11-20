import { Button, InlineNotification, PasswordInput } from "../../../components/ui/fields";
import { useNavigate } from "react-router";
import { PageShell } from "../../../components/ui/PageShell";
import { useFormState } from "../../../components/ui/useFormState";
import { useChangePassword, useMe } from "../../../api/auth-api";

export function ChangePassword() {
  const navigate = useNavigate();
  const { data: me } = useMe();
  const change = useChangePassword();
  const [form, set, setForm] = useFormState({ currentPassword: "", newPassword: "", confirm: "" });
  const mismatch = form.confirm !== "" && form.newPassword !== form.confirm;

  return (
    <PageShell title="Change password" description="Other devices are signed out; this session stays signed in.">
      {me?.passwordChangeRequired && (
        <InlineNotification kind="warning" lowContrast hideCloseButton title="Password change required" subtitle="Set a new password to continue." />
      )}
      <form
        className="hr-card hr-form"
        style={{ maxWidth: "32rem" }}
        onSubmit={(e) => {
          e.preventDefault();
          change.mutate(
            { currentPassword: form.currentPassword, newPassword: form.newPassword },
            {
              onSuccess: () => {
                setForm({ currentPassword: "", newPassword: "", confirm: "" });
                navigate("/dashboard");
              },
            }
          );
        }}
      >
        <PasswordInput id="cp-current" className="full" labelText="Current password" autoComplete="current-password" value={form.currentPassword} onChange={set("currentPassword")} />
        <PasswordInput id="cp-new" className="full" labelText="New password" autoComplete="new-password" value={form.newPassword} onChange={set("newPassword")} />
        <PasswordInput
          id="cp-confirm"
          className="full"
          labelText="Confirm new password"
          autoComplete="new-password"
          value={form.confirm}
          onChange={set("confirm")}
          invalid={mismatch}
          invalidText="Passwords do not match"
        />
        <div className="full">
          <Button type="submit" disabled={change.isPending || !form.currentPassword || !form.newPassword || mismatch || !form.confirm}>
            {change.isPending ? "Saving…" : "Change password"}
          </Button>
        </div>
      </form>
    </PageShell>
  );
}
