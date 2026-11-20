import { useState } from "react";
import { Skeleton } from "@mui/material";
import { Button, Select, SelectItem, TabsView, TextInput } from "../../components/ui/fields";
import { EmptyState } from "../../components/illustrations/EmptyState";
import { PageShell } from "../../components/ui/PageShell";
import { SimpleTable } from "../../components/ui/SimpleTable";
import { FormModal } from "../../components/ui/FormModal";
import { StatusTag, fmtClock, fmtDate, fmtDateTime, fmtHours, fmtTime, todayISO, emptyToNull } from "../../components/ui/format";
import { useFormState } from "../../components/ui/useFormState";
import { errorMessage } from "../../api/helpers";
import { usePermissions } from "../../api/auth-api";
import { useEmployees } from "../../api/employees-api";
import {
  useTodayAttendance,
  usePunch,
  useAttendanceHistory,
  useTeamAttendance,
  useManualPunch,
} from "../../api/attendance-api";
import { toast } from "react-toastify";

const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);

const recordColumns = (withEmployee) => [
  { key: "date", header: "Date", render: (r) => fmtDate(r.date) },
  ...(withEmployee
    ? [{ key: "employeeName", header: "Employee", render: (r) => `${r.employeeName ?? "—"} (${r.empCode ?? ""})` }]
    : []),
  { key: "status", header: "Status", render: (r) => <StatusTag value={r.status} /> },
  { key: "firstPunchIn", header: "In", render: (r) => fmtTime(r.firstPunchIn) },
  { key: "lastPunchOut", header: "Out", render: (r) => fmtTime(r.lastPunchOut) },
  { key: "workedHours", header: "Worked", render: (r) => fmtHours(r.workedHours) },
  { key: "isRegularized", header: "Regularized", render: (r) => (r.isRegularized ? "Yes" : "") },
];

/** Resolve the browser position (needed when the employee has a geofenced office). */
function getPosition() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Location is not available in this browser"));
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => reject(new Error("Location permission is required to punch at a geofenced office")),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

function TodayTab() {
  const { data, isLoading, error } = useTodayAttendance();
  const punch = usePunch();

  const doPunch = async () => {
    try {
      const position = data?.officeLocationId ? await getPosition() : {};
      punch.mutate({ punchType: data.nextPunch, ...position });
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (error)
    return (
      <div className="hr-card">
        <EmptyState
          compact
          illustration="team"
          title="No attendance profile"
          text={`${errorMessage(error)}. This account may not be linked to an employee record.`}
        />
      </div>
    );

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="hr-grid-2">
        <div className="hr-card hr-stat">
          <div className="label">Status</div>
          <div className="value">{isLoading ? <Skeleton width={90} /> : <StatusTag value={data?.status} />}</div>
        </div>
        <div className="hr-card hr-stat">
          <div className="label">Worked today</div>
          <div className="value">{fmtHours(data?.workedHours)}</div>
        </div>
        <div className="hr-card hr-stat">
          <div className="label">Shift</div>
          <div className="value" style={{ fontSize: "1.1rem" }}>
            {data?.shift ? `${data.shift.name} · ${fmtClock(data.shift.startTime)}–${fmtClock(data.shift.endTime)}` : "—"}
          </div>
        </div>
      </div>

      <div className="hr-card">
        <Button disabled={!data?.nextPunch || punch.isPending} onClick={doPunch}>
          {punch.isPending ? "Punching…" : data?.nextPunch ? `Punch ${data.nextPunch}` : "Punch"}
        </Button>
        {data?.officeLocationId && <span style={{ marginLeft: "1rem", opacity: 0.7 }}>Your location is checked against your office geofence.</span>}
      </div>

      <SimpleTable illustration="clock" emptyTitle="No punches yet today" emptyText="Use the Punch button above to start your day."
        columns={[
          { key: "punchType", header: "Punch", render: (r) => <StatusTag value={r.punchType} /> },
          { key: "punchedAt", header: "Time", render: (r) => fmtDateTime(r.punchedAt) },
          {
            key: "isLocationValid",
            header: "Location",
            render: (r) => (r.isLocationValid === null || r.isLocationValid === undefined ? "—" : r.isLocationValid ? "Valid" : "Outside geofence"),
          },
          { key: "source", header: "Source" },
        ]}
        rows={(data?.punches ?? []).map((p, i) => ({ ...p, id: i }))}
        isLoading={isLoading}
      />
    </div>
  );
}

function HistoryTab() {
  const [range, setRange] = useState({ from: daysAgo(30), to: todayISO() });
  const { data = [], isLoading, error } = useAttendanceHistory(range);
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="hr-toolbar">
        <TextInput id="hist-from" labelText="From" type="date" value={range.from} onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))} />
        <TextInput id="hist-to" labelText="To" type="date" value={range.to} onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))} />
      </div>
      <SimpleTable illustration="clock" emptyTitle="No attendance in this range" emptyText="Try a wider date range." columns={recordColumns(false)} rows={data.map((r) => ({ ...r, id: r.date }))} isLoading={isLoading} error={error} />
    </div>
  );
}

