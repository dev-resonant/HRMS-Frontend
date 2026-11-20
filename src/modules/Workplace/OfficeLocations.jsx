import { useEffect, useState } from "react";
import { RowActions } from "../../components/ui/RowActions";
import EditOutlined from "@mui/icons-material/EditOutlined";
import PowerSettingsNewOutlined from "@mui/icons-material/PowerSettingsNewOutlined";
import { Button, NumberInput, TextInput } from "../../components/ui/fields";
import Add from "@mui/icons-material/Add";
import { PageShell } from "../../components/ui/PageShell";
import { SimpleTable } from "../../components/ui/SimpleTable";
import { FormModal } from "../../components/ui/FormModal";
import { StatusTag } from "../../components/ui/format";
import { useFormState } from "../../components/ui/useFormState";
import { usePermissions } from "../../api/auth-api";
import {
  useOfficeLocations,
  useCreateOfficeLocation,
  useUpdateOfficeLocation,
  useSetOfficeLocationStatus,
} from "../../api/workplace-api";

function LocationFormModal({ location, onClose }) {
  const create = useCreateOfficeLocation();
  const update = useUpdateOfficeLocation();
  const [form, set, setForm] = useFormState({ name: "", latitude: "", longitude: "", radiusMeters: 100 });

  useEffect(() => {
    if (location) {
      setForm({
        name: location.name,
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        radiusMeters: location.radiusMeters,
      });
    }
  }, [location, setForm]);

  const fillMyPosition = () =>
    navigator.geolocation?.getCurrentPosition((p) => {
      set("latitude")(String(p.coords.latitude));
      set("longitude")(String(p.coords.longitude));
    });

  const valid =
    form.name.trim() &&
    form.latitude !== "" &&
    form.longitude !== "" &&
    Math.abs(Number(form.latitude)) <= 90 &&
    Math.abs(Number(form.longitude)) <= 180;

  const submit = () => {
    const body = {
      name: form.name,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      radiusMeters: Number(form.radiusMeters),
    };
    if (location) update.mutate({ id: location.id, body }, { onSuccess: onClose });
    else create.mutate(body, { onSuccess: onClose });
  };

  return (
    <FormModal
      open
      title={location ? "Edit office location" : "New office location"}
      isSubmitting={create.isPending || update.isPending}
      submitDisabled={!valid}
      onClose={onClose}
      onSubmit={submit}
    >
      <TextInput id="loc-name" className="full" labelText="Name" value={form.name} onChange={set("name")} />
      <TextInput id="loc-lat" labelText="Latitude" type="number" step="any" value={form.latitude} onChange={set("latitude")} />
      <TextInput id="loc-lng" labelText="Longitude" type="number" step="any" value={form.longitude} onChange={set("longitude")} />
      <NumberInput
        id="loc-radius"
        label="Radius (meters)"
        min={1}
        value={form.radiusMeters}
        onChange={(_, { value }) => set("radiusMeters")(value)}
      />
      <div style={{ alignSelf: "end" }}>
        <Button kind="tertiary" size="md" type="button" onClick={fillMyPosition}>
          Use my current position
        </Button>
      </div>
    </FormModal>
  );
}

export function OfficeLocations() {
  const { can } = usePermissions();
  const { data = [], isLoading, error } = useOfficeLocations(true);
  const setStatus = useSetOfficeLocationStatus();
  const [modal, setModal] = useState(null);
  const canConfigure = can("attendance", "configure");
  const close = () => setModal(null);

  const columns = [
    { key: "name", header: "Location", render: (r) => <strong>{r.name}</strong> },
    { key: "latitude", header: "Latitude" },
    { key: "longitude", header: "Longitude" },
    { key: "radiusMeters", header: "Radius", render: (r) => `${r.radiusMeters} m` },
    { key: "isActive", header: "Status", render: (r) => <StatusTag value={r.isActive ? "Active" : "Inactive"} /> },
    {
      key: "actions",
      header: "",
      render: (r) =>
        canConfigure && (
          <RowActions
            actions={[
              { label: "Edit", icon: <EditOutlined fontSize="small" />, onClick: () => setModal({ location: r }) },
              { label: r.isActive ? "Deactivate" : "Activate", icon: <PowerSettingsNewOutlined fontSize="small" />, danger: r.isActive, onClick: () => setStatus.mutate({ id: r.id, isActive: !r.isActive }) },
            ]}
          />
        ),
    },
  ];

  return (
    <PageShell
      title="Office locations"
      description="Geofences used to validate punches. Assign a location to an employee from the Employees page."
      actions={
        canConfigure && (
          <Button renderIcon={Add} onClick={() => setModal({})}>
            New location
          </Button>
        )
      }
    >
      <SimpleTable illustration="pin" emptyTitle="No office locations" emptyText="Add a location to enable geofenced punches." columns={columns} rows={data} isLoading={isLoading} error={error} />
      {modal && <LocationFormModal location={modal.location} onClose={close} />}
    </PageShell>
  );
}
