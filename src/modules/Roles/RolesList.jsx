import { useState } from "react";
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Button,
  Tag,
  Heading,
  Section,
  Tile,
  Modal,
} from "@carbon/react";
import { useNavigate } from "react-router";
import { Add, Edit, TrashCan, Security, UserMultiple, Locked } from "@carbon/icons-react";
import { ListFilterBar } from "../../components/application/ListFilterBar";
import "./roles.scss";

const initialRoles = [
  {
    id: "1",
    roleName: "Super Admin",
    scope: "Entire platform (all companies)",
    capabilities: "Creates companies, manages all admins, configures system-level settings.",
    type: "System",
    membersCount: 2,
    status: "Active",
  },
  {
    id: "2",
    roleName: "HR Admin",
    scope: "Entire company",
    capabilities: "Manages all employees, runs payroll, configures leave types, approves escalated requests.",
    type: "System",
    membersCount: 8,
    status: "Active",
  },
  {
    id: "3",
    roleName: "Manager",
    scope: "Own team only",
    capabilities: "Approves leave and mispunch for direct reports, views team attendance.",
    type: "Custom",
    membersCount: 24,
    status: "Active",
  },
  {
    id: "4",
    roleName: "Employee",
    scope: "Own data only",
    capabilities: "Self-service: punch in/out, apply leave, fill timesheet, view own payslip.",
    type: "Custom",
    membersCount: 1214,
    status: "Active",
  },
];

const headers = [
  { key: "roleName", header: "Role & Type" },
  { key: "scope", header: "Data Scope" },
  { key: "membersCount", header: "Members" },
  { key: "capabilities", header: "Capabilities Description" },
  { key: "actions", header: "Actions" },
];

export const RolesList = () => {
  const navigate = useNavigate();
  const [roles, setRoles] = useState(initialRoles);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilterValues, setActiveFilterValues] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRoleForDelete, setSelectedRoleForDelete] = useState(null);

  const roleFilters = [
    {
      label: "Type",
      options: [
        { label: "System", color: "#8a3ffc" },
        { label: "Custom", color: "#0f62fe" },
      ],
    },
    {
      label: "Status",
      options: [
        { label: "Active", color: "#198038" },
        { label: "Archived", color: "#8d8d8d" },
      ],
    },
  ];

  const handleSelectFilter = (category, value) => {
    setActiveFilterValues((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleClearAllFilters = () => {
    setActiveFilterValues({});
    setSearchQuery("");
  };

  const filteredRoles = roles.filter((row) => {
    const matchesSearch =
      row.roleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.scope.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.capabilities.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      !activeFilterValues["Type"] || row.type === activeFilterValues["Type"];
    const matchesStatus =
      !activeFilterValues["Status"] || row.status === activeFilterValues["Status"];

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDeleteClick = (role) => {
    setSelectedRoleForDelete(role);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRoleForDelete) {
      setRoles((prev) => prev.filter((r) => r.id !== selectedRoleForDelete.id));
    }
    setDeleteModalOpen(false);
    setSelectedRoleForDelete(null);
  };

  return (
    <Section className="roles-page-container animate-fade-in">
      {/* Header Title */}
      <div className="page-header-row">
        <div>
          <Heading className="page-title">Role Management</Heading>
          <p className="page-description">
            Define organizational roles, data visibility scopes, and member privilege assignments.
          </p>
        </div>
      </div>

      {/* KPI Overview Tiles */}
      <div className="roles-stats-grid">
        <Tile className="role-stat-tile">
          <div className="stat-label">Total Configured Roles</div>
          <div className="stat-value-row">
            <span className="stat-num">{roles.length}</span>
            <Security size={20} className="stat-icon blue" />
          </div>
          <span className="stat-meta">Active in security policies</span>
        </Tile>

        <Tile className="role-stat-tile">
          <div className="stat-label">System Protected Roles</div>
          <div className="stat-value-row">
            <span className="stat-num">
              {roles.filter((r) => r.type === "System").length}
            </span>
            <Locked size={20} className="stat-icon purple" />
          </div>
          <span className="stat-meta">Hardened core privileges</span>
        </Tile>

        <Tile className="role-stat-tile">
          <div className="stat-label">Assigned Members</div>
          <div className="stat-value-row">
            <span className="stat-num">1,248</span>
            <UserMultiple size={20} className="stat-icon green" />
          </div>
          <span className="stat-meta">100% of workforce mapped</span>
        </Tile>
      </div>

      {/* Filter and Action Bar */}
      <ListFilterBar
        searchPlaceholder="Search roles by title, scope, or description..."
        filters={roleFilters}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
        totalCount={filteredRoles.length}
        activeFilterValues={activeFilterValues}
        onSelectFilter={handleSelectFilter}
        onClearAllFilters={handleClearAllFilters}
        actionButton={
          <Button
            renderIcon={Add}
            onClick={() => navigate("/roles/add")}
            size="md"
          >
            Create New Role
          </Button>
        }
      />

      {/* Modern Carbon DataTable */}
      <div className="carbon-table-wrapper">
        <DataTable rows={filteredRoles} headers={headers}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <TableContainer title="" description="">
              <Table {...getTableProps()} className="carbon-styled-table">
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader key={header.key} {...getHeaderProps({ header })}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    const originalRow = roles.find((r) => r.id === row.id);
                    const isSystem = originalRow?.type === "System";

                    return (
                      <TableRow key={row.id} {...getRowProps({ row })}>
                        <TableCell>
                          <div className="role-name-cell">
                            <span className="role-name-text">{originalRow?.roleName}</span>
                            <Tag
                              size="sm"
                              type={isSystem ? "purple" : "blue"}
                              className="role-type-tag"
                            >
                              {originalRow?.type}
                            </Tag>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="scope-badge">{originalRow?.scope}</span>
                        </TableCell>
                        <TableCell>
                          <span className="members-count-pill">
                            {originalRow?.membersCount.toLocaleString()} users
                          </span>
                        </TableCell>
                        <TableCell className="capabilities-cell">
                          {originalRow?.capabilities}
                        </TableCell>
                        <TableCell>
                          <div className="table-actions-group">
                            <Button
                              kind="ghost"
                              size="sm"
                              renderIcon={Edit}
                              onClick={() => navigate(`/roles/edit/${row.id}`)}
                            >
                              Edit
                            </Button>
                            {!isSystem && (
                              <Button
                                kind="danger--ghost"
                                size="sm"
                                renderIcon={TrashCan}
                                hasIconOnly
                                iconDescription="Delete role"
                                onClick={() => handleDeleteClick(originalRow)}
                              />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        modalHeading="Delete Role Confirmation"
        primaryButtonText="Delete Role"
        secondaryButtonText="Cancel"
        danger
        onRequestClose={() => setDeleteModalOpen(false)}
        onRequestSubmit={confirmDelete}
      >
        <p>
          Are you sure you want to delete the role{" "}
          <strong>{selectedRoleForDelete?.roleName}</strong>? All members currently assigned to this role will lose their associated capabilities.
        </p>
      </Modal>
    </Section>
  );
};
