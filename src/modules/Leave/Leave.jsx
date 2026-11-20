import { useEffect, useState } from "react";
import { RowActions } from "../../components/ui/RowActions";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import EventBusyOutlined from "@mui/icons-material/EventBusyOutlined";
import EditOutlined from "@mui/icons-material/EditOutlined";
import PowerSettingsNewOutlined from "@mui/icons-material/PowerSettingsNewOutlined";
import { Button, Checkbox, NumberInput, Select, SelectItem, TextArea, TextInput, TabsView } from "../../components/ui/fields";
import Add from "@mui/icons-material/Add";
import { EmptyState } from "../../components/illustrations/EmptyState";
import { PageShell } from "../../components/ui/PageShell";
import { SimpleTable } from "../../components/ui/SimpleTable";
import { FormModal } from "../../components/ui/FormModal";
import { StatusTag, fmtDate, todayISO, emptyToNull } from "../../components/ui/format";
import { useFormState } from "../../components/ui/useFormState";
import { errorMessage } from "../../api/helpers";
import { usePermissions } from "../../api/auth-api";
import { useEmployees } from "../../api/employees-api";
import {
  useLeaveTypes,
  useCreateLeaveType,
  useUpdateLeaveType,
  useSetLeaveTypeStatus,
  useLeaveBalance,
  useAdjustBalance,
  useLeaveApplications,
  useApplyLeave,
  useApproveLeave,
  useRejectLeave,
  useCancelLeave,
} from "../../api/leave-api";

/* ───────── apply ───────── */
function ApplyModal({ onClose }) {
  const { data: types = [] } = useLeaveTypes(false);
  const apply = useApplyLeave();
  const [form, set] = useFormState({ leaveTypeId: "", fromDate: todayISO(), toDate: todayISO(), isHalfDay: false, reason: "" });
  const type = types.find((t) => t.id === form.leaveTypeId);
  return (
    <FormModal
      open
      title="Apply for leave"
      submitText="Submit"
      isSubmitting={apply.isPending}
      submitDisabled={!form.leaveTypeId || !form.fromDate || !form.toDate}
      onClose={onClose}
      onSubmit={() => apply.mutate({ ...form, reason: emptyToNull(form.reason) }, { onSuccess: onClose })}
    >
      <Select id="lv-type" className="full" labelText="Leave type" value={form.leaveTypeId} onChange={set("leaveTypeId")}>
        <SelectItem value="" text="Select leave type" />
        {types.map((t) => (
          <SelectItem key={t.id} value={t.id} text={t.name} />
        ))}
      </Select>
      <TextInput id="lv-from" labelText="From" type="date" value={form.fromDate} onChange={set("fromDate")} />
      <TextInput id="lv-to" labelText="To" type="date" value={form.toDate} onChange={set("toDate")} />
      <Checkbox
        id="lv-half"
        className="full"
        labelText="Half day"
        checked={form.isHalfDay}
        disabled={type && !type.allowHalfDay}
        onChange={(_, { checked }) => set("isHalfDay")(checked)}
      />
      <TextArea id="lv-reason" className="full" labelText="Reason" rows={3} value={form.reason} onChange={set("reason")} />
    </FormModal>
  );
}

/* ───────── decision (approve / reject) ───────── */
function DecisionModal({ application, action, onClose }) {
  const approve = useApproveLeave();
  const reject = useRejectLeave();
  const mutation = action === "approve" ? approve : reject;
  const [remarks, setRemarks] = useState("");
  return (
    <FormModal
      open
      danger={action === "reject"}
      title={`${action === "approve" ? "Approve" : "Reject"} leave — ${application.employeeName}`}
      submitText={action === "approve" ? "Approve" : "Reject"}
      isSubmitting={mutation.isPending}
      submitDisabled={action === "reject" && !remarks.trim()}
      onClose={onClose}
      onSubmit={() => mutation.mutate({ id: application.id, remarks: emptyToNull(remarks) }, { onSuccess: onClose })}
    >
      <p className="full">
        {application.leaveTypeName}: {fmtDate(application.fromDate)} – {fmtDate(application.toDate)} ({application.daysCount} day(s))
      </p>
      <TextArea
        id="lv-remarks"
        className="full"
        rows={3}
        labelText={action === "reject" ? "Remarks (required)" : "Remarks (optional)"}
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />
    </FormModal>
  );
}

