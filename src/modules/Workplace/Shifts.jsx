import { useEffect, useState } from "react";
import { RowActions } from "../../components/ui/RowActions";
import EditOutlined from "@mui/icons-material/EditOutlined";
import GroupAddOutlined from "@mui/icons-material/GroupAddOutlined";
import PowerSettingsNewOutlined from "@mui/icons-material/PowerSettingsNewOutlined";
import { Button, Checkbox, NumberInput, TextInput } from "../../components/ui/fields";
import Add from "@mui/icons-material/Add";
import { PageShell } from "../../components/ui/PageShell";
import { SimpleTable } from "../../components/ui/SimpleTable";
import { FormModal } from "../../components/ui/FormModal";
import { StatusTag, fmtClock, todayISO } from "../../components/ui/format";
import { useFormState } from "../../components/ui/useFormState";
import { usePermissions } from "../../api/auth-api";
import { useEmployees } from "../../api/employees-api";
import {
  useShifts,
  useCreateShift,
  useUpdateShift,
  useSetShiftStatus,
  useAssignShift,
} from "../../api/workplace-api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const withSeconds = (t) => (t && t.length === 5 ? `${t}:00` : t);

function ShiftFormModal({ shift, onClose }) {
  const create = useCreateShift();
  const update = useUpdateShift();
  const [form, set, setForm] = useFormState({
    name: "",
    startTime: "09:00",
    endTime: "18:00",
    endsNextDay: false,
    graceMinutes: 15,
    weeklyOff: ["Saturday", "Sunday"],
  });

  useEffect(() => {
    if (shift) {
      setForm({
        name: shift.name,
        startTime: fmtClock(shift.startTime),
        endTime: fmtClock(shift.endTime),
        endsNextDay: shift.endsNextDay,
        graceMinutes: shift.graceMinutes,
        weeklyOff: shift.weeklyOff ?? [],
      });
    }
  }, [shift, setForm]);

  const toggleDay = (day) =>
    set("weeklyOff")(form.weeklyOff.includes(day) ? form.weeklyOff.filter((d) => d !== day) : [...form.weeklyOff, day]);

  const submit = () => {
    const body = {
      ...form,
      startTime: withSeconds(form.startTime),
      endTime: withSeconds(form.endTime),
      graceMinutes: Number(form.graceMinutes) || 0,
    };
    if (shift) update.mutate({ id: shift.id, body }, { onSuccess: onClose });
    else create.mutate(body, { onSuccess: onClose });
  };

  return (
    <FormModal
      open
      title={shift ? "Edit shift" : "New shift"}
      isSubmitting={create.isPending || update.isPending}
      submitDisabled={!form.name.trim()}
      onClose={onClose}
      onSubmit={submit}
    >
      <TextInput id="shift-name" className="full" labelText="Name" value={form.name} onChange={set("name")} />
      <TextInput id="shift-start" labelText="Start time" type="time" value={form.startTime} onChange={set("startTime")} />
      <TextInput id="shift-end" labelText="End time" type="time" value={form.endTime} onChange={set("endTime")} />
      <Checkbox id="shift-next" labelText="Ends next day (night shift)" checked={form.endsNextDay} onChange={(_, { checked }) => set("endsNextDay")(checked)} />
      <NumberInput
        id="shift-grace"
        label="Grace minutes"
        min={0}
        value={form.graceMinutes}
        onChange={(_, { value }) => set("graceMinutes")(value)}
      />
      <fieldset className="full" style={{ border: 0, padding: 0 }}>
        <legend style={{ fontSize: "0.75rem", marginBottom: "0.5rem" }}>Weekly off days</legend>
        {DAYS.map((d) => (
          <Checkbox key={d} id={`day-${d}`} labelText={d} checked={form.weeklyOff.includes(d)} onChange={() => toggleDay(d)} />
        ))}
      </fieldset>
    </FormModal>
  );
}

function AssignModal({ shift, onClose }) {
  const { data: people } = useEmployees({ pageSize: 100, status: "active" });
  const assign = useAssignShift();
  const [selected, setSelected] = useState([]);
  const [effectiveFrom, setFrom] = useState(todayISO());
  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <FormModal
      open
      title={`Assign “${shift.name}”`}
      submitText="Assign"
      isSubmitting={assign.isPending}
      submitDisabled={selected.length === 0}
      onClose={onClose}
      onSubmit={() => assign.mutate({ id: shift.id, employeeIds: selected, effectiveFrom }, { onSuccess: onClose })}
    >
      <TextInput id="assign-from" className="full" labelText="Effective from" type="date" value={effectiveFrom} onChange={(e) => setFrom(e.target.value)} />
      <div className="full">
        {(people?.items ?? []).map((p) => (
          <Checkbox key={p.id} id={`as-${p.id}`} labelText={`${p.name} (${p.empCode})`} checked={selected.includes(p.id)} onChange={() => toggle(p.id)} />
        ))}
      </div>
    </FormModal>
  );
}

export function Shifts() {
  const { can } = usePermissions();
  const { data = [], isLoading, error } = useShifts(true);
  const setStatus = useSetShiftStatus();
  const [modal, setModal] = useState(null);
  const canConfigure = can("attendance", "configure");
  const close = () => setModal(null);

  const columns = [
    { key: "name", header: "Shift", render: (r) => <strong>{r.name}</strong> },
    {
      key: "time",
      header: "Timing",
      render: (r) => `${fmtClock(r.startTime)} – ${fmtClock(r.endTime)}${r.endsNextDay ? " (+1 day)" : ""}`,
    },
    { key: "graceMinutes", header: "Grace (min)" },
    { key: "weeklyOff", header: "Weekly off", render: (r) => (r.weeklyOff ?? []).join(", ") || "—" },
    { key: "isActive", header: "Status", render: (r) => <StatusTag value={r.isActive ? "Active" : "Inactive"} /> },
    {
      key: "actions",
      header: "",
      render: (r) =>
        canConfigure && (
          <RowActions
            actions={[
              { label: "Edit", icon: <EditOutlined fontSize="small" />, onClick: () => setModal({ type: "edit", shift: r }) },
              { label: "Assign to employees", icon: <GroupAddOutlined fontSize="small" />, disabled: !r.isActive, onClick: () => setModal({ type: "assign", shift: r }) },
              { label: r.isActive ? "Deactivate" : "Activate", icon: <PowerSettingsNewOutlined fontSize="small" />, danger: r.isActive, onClick: () => setStatus.mutate({ id: r.id, isActive: !r.isActive }) },
            ]}
          />
        ),
    },
  ];

  return (
    <PageShell
      title="Shifts"
      description="Working hours, grace period and weekly-off days used to compute attendance."
      actions={
        canConfigure && (
          <Button renderIcon={Add} onClick={() => setModal({ type: "create" })}>
            New shift
          </Button>
        )
      }
    >
      <SimpleTable illustration="clock" emptyTitle="No shifts yet" emptyText="Create a shift to define working hours." columns={columns} rows={data} isLoading={isLoading} error={error} />
      {modal?.type === "create" && <ShiftFormModal onClose={close} />}
      {modal?.type === "edit" && <ShiftFormModal shift={modal.shift} onClose={close} />}
      {modal?.type === "assign" && <AssignModal shift={modal.shift} onClose={close} />}
    </PageShell>
  );
}
