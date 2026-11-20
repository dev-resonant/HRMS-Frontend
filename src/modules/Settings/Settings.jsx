import { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Button, Checkbox, NumberInput, Select, SelectItem } from "../../components/ui/fields";
import { PageShell } from "../../components/ui/PageShell";
import { useFormState } from "../../components/ui/useFormState";
import { usePermissions } from "../../api/auth-api";
import { useCompanySettings, useUpdateCompanySettings } from "../../api/workplace-api";
import { AppearanceSettings } from "./AppearanceSettings";

function CompanyRules() {
  const { can } = usePermissions();
  const { data, isLoading } = useCompanySettings();
  const save = useUpdateCompanySettings();
  const [form, set, setForm] = useFormState({ geofenceMode: "warn", mispunchWindowDays: 3, allowPastLeave: false });
  const canEdit = can("system", "configure_company");

  useEffect(() => {
    if (data) setForm(data);
  }, [data, setForm]);

  return (
    <form
      className="hr-card"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate({ ...form, mispunchWindowDays: Number(form.mispunchWindowDays) });
      }}
    >
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h6">Company rules</Typography>
        <Typography sx={{ color: "text.secondary", mt: 0.25 }}>Rules that apply to attendance and leave across the company.</Typography>
      </Box>

      <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, maxWidth: 820 }}>
        <Select
          id="set-geofence"
          labelText="Geofence mode"
          helperText="Warn records an outside-location punch as invalid; block refuses it."
          value={form.geofenceMode}
          onChange={set("geofenceMode")}
          disabled={isLoading || !canEdit}
        >
          <SelectItem value="warn" text="Warn" />
          <SelectItem value="block" text="Block" />
        </Select>
        <NumberInput
          id="set-window"
          label="Mispunch request window (days)"
          helperText="How many past days an employee can raise a correction for."
          min={1}
          value={form.mispunchWindowDays}
          onChange={(_, { value }) => set("mispunchWindowDays")(value)}
          disabled={isLoading || !canEdit}
        />
        <Box sx={{ gridColumn: "1 / -1" }}>
          <Checkbox
            id="set-past-leave"
            labelText="Allow applying for leave on past dates"
            checked={!!form.allowPastLeave}
            onChange={(_, { checked }) => set("allowPastLeave")(checked)}
            disabled={isLoading || !canEdit}
          />
        </Box>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap", mt: 3, pt: 2.5, borderTop: "1px solid", borderColor: "divider" }}>
        <Button type="submit" disabled={!canEdit || save.isPending}>
          {save.isPending ? "Saving…" : "Save settings"}
        </Button>
        {!canEdit && <Typography sx={{ color: "text.secondary", fontSize: "0.875rem" }}>You do not have permission to change company settings.</Typography>}
      </Box>
    </form>
  );
}

export function Settings() {
  return (
    <PageShell title="Settings" description="Personalise how the app looks and manage company-wide rules.">
      <AppearanceSettings />
      <CompanyRules />
    </PageShell>
  );
}