const applicationColumns = (withEmployee, actions) => [
  ...(withEmployee ? [{ key: "employeeName", header: "Employee", render: (r) => `${r.employeeName} (${r.empCode})` }] : []),
  { key: "leaveTypeName", header: "Type" },
  { key: "dates", header: "Dates", render: (r) => `${fmtDate(r.fromDate)} – ${fmtDate(r.toDate)}${r.isHalfDay ? " (half)" : ""}` },
  { key: "daysCount", header: "Days" },
  { key: "reason", header: "Reason" },
  { key: "status", header: "Status", render: (r) => <StatusTag value={r.status} /> },
  { key: "approverRemarks", header: "Remarks" },
  { key: "actions", header: "", render: actions },
];

/* ───────── my leave ───────── */
function MyLeaveTab() {
  const [year] = useState(new Date().getFullYear());
  const [paging, setPaging] = useState({ page: 1, pageSize: 10 });
  const [applyOpen, setApplyOpen] = useState(false);
  const { data: balance, error: balanceError } = useLeaveBalance({ year });
  const { data, isLoading, error } = useLeaveApplications({ own: true, ...paging });
  const cancel = useCancelLeave();

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div>
        <Button renderIcon={Add} onClick={() => setApplyOpen(true)}>
          Apply for leave
        </Button>
      </div>
      {balanceError ? (
        <div className="hr-card">
          <EmptyState compact illustration="team" title="Leave balance unavailable" text={errorMessage(balanceError)} />
        </div>
      ) : (
        <div className="hr-grid-2">
          {(balance?.balances ?? []).map((b) => (
            <div className="hr-card hr-stat" key={b.leaveTypeId}>
              <div className="label">{b.leaveTypeName}</div>
              <div className="value">{b.remaining}</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                {b.used} used of {b.total}
                {b.carriedForward ? ` · ${b.carriedForward} carried` : ""}
              </div>
            </div>
          ))}
        </div>
      )}
      <SimpleTable illustration="calendar" emptyTitle="No leave applications" emptyText="When you apply for leave it will show up here."
        columns={applicationColumns(false, (r) =>
          ["pending", "approved"].includes(String(r.status).toLowerCase()) && (
            <RowActions actions={[{ label: "Cancel leave", icon: <EventBusyOutlined fontSize="small" />, danger: true, disabled: cancel.isPending, onClick: () => cancel.mutate({ id: r.id }) }]} />
          )
        )}
        rows={data?.items}
        isLoading={isLoading}
        error={error}
        paging={{ ...paging, totalItems: data?.totalCount ?? 0, onChange: setPaging }}
      />
      {applyOpen && <ApplyModal onClose={() => setApplyOpen(false)} />}
    </div>
  );
}

/* ───────── approvals ───────── */
function ApprovalsTab() {
  const { canAny } = usePermissions();
  const [status, setStatus] = useState("pending");
  const [paging, setPaging] = useState({ page: 1, pageSize: 20 });
  const [modal, setModal] = useState(null);
  const { data, isLoading, error } = useLeaveApplications({ status, ...paging });
  const cancel = useCancelLeave();
  const canDecide = canAny("leave", ["approve_team", "approve_all"]);

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="hr-toolbar">
        <Select
          id="ap-status"
          labelText="Status"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPaging((p) => ({ ...p, page: 1 }));
          }}
        >
          <SelectItem value="" text="All" />
          <SelectItem value="pending" text="Pending" />
          <SelectItem value="approved" text="Approved" />
          <SelectItem value="rejected" text="Rejected" />
          <SelectItem value="cancelled" text="Cancelled" />
        </Select>
      </div>
      <SimpleTable illustration="inbox" emptyTitle="All caught up" emptyText="No leave requests match this filter."
        columns={applicationColumns(true, (r) => (
          <RowActions
            actions={[
              canDecide && { label: "Approve", icon: <CheckCircleOutlined fontSize="small" />, disabled: String(r.status).toLowerCase() === "approved", onClick: () => setModal({ r, action: "approve" }) },
              canDecide && { label: "Reject", icon: <CancelOutlined fontSize="small" />, danger: true, disabled: String(r.status).toLowerCase() === "rejected", onClick: () => setModal({ r, action: "reject" }) },
              canAny("leave", ["approve_all"]) && ["pending", "approved"].includes(String(r.status).toLowerCase()) && { label: "Cancel leave", icon: <EventBusyOutlined fontSize="small" />, onClick: () => cancel.mutate({ id: r.id }) },
            ]}
          />
        ))}
        rows={data?.items}
        isLoading={isLoading}
        error={error}
        paging={{ ...paging, totalItems: data?.totalCount ?? 0, onChange: setPaging }}
      />
      {modal && <DecisionModal application={modal.r} action={modal.action} onClose={() => setModal(null)} />}
    </div>
  );
}

