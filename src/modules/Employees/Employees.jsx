import { useEffect, useState } from "react";
import { RowActions } from "../../components/ui/RowActions";
import EditOutlined from "@mui/icons-material/EditOutlined";
import AdminPanelSettingsOutlined from "@mui/icons-material/AdminPanelSettingsOutlined";
import PlaceOutlined from "@mui/icons-material/PlaceOutlined";
import MailOutlineOutlined from "@mui/icons-material/MailOutlineOutlined";
import PersonOffOutlined from "@mui/icons-material/PersonOffOutlined";
import { Button, Search, Select, SelectItem, TextInput } from "../../components/ui/fields";
import Add from "@mui/icons-material/Add";
import { PageShell } from "../../components/ui/PageShell";
import { SimpleTable } from "../../components/ui/SimpleTable";
import { FormModal } from "../../components/ui/FormModal";
import { StatusTag, fmtDate, todayISO, emptyToNull } from "../../components/ui/format";
import { useFormState } from "../../components/ui/useFormState";
import { usePermissions } from "../../api/auth-api";
import { useDepartments } from "../../api/departments-api";
import { useRoles } from "../../api/platform-api";
import { useOfficeLocations } from "../../api/workplace-api";
import {
  useEmployees,
  useEmployee,
  useCreateEmployee,
  useUpdateEmployee,
  useDeactivateEmployee,
  useAssignRole,
  useInviteEmployee,
  useAssignOfficeLocation,
} from "../../api/employees-api";

const EMPTY = {
  name: "",
  email: "",
  departmentId: "",
  managerId: "",
  designation: "",
  joiningDate: todayISO(),
  personalEmail: "",
  phone: "",
  employmentType: "",
  status: "active",
  lastWorkingDate: "",
};

/** Create (id undefined) or edit (id set) an employee. */
function EmployeeFormModal({ id, onClose, departments, managers }) {
  const isEdit = !!id;
  const { data: loaded } = useEmployee(id);
  const create = useCreateEmployee();
  const update = useUpdateEmployee();
  const [form, set, setForm] = useFormState(EMPTY);

  useEffect(() => {
    if (loaded?.data) {
      const e = loaded.data;
      setForm({
        ...EMPTY,
        name: e.name ?? "",
        email: e.email ?? "",
        departmentId: e.departmentId ?? "",
        managerId: e.managerId ?? "",
        designation: e.designation ?? "",
        joiningDate: e.joiningDate?.slice(0, 10) ?? "",
        personalEmail: e.personalEmail ?? "",
        phone: e.phone ?? "",
        employmentType: e.employmentType ?? "",
        status: e.status ?? "active",
        lastWorkingDate: e.lastWorkingDate?.slice(0, 10) ?? "",
      });
    }
  }, [loaded, setForm]);

  const submit = () => {
    const common = {
      name: form.name,
      departmentId: form.departmentId,
      managerId: emptyToNull(form.managerId),
      designation: emptyToNull(form.designation),
      joiningDate: form.joiningDate,
      personalEmail: emptyToNull(form.personalEmail),
      phone: emptyToNull(form.phone),
      employmentType: emptyToNull(form.employmentType),
    };
    if (isEdit) {
      update.mutate(
        {
          id,
          etag: loaded?.etag,
          body: { ...common, status: form.status, lastWorkingDate: emptyToNull(form.lastWorkingDate) },
        },
        { onSuccess: onClose }
      );
    } else {
      create.mutate({ ...common, email: form.email }, { onSuccess: onClose });
    }
  };

  return (
    <FormModal
      open
      title={isEdit ? "Edit employee" : "New employee"}
      submitText={isEdit ? "Save changes" : "Create employee"}
      isSubmitting={create.isPending || update.isPending}
      submitDisabled={!form.name || !form.departmentId || !form.joiningDate || (!isEdit && !form.email)}
      onClose={onClose}
      onSubmit={submit}
    >
      <TextInput id="emp-name" labelText="Full name" value={form.name} onChange={set("name")} required />
      <TextInput
        id="emp-email"
        labelText="Work email"
        type="email"
        value={form.email}
        onChange={set("email")}
        disabled={isEdit}
        required={!isEdit}
      />
      <Select id="emp-dept" labelText="Department" value={form.departmentId} onChange={set("departmentId")}>
        <SelectItem value="" text="Select department" />
        {departments.map((d) => (
          <SelectItem key={d.id} value={d.id} text={d.name} />
        ))}
      </Select>
      <Select id="emp-manager" labelText="Manager" value={form.managerId} onChange={set("managerId")}>
        <SelectItem value="" text="No manager" />
        {managers
          .filter((m) => m.id !== id)
          .map((m) => (
            <SelectItem key={m.id} value={m.id} text={`${m.name} (${m.empCode})`} />
          ))}
      </Select>
      <TextInput id="emp-designation" labelText="Designation" value={form.designation} onChange={set("designation")} />
      <TextInput
        id="emp-type"
        labelText="Employment type"
        placeholder="e.g. full_time"
        value={form.employmentType}
        onChange={set("employmentType")}
      />
      <TextInput
        id="emp-joining"
        labelText="Joining date"
        type="date"
        value={form.joiningDate}
        onChange={set("joiningDate")}
        required
      />
      <TextInput id="emp-phone" labelText="Phone" value={form.phone} onChange={set("phone")} />
      <TextInput
        id="emp-personal"
        className="full"
        labelText="Personal email"
        type="email"
        value={form.personalEmail}
        onChange={set("personalEmail")}
      />
      {isEdit && (
        <>
          <Select id="emp-status" labelText="Status" value={form.status} onChange={set("status")}>
            <SelectItem value="active" text="Active" />
            <SelectItem value="inactive" text="Inactive" />
          </Select>
          <TextInput
            id="emp-lwd"
            labelText="Last working date"
            type="date"
            value={form.lastWorkingDate}
            onChange={set("lastWorkingDate")}
          />
        </>
      )}
    </FormModal>
  );
}