function TeamTab() {
  const [filters, setFilters] = useState({ from: daysAgo(7), to: todayISO(), employeeId: "", status: "" });
  const [paging, setPaging] = useState({ page: 1, pageSize: 20 });
  const { data: people } = useEmployees({ pageSize: 100 });
  const { data, isLoading, error } = useTeamAttendance({ ...filters, ...paging });
  const change = (k) => (e) => {
    setFilters((f) => ({ ...f, [k]: e.target.value }));
    setPaging((p) => ({ ...p, page: 1 }));
  };

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="hr-toolbar">
        <TextInput id="team-from" labelText="From" type="date" value={filters.from} onChange={change("from")} />
        <TextInput id="team-to" labelText="To" type="date" value={filters.to} onChange={change("to")} />
        <Select id="team-emp" labelText="Employee" value={filters.employeeId} onChange={change("employeeId")}>
          <SelectItem value="" text="Everyone" />
          {(people?.items ?? []).map((p) => (
            <SelectItem key={p.id} value={p.id} text={p.name} />
          ))}
        </Select>
        <TextInput id="team-status" labelText="Status" placeholder="e.g. present" value={filters.status} onChange={change("status")} />
      </div>
      <SimpleTable illustration="team" emptyTitle="No attendance records" emptyText="Adjust the dates or filters."
        columns={recordColumns(true)}
        rows={(data?.items ?? []).map((r) => ({ ...r, id: `${r.employeeId}-${r.date}` }))}
        isLoading={isLoading}
        error={error}
        paging={{ ...paging, totalItems: data?.totalCount ?? 0, onChange: setPaging }}
      />
    </div>
  );
}

function ManualPunchModal({ onClose }) {
  const { data: people } = useEmployees({ pageSize: 100, status: "active" });
  const manual = useManualPunch();
  const [form, set] = useFormState({ employeeId: "", punchType: "in", date: todayISO(), time: "09:00", notes: "" });
  return (
    <FormModal
      open
      title="Manual punch (HR correction)"
      isSubmitting={manual.isPending}
      submitDisabled={!form.employeeId || !form.date || !form.time}
      onClose={onClose}
      onSubmit={() =>
        manual.mutate(
          { ...form, time: form.time.length === 5 ? `${form.time}:00` : form.time, notes: emptyToNull(form.notes) },
          { onSuccess: onClose }
        )
      }
    >
      <Select id="mp-emp" className="full" labelText="Employee" value={form.employeeId} onChange={set("employeeId")}>
        <SelectItem value="" text="Select employee" />
        {(people?.items ?? []).map((p) => (
          <SelectItem key={p.id} value={p.id} text={`${p.name} (${p.empCode})`} />
        ))}
      </Select>
      <Select id="mp-type" labelText="Punch type" value={form.punchType} onChange={set("punchType")}>
        <SelectItem value="in" text="In" />
        <SelectItem value="out" text="Out" />
      </Select>
      <TextInput id="mp-date" labelText="Date" type="date" max={todayISO()} value={form.date} onChange={set("date")} />
      <TextInput id="mp-time" labelText="Time" type="time" value={form.time} onChange={set("time")} />
      <TextInput id="mp-notes" className="full" labelText="Notes" value={form.notes} onChange={set("notes")} />
    </FormModal>
  );
}

export function Attendance() {
  const { canAny, can } = usePermissions();
  const [manualOpen, setManualOpen] = useState(false);
  const showTeam = canAny("attendance", ["view_team", "view_all"]);

  return (
    <PageShell
      title="Attendance"
      description="Punch in and out, review your history and, if allowed, your team's attendance."
      actions={
        can("attendance", "correct") && (
          <Button kind="tertiary" onClick={() => setManualOpen(true)}>
            Manual punch
          </Button>
        )
      }
    >
      <TabsView
        tabs={[
          { label: "Today", content: <TodayTab /> },
          { label: "My history", content: <HistoryTab /> },
          showTeam && { label: "Team", content: <TeamTab /> },
        ]}
      />
      {manualOpen && <ManualPunchModal onClose={() => setManualOpen(false)} />}
    </PageShell>
  );
}