/* ───────── leave types ───────── */
function LeaveTypeModal({ type, onClose }) {
  const create = useCreateLeaveType();
  const update = useUpdateLeaveType();
  const [form, set, setForm] = useFormState({
    name: "",
    annualLimit: 12,
    isPaid: true,
    carryForwardLimit: 0,
    accrualType: "upfront",
    minNoticeDays: 0,
    allowHalfDay: true,
  });
  useEffect(() => {
    if (type) setForm({ ...type });
  }, [type, setForm]);

  const submit = () => {
    const body = {
      name: form.name,
      annualLimit: Number(form.annualLimit),
      isPaid: form.isPaid,
      carryForwardLimit: Number(form.carryForwardLimit),
      accrualType: form.accrualType,
      minNoticeDays: Number(form.minNoticeDays),
      allowHalfDay: form.allowHalfDay,
    };
    if (type) update.mutate({ id: type.id, body }, { onSuccess: onClose });
    else create.mutate(body, { onSuccess: onClose });
  };

  return (
    <FormModal
      open
      title={type ? "Edit leave type" : "New leave type"}
      isSubmitting={create.isPending || update.isPending}
      submitDisabled={!form.name.trim()}
      onClose={onClose}
      onSubmit={submit}
    >
      <TextInput id="lt-name" className="full" labelText="Name" value={form.name} onChange={set("name")} />
      <NumberInput id="lt-limit" label="Annual limit (days)" min={0} step={0.5} value={form.annualLimit} onChange={(_, { value }) => set("annualLimit")(value)} />
      <NumberInput id="lt-cf" label="Carry-forward limit" min={0} step={0.5} value={form.carryForwardLimit} onChange={(_, { value }) => set("carryForwardLimit")(value)} />
      <NumberInput id="lt-notice" label="Minimum notice (days)" min={0} value={form.minNoticeDays} onChange={(_, { value }) => set("minNoticeDays")(value)} />
      <TextInput id="lt-accrual" labelText="Accrual type" placeholder="e.g. upfront" value={form.accrualType ?? ""} onChange={set("accrualType")} />
      <Checkbox id="lt-paid" labelText="Paid leave" checked={!!form.isPaid} onChange={(_, { checked }) => set("isPaid")(checked)} />
      <Checkbox id="lt-half" labelText="Allow half day" checked={!!form.allowHalfDay} onChange={(_, { checked }) => set("allowHalfDay")(checked)} />
    </FormModal>
  );
}

function TypesTab() {
  const { data = [], isLoading, error } = useLeaveTypes(true);
  const setStatus = useSetLeaveTypeStatus();
  const [modal, setModal] = useState(null);
  const columns = [
    { key: "name", header: "Leave type", render: (r) => <strong>{r.name}</strong> },
    { key: "annualLimit", header: "Annual limit" },
    { key: "isPaid", header: "Paid", render: (r) => (r.isPaid ? "Yes" : "No") },
    { key: "carryForwardLimit", header: "Carry forward" },
    { key: "accrualType", header: "Accrual" },
    { key: "minNoticeDays", header: "Notice (days)" },
    { key: "allowHalfDay", header: "Half day", render: (r) => (r.allowHalfDay ? "Yes" : "No") },
    { key: "isActive", header: "Status", render: (r) => <StatusTag value={r.isActive ? "Active" : "Inactive"} /> },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <RowActions
          actions={[
            { label: "Edit", icon: <EditOutlined fontSize="small" />, onClick: () => setModal({ type: r }) },
            { label: r.isActive ? "Deactivate" : "Activate", icon: <PowerSettingsNewOutlined fontSize="small" />, danger: r.isActive, onClick: () => setStatus.mutate({ id: r.id, isActive: !r.isActive }) },
          ]}
        />
      ),
    },
  ];
  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div>
        <Button renderIcon={Add} onClick={() => setModal({})}>
          New leave type
        </Button>
      </div>
      <SimpleTable illustration="calendar" emptyTitle="No leave types" emptyText="Create leave types so employees can apply." columns={columns} rows={data} isLoading={isLoading} error={error} />
      {modal && <LeaveTypeModal type={modal.type} onClose={() => setModal(null)} />}
    </div>
  );
}

