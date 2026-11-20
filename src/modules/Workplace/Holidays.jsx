import { useEffect, useState } from "react";
import { RowActions } from "../../components/ui/RowActions";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { Button, NumberInput, TextArea, TextInput } from "../../components/ui/fields";
import Add from "@mui/icons-material/Add";
import Upload from "@mui/icons-material/Upload";
import { PageShell } from "../../components/ui/PageShell";
import { SimpleTable } from "../../components/ui/SimpleTable";
import { FormModal } from "../../components/ui/FormModal";
import { fmtDate, emptyToNull } from "../../components/ui/format";
import { useFormState } from "../../components/ui/useFormState";
import { usePermissions } from "../../api/auth-api";
import {
  useHolidays,
  useCreateHoliday,
  useUpdateHoliday,
  useDeleteHoliday,
  useBulkHolidays,
} from "../../api/workplace-api";

function HolidayFormModal({ holiday, onClose }) {
  const create = useCreateHoliday();
  const update = useUpdateHoliday();
  const [form, set, setForm] = useFormState({ name: "", date: "", type: "" });

  useEffect(() => {
    if (holiday) setForm({ name: holiday.name, date: holiday.date?.slice(0, 10), type: holiday.type ?? "" });
  }, [holiday, setForm]);

  const submit = () => {
    const body = { name: form.name, date: form.date, type: emptyToNull(form.type) };
    if (holiday) update.mutate({ id: holiday.id, body }, { onSuccess: onClose });
    else create.mutate(body, { onSuccess: onClose });
  };

  return (
    <FormModal
      open
      title={holiday ? "Edit holiday" : "Add holiday"}
      isSubmitting={create.isPending || update.isPending}
      submitDisabled={!form.name.trim() || !form.date}
      onClose={onClose}
      onSubmit={submit}
    >
      <TextInput id="hol-name" className="full" labelText="Name" value={form.name} onChange={set("name")} />
      <TextInput id="hol-date" labelText="Date" type="date" value={form.date} onChange={set("date")} />
      <TextInput id="hol-type" labelText="Type" placeholder="e.g. public" value={form.type} onChange={set("type")} />
    </FormModal>
  );
}

/** Bulk upload: one holiday per line as `YYYY-MM-DD, Name[, type]`. */
function BulkModal({ onClose }) {
  const bulk = useBulkHolidays();
  const [text, setText] = useState("");

  const parse = () =>
    text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [date, name, type] = line.split(",").map((s) => s.trim());
        return { date, name, type: type || null };
      });

  const rows = parse();
  const valid = rows.length > 0 && rows.every((r) => /^\d{4}-\d{2}-\d{2}$/.test(r.date) && r.name);

  return (
    <FormModal
      open
      title="Upload holiday list"
      submitText="Upload"
      isSubmitting={bulk.isPending}
      submitDisabled={!valid}
      onClose={onClose}
      onSubmit={() => bulk.mutate(rows, { onSuccess: onClose })}
    >
      <TextArea
        id="bulk-text"
        className="full"
        rows={8}
        labelText="One per line: YYYY-MM-DD, Name, optional type"
        helperText="All-or-nothing: any existing or repeated date rejects the whole upload."
        placeholder={"2027-01-26, Republic Day, public\n2027-08-15, Independence Day, public"}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span className="full">{rows.length} holiday(s) parsed{!valid && rows.length > 0 ? " — check the format" : ""}</span>
    </FormModal>
  );
}

export function Holidays() {
  const { can } = usePermissions();
  const [year, setYear] = useState(new Date().getFullYear());
  const { data = [], isLoading, error } = useHolidays(year);
  const remove = useDeleteHoliday();
  const [modal, setModal] = useState(null);
  const canConfigure = can("attendance", "configure");
  const close = () => setModal(null);

  const columns = [
    { key: "date", header: "Date", render: (r) => fmtDate(r.date) },
    { key: "name", header: "Holiday", render: (r) => <strong>{r.name}</strong> },
    { key: "type", header: "Type" },
    {
      key: "actions",
      header: "",
      render: (r) =>
        canConfigure && (
          <RowActions
            actions={[
              { label: "Edit", icon: <EditOutlined fontSize="small" />, onClick: () => setModal({ type: "edit", holiday: r }) },
              { label: "Delete", icon: <DeleteOutlined fontSize="small" />, danger: true, onClick: () => setModal({ type: "delete", holiday: r }) },
            ]}
          />
        ),
    },
  ];

  return (
    <PageShell
      title="Holiday calendar"
      description="Holidays are excluded when leave days and attendance status are calculated."
      actions={
        canConfigure && (
          <>
            <Button kind="tertiary" renderIcon={Upload} onClick={() => setModal({ type: "bulk" })}>
              Upload list
            </Button>
            <Button renderIcon={Add} onClick={() => setModal({ type: "create" })}>
              Add holiday
            </Button>
          </>
        )
      }
    >
      <div className="hr-toolbar">
        <NumberInput id="hol-year" label="Year" min={2000} max={2100} value={year} onChange={(_, { value }) => setYear(Number(value))} />
      </div>
      <SimpleTable illustration="calendar" emptyTitle="No holidays for this year" emptyText="Add holidays so they are excluded from leave and attendance." columns={columns} rows={data} isLoading={isLoading} error={error} />
      {modal?.type === "create" && <HolidayFormModal onClose={close} />}
      {modal?.type === "edit" && <HolidayFormModal holiday={modal.holiday} onClose={close} />}
      {modal?.type === "bulk" && <BulkModal onClose={close} />}
      {modal?.type === "delete" && (
        <FormModal
          open
          danger
          title={`Delete ${modal.holiday.name}?`}
          submitText="Delete"
          isSubmitting={remove.isPending}
          onClose={close}
          onSubmit={() => remove.mutate(modal.holiday.id, { onSuccess: close })}
        >
          <p className="full">{fmtDate(modal.holiday.date)} will no longer be a holiday.</p>
        </FormModal>
      )}
    </PageShell>
  );
}
