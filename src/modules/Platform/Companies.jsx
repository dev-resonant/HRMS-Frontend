import { useEffect, useState } from "react";
import { RowActions } from "../../components/ui/RowActions";
import EditOutlined from "@mui/icons-material/EditOutlined";
import PowerSettingsNewOutlined from "@mui/icons-material/PowerSettingsNewOutlined";
import { Button, Search, Select, SelectItem, TextInput } from "../../components/ui/fields";
import Add from "@mui/icons-material/Add";
import { PageShell } from "../../components/ui/PageShell";
import { SimpleTable } from "../../components/ui/SimpleTable";
import { FormModal } from "../../components/ui/FormModal";
import { StatusTag, fmtDate, emptyToNull } from "../../components/ui/format";
import { useFormState } from "../../components/ui/useFormState";
import { useCompanies, useCreateCompany, useUpdateCompany, useSetCompanyStatus } from "../../api/platform-api";

function CompanyModal({ company, onClose }) {
  const create = useCreateCompany();
  const update = useUpdateCompany();
  const [form, set, setForm] = useFormState({
    name: "",
    domain: "",
    timezone: "Asia/Kolkata",
    logoUrl: "",
    adminName: "",
    adminEmail: "",
  });

  useEffect(() => {
    if (company) setForm((f) => ({ ...f, name: company.name ?? "", timezone: company.timezone ?? "", logoUrl: company.logoUrl ?? "" }));
  }, [company, setForm]);

  const submit = () => {
    if (company) {
      update.mutate(
        { id: company.id, body: { name: form.name, timezone: form.timezone, logoUrl: emptyToNull(form.logoUrl) } },
        { onSuccess: onClose }
      );
    } else {
      create.mutate({ ...form, logoUrl: emptyToNull(form.logoUrl) }, { onSuccess: onClose });
    }
  };

  return (
    <FormModal
      open
      title={company ? "Edit company" : "New company"}
      isSubmitting={create.isPending || update.isPending}
      submitDisabled={!form.name.trim() || !form.timezone || (!company && (!form.domain || !form.adminName || !form.adminEmail))}
      onClose={onClose}
      onSubmit={submit}
    >
      <TextInput id="co-name" labelText="Company name" value={form.name} onChange={set("name")} />
      <TextInput id="co-domain" labelText="Domain" value={form.domain || company?.domain || ""} onChange={set("domain")} disabled={!!company} helperText={company ? "Immutable" : undefined} />
      <TextInput id="co-tz" labelText="Time zone (IANA)" value={form.timezone} onChange={set("timezone")} />
      <TextInput id="co-logo" labelText="Logo URL" value={form.logoUrl} onChange={set("logoUrl")} />
      {!company && (
        <>
          <TextInput id="co-admin-name" labelText="Initial HR admin name" value={form.adminName} onChange={set("adminName")} />
          <TextInput id="co-admin-email" labelText="Initial HR admin email" type="email" value={form.adminEmail} onChange={set("adminEmail")} />
        </>
      )}
    </FormModal>
  );
}

function StatusModal({ company, onClose }) {
  const setStatus = useSetCompanyStatus();
  const [reason, setReason] = useState("");
  const next = !company.isActive;
  return (
    <FormModal
      open
      danger={!next}
      title={`${next ? "Activate" : "Deactivate"} ${company.name}?`}
      submitText={next ? "Activate" : "Deactivate"}
      isSubmitting={setStatus.isPending}
      onClose={onClose}
      onSubmit={() => setStatus.mutate({ id: company.id, isActive: next, reason: emptyToNull(reason) }, { onSuccess: onClose })}
    >
      {!next && <p className="full">Nobody in this company can sign in and all sessions are ended. No data is deleted.</p>}
      <TextInput id="co-reason" className="full" labelText="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} />
    </FormModal>
  );
}

export function Companies() {
  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({ search: "", status: "" });
  const [paging, setPaging] = useState({ page: 1, pageSize: 20 });
  const [modal, setModal] = useState(null);
  const { data, isLoading, error } = useCompanies({ ...filters, ...paging });

  useEffect(() => {
    const t = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchText }));
      setPaging((p) => ({ ...p, page: 1 }));
    }, 350);
    return () => clearTimeout(t);
  }, [searchText]);

  const columns = [
    { key: "name", header: "Company", render: (r) => <strong>{r.name}</strong> },
    { key: "domain", header: "Domain" },
    { key: "timezone", header: "Time zone" },
    { key: "employeeCount", header: "Employees" },
    { key: "createdAt", header: "Created", render: (r) => fmtDate(r.createdAt) },
    { key: "isActive", header: "Status", render: (r) => <StatusTag value={r.isActive ? "Active" : "Inactive"} /> },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <RowActions
          actions={[
            { label: "Edit", icon: <EditOutlined fontSize="small" />, onClick: () => setModal({ type: "edit", company: r }) },
            !r.isPlatform && { label: r.isActive ? "Deactivate" : "Activate", icon: <PowerSettingsNewOutlined fontSize="small" />, danger: r.isActive, onClick: () => setModal({ type: "status", company: r }) },
          ]}
        />
      ),
    },
  ];

  return (
    <PageShell
      title="Companies"
      description="Platform administration: tenants and their initial HR administrators."
      actions={
        <Button renderIcon={Add} onClick={() => setModal({ type: "create" })}>
          New company
        </Button>
      }
    >
      <div className="hr-toolbar">
        <Search id="co-search" size="md" labelText="Search companies" placeholder="Name or domain" value={searchText} onChange={(e) => setSearchText(e.target.value)} onClear={() => setSearchText("")} />
        <Select
          id="co-status"
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
      </div>
      <SimpleTable illustration="building" emptyTitle="No companies found" emptyText="Create a company to get started."
        columns={columns}
        rows={data?.items}
        isLoading={isLoading}
        error={error}
        paging={{ ...paging, totalItems: data?.totalCount ?? 0, onChange: setPaging }}
      />
      {modal?.type === "create" && <CompanyModal onClose={() => setModal(null)} />}
      {modal?.type === "edit" && <CompanyModal company={modal.company} onClose={() => setModal(null)} />}
      {modal?.type === "status" && <StatusModal company={modal.company} onClose={() => setModal(null)} />}
    </PageShell>
  );
}