/* ───────── balances (HR) ───────── */
function AdjustModal({ employeeId, year, types, onClose }) {
  const adjust = useAdjustBalance();
  const [form, set] = useFormState({ leaveTypeId: "", delta: 1, reason: "" });
  return (
    <FormModal
      open
      title="Adjust leave balance"
      isSubmitting={adjust.isPending}
      submitDisabled={!form.leaveTypeId || !Number(form.delta) || !form.reason.trim()}
      onClose={onClose}
      onSubmit={() => adjust.mutate({ employeeId, year, ...form, delta: Number(form.delta) }, { onSuccess: onClose })}
    >
      <Select id="adj-type" className="full" labelText="Leave type" value={form.leaveTypeId} onChange={set("leaveTypeId")}>
        <SelectItem value="" text="Select leave type" />
        {types.map((t) => (
          <SelectItem key={t.id} value={t.id} text={t.name} />
        ))}
      </Select>
      <NumberInput id="adj-delta" label="Delta (days, negative to deduct)" step={0.5} value={form.delta} onChange={(_, { value }) => set("delta")(value)} />
      <TextInput id="adj-reason" labelText="Reason (required)" value={form.reason} onChange={set("reason")} />
    </FormModal>
  );
}

function BalancesTab() {
  const year = new Date().getFullYear();
  const { data: people } = useEmployees({ pageSize: 100, status: "active" });
  const { data: types = [] } = useLeaveTypes(false);
  const { can } = usePermissions();
  const [employeeId, setEmployeeId] = useState("");
  const [adjustOpen, setAdjustOpen] = useState(false);
  const { data, isLoading, error } = useLeaveBalance({ employeeId, year }, !!employeeId);

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div className="hr-toolbar">
        <Select id="bal-emp" labelText="Employee" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}>
          <SelectItem value="" text="Select employee" />
          {(people?.items ?? []).map((p) => (
            <SelectItem key={p.id} value={p.id} text={`${p.name} (${p.empCode})`} />
          ))}
        </Select>
        {can("leave", "override_balance") && (
          <Button kind="tertiary" disabled={!employeeId} onClick={() => setAdjustOpen(true)}>
            Adjust balance
          </Button>
        )}
      </div>
      {employeeId && (
        <SimpleTable illustration="calendar" emptyTitle="Pick an employee" emptyText="Their leave balances will appear here."
          columns={[
            { key: "leaveTypeName", header: "Leave type" },
            { key: "total", header: "Total" },
            { key: "used", header: "Used" },
            { key: "remaining", header: "Remaining" },
            { key: "carriedForward", header: "Carried forward" },
          ]}
          rows={(data?.balances ?? []).map((b) => ({ ...b, id: b.leaveTypeId }))}
          isLoading={isLoading}
          error={error}
        />
      )}
      {adjustOpen && <AdjustModal employeeId={employeeId} year={year} types={types} onClose={() => setAdjustOpen(false)} />}
    </div>
  );
}

export function Leave() {
  const { canAny } = usePermissions();
  const showApprovals = canAny("leave", ["view_team", "view_all", "approve_team", "approve_all"]);
  const showBalances = canAny("leave", ["view_team", "view_all"]);
  const showTypes = canAny("leave", ["configure"]);

  return (
    <PageShell title="Leave" description="Apply for leave, review requests and manage leave policy.">
      <TabsView
        tabs={[
          { label: "My leave", content: <MyLeaveTab /> },
          showApprovals && { label: "Requests", content: <ApprovalsTab /> },
          showBalances && { label: "Balances", content: <BalancesTab /> },
          showTypes && { label: "Leave types", content: <TypesTab /> },
        ]}
      />
    </PageShell>
  );
}
