import { useEffect, useState } from "react";
import { RowActions } from "../../components/ui/RowActions";
import EditOutlined from "@mui/icons-material/EditOutlined";
import DriveFileMoveOutlined from "@mui/icons-material/DriveFileMoveOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import { Button, Checkbox, Select, SelectItem, TextInput } from "../../components/ui/fields";
import Add from "@mui/icons-material/Add";
import { PageShell } from "../../components/ui/PageShell";
import { SimpleTable } from "../../components/ui/SimpleTable";
import { FormModal } from "../../components/ui/FormModal";
import { emptyToNull } from "../../components/ui/format";
import { useFormState } from "../../components/ui/useFormState";
import { usePermissions } from "../../api/auth-api";
import { useEmployees } from "../../api/employees-api";
import {
  useDepartments,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
  useReassignEmployees,
} from "../../api/departments-api";

function DepartmentFormModal({ department, departments, onClose }) {
  const isEdit = !!department;
  const create = useCreateDepartment();
  const update = useUpdateDepartment();
  const { data: people } = useEmployees({ pageSize: 100, status: "active" });
  const [form, set, setForm] = useFormState({ name: "", parentDepartmentId: "", headEmployeeId: "" });

  useEffect(() => {
    if (department) {
      setForm({
        name: department.name ?? "",
        parentDepartmentId: department.parentDepartmentId ?? "",
        headEmployeeId: department.headEmployeeId ?? "",
      });
    }
  }, [department, setForm]);

  const submit = () => {
    const body = {
      name: form.name,
      parentDepartmentId: emptyToNull(form.parentDepartmentId),
      headEmployeeId: emptyToNull(form.headEmployeeId),
    };
    if (isEdit) update.mutate({ id: department.id, body }, { onSuccess: onClose });
    else create.mutate(body, { onSuccess: onClose });
  };

  return (
    <FormModal
      open
      title={isEdit ? "Edit department" : "New department"}
      isSubmitting={create.isPending || update.isPending}
      submitDisabled={!form.name.trim()}
      onClose={onClose}
      onSubmit={submit}
    >
      <TextInput id="dept-name" className="full" labelText="Name" value={form.name} onChange={set("name")} required />
      <Select id="dept-parent" labelText="Parent department" value={form.parentDepartmentId} onChange={set("parentDepartmentId")}>
        <SelectItem value="" text="None (top level)" />
        {departments
          .filter((d) => d.id !== department?.id)
          .map((d) => (
            <SelectItem key={d.id} value={d.id} text={d.name} />
          ))}
      </Select>
      <Select id="dept-head" labelText="Head of department" value={form.headEmployeeId} onChange={set("headEmployeeId")}>
        <SelectItem value="" text="None" />
        {(people?.items ?? []).map((p) => (
          <SelectItem key={p.id} value={p.id} text={`${p.name} (${p.empCode})`} />
        ))}
      </Select>
    </FormModal>
  );
}

function ReassignModal({ department, departments, onClose }) {
  const { data: people, isLoading } = useEmployees({ departmentId: department.id, pageSize: 100 });
  const reassign = useReassignEmployees();
  const [toDepartmentId, setTo] = useState("");
  const [selected, setSelected] = useState([]);
  const items = people?.items ?? [];

  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <FormModal
      open
      title={`Move employees out of ${department.name}`}
      submitText="Move"
      isSubmitting={reassign.isPending}
      submitDisabled={!toDepartmentId || selected.length === 0}
      onClose={onClose}
      onSubmit={() =>
        reassign.mutate({ id: department.id, toDepartmentId, employeeIds: selected }, { onSuccess: onClose })
      }
    >
      <Select id="reassign-to" className="full" labelText="Destination department" value={toDepartmentId} onChange={(e) => setTo(e.target.value)}>
        <SelectItem value="" text="Select destination" />
        {departments
          .filter((d) => d.id !== department.id)
          .map((d) => (
            <SelectItem key={d.id} value={d.id} text={d.name} />
          ))}
      </Select>
      <div className="full">
        {isLoading ? (
          "Loading…"
        ) : items.length === 0 ? (
          "No employees in this department."
        ) : (
          items.map((p) => (
            <Checkbox
              key={p.id}
              id={`re-${p.id}`}
              labelText={`${p.name} (${p.empCode})`}
              checked={selected.includes(p.id)}
              onChange={() => toggle(p.id)}
            />
          ))
        )}
      </div>
    </FormModal>
  );
}

export function Departments() {
  const { can } = usePermissions();
  const { data = [], isLoading, error } = useDepartments();
  const remove = useDeleteDepartment();
  const [modal, setModal] = useState(null);
  const canManage = can("departments", "manage");
  const close = () => setModal(null);

  const columns = [
    { key: "name", header: "Department", render: (r) => <strong>{r.name}</strong> },
    { key: "parentDepartmentName", header: "Parent" },
    { key: "headEmployeeName", header: "Head" },
    { key: "employeeCount", header: "Employees" },
    { key: "childDepartmentCount", header: "Sub-departments" },
    {
      key: "actions",
      header: "",
      render: (r) =>
        canManage && (
          <RowActions
            actions={[
              { label: "Edit", icon: <EditOutlined fontSize="small" />, onClick: () => setModal({ type: "edit", department: r }) },
              { label: "Move people", icon: <DriveFileMoveOutlined fontSize="small" />, disabled: r.employeeCount === 0, onClick: () => setModal({ type: "reassign", department: r }) },
              { label: "Delete", icon: <DeleteOutlined fontSize="small" />, danger: true, onClick: () => setModal({ type: "delete", department: r }) },
            ]}
          />
        ),
    },
  ];

  return (
    <PageShell
      title="Departments"
      description="Company structure. A department can only be deleted when it has no people and no sub-departments."
      actions={
        canManage && (
          <Button renderIcon={Add} onClick={() => setModal({ type: "create" })}>
            New department
          </Button>
        )
      }
    >
      <SimpleTable illustration="building" emptyTitle="No departments yet" emptyText="Create your first department to organise the company." columns={columns} rows={data} isLoading={isLoading} error={error} />

      {modal?.type === "create" && <DepartmentFormModal departments={data} onClose={close} />}
      {modal?.type === "edit" && <DepartmentFormModal department={modal.department} departments={data} onClose={close} />}
      {modal?.type === "reassign" && <ReassignModal department={modal.department} departments={data} onClose={close} />}
      {modal?.type === "delete" && (
        <FormModal
          open
          danger
          title={`Delete ${modal.department.name}?`}
          submitText="Delete"
          isSubmitting={remove.isPending}
          onClose={close}
          onSubmit={() => remove.mutate(modal.department.id, { onSuccess: close })}
        >
          <p className="full">This cannot be undone. Nothing is moved or cascaded.</p>
        </FormModal>
      )}
    </PageShell>
  );
}