function RoleModal({ employee, onClose }) {
  const { data: roles = [], error } = useRoles();
  const assign = useAssignRole();
  const [form, set] = useFormState({ roleId: "", reason: "" });
  return (
    <FormModal
      open
      title={`Change role — ${employee.name}`}
      submitText="Change role"
      isSubmitting={assign.isPending}
      submitDisabled={!form.roleId}
      onClose={onClose}
      onSubmit={() => assign.mutate({ id: employee.id, ...form, reason: emptyToNull(form.reason) }, { onSuccess: onClose })}
    >
      <Select
        id="role-select"
        className="full"
        labelText="New role"
        value={form.roleId}
        onChange={set("roleId")}
        invalid={!!error}
        invalidText="Roles could not be loaded (your account may not be allowed to list roles)."
      >
        <SelectItem value="" text={`Current: ${employee.role ?? "—"}`} />
        {roles.map((r) => (
          <SelectItem key={r.id} value={r.id} text={r.displayName} />
        ))}
      </Select>
      <TextInput id="role-reason" className="full" labelText="Reason (audited)" value={form.reason} onChange={set("reason")} />
    </FormModal>
  );
}

function DeactivateModal({ employee, onClose }) {
  const deactivate = useDeactivateEmployee();
  const [form, set] = useFormState({ lastWorkingDate: todayISO() });
  return (
    <FormModal
      open
      danger
      title={`Deactivate ${employee.name}?`}
      submitText="Deactivate"
      isSubmitting={deactivate.isPending}
      submitDisabled={!form.lastWorkingDate}
      onClose={onClose}
      onSubmit={() => deactivate.mutate({ id: employee.id, ...form }, { onSuccess: onClose })}
    >
      <p className="full">Login is blocked and all sessions are ended. The record is kept.</p>
      <TextInput
        id="deact-date"
        className="full"
        labelText="Last working date"
        type="date"
        value={form.lastWorkingDate}
        onChange={set("lastWorkingDate")}
      />
    </FormModal>
  );
}

function LocationModal({ employee, onClose }) {
  const { data: locations = [] } = useOfficeLocations(false);
  const assign = useAssignOfficeLocation();
  const [form, set] = useFormState({ officeLocationId: "" });
  return (
    <FormModal
      open
      title={`Office location — ${employee.name}`}
      isSubmitting={assign.isPending}
      onClose={onClose}
      onSubmit={() => assign.mutate({ employeeId: employee.id, ...form }, { onSuccess: onClose })}
    >
      <Select id="loc-select" className="full" labelText="Geofence location" value={form.officeLocationId} onChange={set("officeLocationId")}>
        <SelectItem value="" text="None (clear assignment)" />
        {locations.map((l) => (
          <SelectItem key={l.id} value={l.id} text={l.name} />
        ))}
      </Select>
    </FormModal>
  );
}

