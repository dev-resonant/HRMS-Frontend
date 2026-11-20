import { useState } from "react";
import { Button, Tag, TextArea } from "../../components/ui/fields";
import { PageShell } from "../../components/ui/PageShell";
import { SimpleTable } from "../../components/ui/SimpleTable";
import { FormModal } from "../../components/ui/FormModal";
import { useRoles, useUpdateRolePermissions } from "../../api/platform-api";

/** Edit a role's permission document as JSON ({ module: [actions] }). */
function PermissionsModal({ role, onClose }) {
  const update = useUpdateRolePermissions();
  const [text, setText] = useState(JSON.stringify(role.permissions ?? {}, null, 2));

  let parsed = null;
  let parseError = null;
  try {
    parsed = JSON.parse(text);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Must be an object of module → actions");
  } catch (e) {
    parseError = e.message;
  }

  return (
    <FormModal
      open
      size="lg"
      title={`Permissions — ${role.displayName}`}
      submitText="Save permissions"
      isSubmitting={update.isPending}
      submitDisabled={!!parseError}
      onClose={onClose}
      onSubmit={() => update.mutate({ id: role.id, permissions: parsed }, { onSuccess: onClose })}
    >
      <TextArea
        id="role-perms"
        className="full"
        rows={16}
        labelText='Permissions (JSON), e.g. { "leave": ["apply", "view_own"] }'
        value={text}
        invalid={!!parseError}
        invalidText={parseError}
        onChange={(e) => setText(e.target.value)}
      />
      <span className="full" style={{ opacity: 0.7 }}>
        Only the platform identity may change role permissions; unknown modules/actions and removal of a built-in role&apos;s
        mandatory permissions are rejected by the server.
      </span>
    </FormModal>
  );
}

export function RolesList() {
  const { data = [], isLoading, error } = useRoles();
  const [editing, setEditing] = useState(null);

  const columns = [
    { key: "displayName", header: "Role", render: (r) => <strong>{r.displayName}</strong> },
    { key: "key", header: "Key" },
    {
      key: "scope",
      header: "Type",
      render: (r) => (
        <Tag size="sm" type={r.isSystem ? "purple" : "blue"}>
          {r.isSystem ? "Built-in" : "Company"}
        </Tag>
      ),
    },
    {
      key: "permissions",
      header: "Permissions",
      render: (r) =>
        Object.entries(r.permissions ?? {}).map(([module, actions]) => (
          <Tag key={module} size="sm" type="outline" title={actions.join(", ")}>
            {module} · {actions.length}
          </Tag>
        )),
    },
    {
      key: "actions",
      header: "",
      render: (r) => (
        <Button kind="ghost" size="sm" onClick={() => setEditing(r)}>
          Edit permissions
        </Button>
      ),
    },
  ];

  return (
    <PageShell title="Roles" description="Built-in and company roles with the permissions each one holds.">
        <SimpleTable illustration="shield" emptyTitle="No roles found" emptyText="Roles defined for your company will appear here." columns={columns} rows={data} isLoading={isLoading} error={error} />
      
      {editing && <PermissionsModal role={editing} onClose={() => setEditing(null)} />}
    </PageShell>
  );
}
