import { useState } from "react";
import { RowActions } from "../../components/ui/RowActions";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import { Button, Checkbox, Select, SelectItem, TextArea, TextInput } from "../../components/ui/fields";
import Add from "@mui/icons-material/Add";
import { PageShell } from "../../components/ui/PageShell";
import { SimpleTable } from "../../components/ui/SimpleTable";
import { FormModal } from "../../components/ui/FormModal";
import { StatusTag, fmtClock, fmtDate, fmtTime, todayISO, emptyToNull } from "../../components/ui/format";
import { useFormState } from "../../components/ui/useFormState";
import { usePermissions } from "../../api/auth-api";
import {
  useMispunchRequests,
  useCreateMispunch,
  useApproveMispunch,
  useRejectMispunch,
} from "../../api/mispunch-api";

const withSeconds = (t) => (t && t.length === 5 ? `${t}:00` : t || null);

function RaiseModal({ onClose }) {
  const create = useCreateMispunch();
  const [form, set] = useFormState({ date: todayISO(), requestedInTime: "", requestedOutTime: "", reason: "" });
  return (
    <FormModal
      open
      title="Raise a punch correction"
      submitText="Submit request"
      isSubmitting={create.isPending}
      submitDisabled={!form.date || (!form.requestedInTime && !form.requestedOutTime)}
      onClose={onClose}
      onSubmit={() =>
        create.mutate(
          {
            date: form.date,
            requestedInTime: withSeconds(form.requestedInTime),
            requestedOutTime: withSeconds(form.requestedOutTime),
            reason: emptyToNull(form.reason),
          },
          { onSuccess: onClose }
        )
      }
    >
      <TextInput id="mr-date" className="full" labelText="Date" type="date" max={todayISO()} value={form.date} onChange={set("date")} />
      <TextInput id="mr-in" labelText="Correct in time" type="time" value={form.requestedInTime} onChange={set("requestedInTime")} />
      <TextInput id="mr-out" labelText="Correct out time" type="time" value={form.requestedOutTime} onChange={set("requestedOutTime")} />
      <TextArea id="mr-reason" className="full" rows={3} labelText="Reason" value={form.reason} onChange={set("reason")} />
    </FormModal>
  );
}

function DecisionModal({ request, action, onClose }) {
  const approve = useApproveMispunch();
  const reject = useRejectMispunch();
  const mutation = action === "approve" ? approve : reject;
  const [remarks, setRemarks] = useState("");
  return (
    <FormModal
      open
      danger={action === "reject"}
      title={`${action === "approve" ? "Approve" : "Reject"} correction — ${request.employeeName}`}
      submitText={action === "approve" ? "Approve" : "Reject"}
      isSubmitting={mutation.isPending}
      submitDisabled={action === "reject" && !remarks.trim()}
      onClose={onClose}
      onSubmit={() => mutation.mutate({ id: request.id, remarks: emptyToNull(remarks) }, { onSuccess: onClose })}
    >
      <p className="full">
        {fmtDate(request.requestDate)}: in {fmtClock(request.requestedInTime)} / out {fmtClock(request.requestedOutTime)}
      </p>
      <TextArea
        id="md-remarks"
        className="full"
        rows={3}
        labelText={action === "reject" ? "Remarks (required)" : "Remarks (optional)"}
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
      />
    </FormModal>
  );
}

export function Mispunch() {
  const { canAny } = usePermissions();
  const [filters, setFilters] = useState({ status: "pending", own: false });
  const [paging, setPaging] = useState({ page: 1, pageSize: 20 });
  const [modal, setModal] = useState(null);
  const { data, isLoading, error } = useMispunchRequests({ ...filters, ...paging });
  const canDecide = canAny("mispunch", ["approve_team", "approve_all"]);
  const canRaise = canAny("mispunch", ["raise"]);
  const canSeeOthers = canAny("mispunch", ["view_team", "view_all"]);

  const reset = (patch) => {
    setFilters((f) => ({ ...f, ...patch }));
    setPaging((p) => ({ ...p, page: 1 }));
  };

  const columns = [
    { key: "requestDate", header: "Date", render: (r) => fmtDate(r.requestDate) },
    { key: "employeeName", header: "Employee", render: (r) => `${r.employeeName} (${r.empCode})` },
    { key: "requested", header: "Requested", render: (r) => `${fmtClock(r.requestedInTime)} → ${fmtClock(r.requestedOutTime)}` },
    { key: "current", header: "Current", render: (r) => `${fmtTime(r.currentFirstPunchIn)} → ${fmtTime(r.currentLastPunchOut)}` },
    { key: "reason", header: "Reason" },
    { key: "status", header: "Status", render: (r) => <StatusTag value={r.status} /> },
    { key: "approverRemarks", header: "Remarks" },
    {
      key: "actions",
      header: "",
      render: (r) =>
        canDecide && (
          <RowActions
            actions={[
              { label: "Approve", icon: <CheckCircleOutlined fontSize="small" />, disabled: String(r.status).toLowerCase() === "approved", onClick: () => setModal({ type: "approve", r }) },
              { label: "Reject", icon: <CancelOutlined fontSize="small" />, danger: true, disabled: String(r.status).toLowerCase() !== "pending", onClick: () => setModal({ type: "reject", r }) },
            ]}
          />
        ),
    },
  ];

  return (
    <PageShell
      title="Punch corrections"
      description="Request a fix for a missed or wrong punch. Approved requests become manual punches."
      actions={
        canRaise && (
          <Button renderIcon={Add} onClick={() => setModal({ type: "raise" })}>
            Raise request
          </Button>
        )
      }
    >
      <div className="hr-toolbar">
        <Select id="mp-status" labelText="Status" value={filters.status} onChange={(e) => reset({ status: e.target.value })}>
          <SelectItem value="" text="All" />
          <SelectItem value="pending" text="Pending" />
          <SelectItem value="approved" text="Approved" />
          <SelectItem value="rejected" text="Rejected" />
        </Select>
        {canSeeOthers && (
          <Checkbox id="mp-own" labelText="Only my requests" checked={filters.own} onChange={(_, { checked }) => reset({ own: checked })} />
        )}
      </div>
      <SimpleTable illustration="inbox" emptyTitle="No correction requests" emptyText="Missed a punch? Raise a request and it will show up here."
        columns={columns}
        rows={data?.items}
        isLoading={isLoading}
        error={error}
        paging={{ ...paging, totalItems: data?.totalCount ?? 0, onChange: setPaging }}
      />
      {modal?.type === "raise" && <RaiseModal onClose={() => setModal(null)} />}
      {(modal?.type === "approve" || modal?.type === "reject") && (
        <DecisionModal request={modal.r} action={modal.type} onClose={() => setModal(null)} />
      )}
    </PageShell>
  );
}