export function Employees() {
  const { can } = usePermissions();
  const [filters, setFilters] = useState({ search: "", status: "", departmentId: "" });
  const [searchText, setSearchText] = useState("");
  const [paging, setPaging] = useState({ page: 1, pageSize: 20 });
  const [modal, setModal] = useState(null); // { type, employee? }

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchText }));
      setPaging((p) => ({ ...p, page: 1 }));
    }, 350);
    return () => clearTimeout(t);
  }, [searchText]);

  const { data, isLoading, error } = useEmployees({ ...filters, ...paging });
  const { data: departments = [] } = useDepartments();
  const { data: managerPool } = useEmployees({ pageSize: 100, status: "active" });
  const invite = useInviteEmployee();

  const canCreate = can("employees", "create");
  const canEdit = can("employees", "edit_any");
  const canDeactivate = can("employees", "deactivate");
  const canAssignRole = can("roles", "assign");
  const close = () => setModal(null);

  const columns = [
    { key: "empCode", header: "Code" },
    {
      key: "name",
      header: "Employee",
      render: (r) => (
        <>
          <strong>{r.name}</strong>
          <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>{r.email}</div>
        </>
      ),
    },
    { key: "departmentName", header: "Department" },
    { key: "designation", header: "Designation" },
    { key: "managerName", header: "Manager" },
    { key: "role", header: "Role" },
    { key: "joiningDate", header: "Joined", render: (r) => fmtDate(r.joiningDate) },
    { key: "status", header: "Status", render: (r) => <StatusTag value={r.status} /> },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <RowActions
          actions={[
            canEdit && { label: "Edit", icon: <EditOutlined fontSize="small" />, onClick: () => setModal({ type: "edit", employee: r }) },
            canAssignRole && r.isActive && { label: "Change role", icon: <AdminPanelSettingsOutlined fontSize="small" />, onClick: () => setModal({ type: "role", employee: r }) },
            canEdit && { label: "Office location", icon: <PlaceOutlined fontSize="small" />, onClick: () => setModal({ type: "location", employee: r }) },
            canCreate && { label: "Send invitation", icon: <MailOutlineOutlined fontSize="small" />, disabled: invite.isPending, onClick: () => invite.mutate(r.id) },
            canDeactivate && r.isActive && { label: "Deactivate", icon: <PersonOffOutlined fontSize="small" />, danger: true, onClick: () => setModal({ type: "deactivate", employee: r }) },
          ]}
        />
      ),
    },
  ];

  return (
    <PageShell
      title="Employees"
      description="Browse, onboard and manage the people in your company."
      actions={
        canCreate && (
          <Button renderIcon={Add} onClick={() => setModal({ type: "create" })}>
            New employee
          </Button>
        )
      }
    >
      <div className="hr-toolbar">
        <Search
          id="emp-search"
          size="md"
          labelText="Search employees"
          placeholder="Search name, email or code"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onClear={() => setSearchText("")}
        />
        <Select
          id="emp-filter-status"
          labelText="Status"
          value={filters.status}
          onChange={(e) => {
            setFilters((f) => ({ ...f, status: e.target.value }));
            setPaging((p) => ({ ...p, page: 1 }));
          }}
        >
          <SelectItem value="" text="All" />
          <SelectItem value="active" text="Active" />
          <SelectItem value="inactive" text="Inactive" />
        </Select>
        <Select
          id="emp-filter-dept"
          labelText="Department"
          value={filters.departmentId}
          onChange={(e) => {
            setFilters((f) => ({ ...f, departmentId: e.target.value }));
            setPaging((p) => ({ ...p, page: 1 }));
          }}
        >
          <SelectItem value="" text="All departments" />
          {departments.map((d) => (
            <SelectItem key={d.id} value={d.id} text={d.name} />
          ))}
        </Select>
      </div>

      <SimpleTable illustration="team" emptyTitle="No employees found" emptyText="Try different filters, or add a new employee."
        columns={columns}
        rows={data?.items}
        isLoading={isLoading}
        error={error}
        paging={{ ...paging, totalItems: data?.totalCount ?? 0, onChange: setPaging }}
      />

      {modal?.type === "create" && (
        <EmployeeFormModal onClose={close} departments={departments} managers={managerPool?.items ?? []} />
      )}
      {modal?.type === "edit" && (
        <EmployeeFormModal
          id={modal.employee.id}
          onClose={close}
          departments={departments}
          managers={managerPool?.items ?? []}
        />
      )}
      {modal?.type === "role" && <RoleModal employee={modal.employee} onClose={close} />}
      {modal?.type === "deactivate" && <DeactivateModal employee={modal.employee} onClose={close} />}
      {modal?.type === "location" && <LocationModal employee={modal.employee} onClose={close} />}
    </PageShell>
  );
}
