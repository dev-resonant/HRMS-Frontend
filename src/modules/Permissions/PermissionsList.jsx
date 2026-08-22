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
} from "@carbon/react";
import { useNavigate } from "react-router";
import { Add, Edit, Checkmark, Subtract, Events, Security, Rule } from "@carbon/icons-react";
import { ListFilterBar } from "../../components/application/ListFilterBar";
import "./permissions.scss";

const initialRows = [
  {
    id: "1",
    module: "Attendance",
    action: "View own logs",
    description: "Access personal punch in/out timestamps",
    employee: "Y",
    manager: "Y",
    hrAdmin: "Y",
    superAdmin: "Y",
  },
  {
    id: "2",
    module: "Attendance",
    action: "View team attendance",
    description: "Monitor presence of direct reports",
    employee: "-",
    manager: "Team",
    hrAdmin: "All",
    superAdmin: "All",
  },
  {
    id: "3",
    module: "Attendance",
    action: "Regularize mispunch",
    description: "Approve missed biometric logs",
    employee: "-",
    manager: "Team",
    hrAdmin: "All",
    superAdmin: "All",
  },
  {
    id: "4",
    module: "Leave",
    action: "Apply personal leave",
    description: "Submit vacation/sick leave requests",
    employee: "Y",
    manager: "Y",
    hrAdmin: "Y",
    superAdmin: "Y",
  },
  {
    id: "5",
    module: "Leave",
    action: "Approve team leave",
    description: "Approve or decline submitted leave requests",
    employee: "-",
    manager: "Team",
    hrAdmin: "All",
    superAdmin: "All",
  },
  {
    id: "6",
    module: "Employees",
    action: "Create / deactivate",
    description: "Onboard new hire or offboard existing employee",
    employee: "-",
    manager: "-",
    hrAdmin: "Y",
    superAdmin: "Y",
  },
  {
    id: "7",
    module: "Payroll",
    action: "Run salary disbursement",
    description: "Calculate and disburse monthly payouts",
    employee: "-",
    manager: "-",
    hrAdmin: "All",
    superAdmin: "All",
  },
];

const headers = [
  { key: "module", header: "Module & Action" },
  { key: "employee", header: "Employee" },
  { key: "manager", header: "Manager" },
  { key: "hrAdmin", header: "HR Admin" },
  { key: "superAdmin", header: "Super Admin" },
  { key: "actions", header: "Manage" },
];

const renderScopeBadge = (scope) => {
  if (scope === "Y") {
    return (
      <Tag size="sm" type="green" className="scope-tag">
        <Checkmark size={12} /> Allowed
      </Tag>
    );
  }
  if (scope === "-") {
    return (
      <Tag size="sm" type="gray" className="scope-tag">
        <Subtract size={12} /> None
      </Tag>
    );
  }
  if (scope === "Team") {
    return (
      <Tag size="sm" type="blue" className="scope-tag">
        Team Only
      </Tag>
    );
  }
  if (scope === "All") {
    return (
      <Tag size="sm" type="purple" className="scope-tag">
        All Scope
      </Tag>
    );
  }
  return <Tag size="sm">{scope}</Tag>;
};

export const PermissionsList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilterValues, setActiveFilterValues] = useState({});

  const permissionFilters = [
    {
      label: "Module",
      options: [
        { label: "Attendance", color: "#0f62fe" },
        { label: "Leave", color: "#8a3ffc" },
        { label: "Employees", color: "#007d79" },
        { label: "Payroll", color: "#198038" },
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

  const filteredRows = initialRows.filter((row) => {
    const matchesSearch =
      row.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModule =
      !activeFilterValues["Module"] || row.module === activeFilterValues["Module"];

    return matchesSearch && matchesModule;
  });

  return (
    <Section className="permissions-page-container animate-fade-in">
      {/* Header Title */}
      <div className="page-header-row">
        <div>
          <Heading className="page-title">Permissions Access Matrix</Heading>
          <p className="page-description">
            Fine-grained role authorization matrix governing module access, approval chains, and self-service capabilities.
          </p>
        </div>
      </div>

      {/* KPI Overview Tiles */}
      <div className="permissions-stats-grid">
        <Tile className="perm-stat-tile">
          <div className="stat-label">Governed Modules</div>
          <div className="stat-value-row">
            <span className="stat-num">4 Modules</span>
            <Events size={20} className="stat-icon blue" />
          </div>
          <span className="stat-meta">Attendance, Leave, Employees, Payroll</span>
        </Tile>

        <Tile className="perm-stat-tile">
          <div className="stat-label">Active Action Rules</div>
          <div className="stat-value-row">
            <span className="stat-num">{initialRows.length} Rules</span>
            <Rule size={20} className="stat-icon purple" />
          </div>
          <span className="stat-meta">Audited across 4 role scopes</span>
        </Tile>

        <Tile className="perm-stat-tile">
          <div className="stat-label">Security Compliance</div>
          <div className="stat-value-row">
            <span className="stat-num">100% Active</span>
            <Security size={20} className="stat-icon green" />
          </div>
          <span className="stat-meta">RBAC policy enforced</span>
        </Tile>
      </div>

      {/* Filter Toolbar */}
      <ListFilterBar
        searchPlaceholder="Filter by module, action, or capability..."
        filters={permissionFilters}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
        totalCount={filteredRows.length}
        activeFilterValues={activeFilterValues}
        onSelectFilter={handleSelectFilter}
        onClearAllFilters={handleClearAllFilters}
        actionButton={
          <Button
            renderIcon={Add}
            onClick={() => navigate("/permissions/add")}
            size="md"
          >
            Add Action Rule
          </Button>
        }
      />

      {/* Matrix Data Table */}
      <div className="carbon-table-wrapper">
        <DataTable rows={filteredRows} headers={headers}>
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
                    const originalRow = initialRows.find((r) => r.id === row.id);
                    return (
                      <TableRow key={row.id} {...getRowProps({ row })}>
                        <TableCell>
                          <div className="module-action-cell">
                            <div className="module-tag-row">
                              <Tag size="sm" type="cool-gray">
                                {originalRow?.module}
                              </Tag>
                              <span className="action-name-text">
                                {originalRow?.action}
                              </span>
                            </div>
                            <span className="action-desc-text">
                              {originalRow?.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{renderScopeBadge(originalRow?.employee)}</TableCell>
                        <TableCell>{renderScopeBadge(originalRow?.manager)}</TableCell>
                        <TableCell>{renderScopeBadge(originalRow?.hrAdmin)}</TableCell>
                        <TableCell>{renderScopeBadge(originalRow?.superAdmin)}</TableCell>
                        <TableCell>
                          <Button
                            kind="ghost"
                            size="sm"
                            renderIcon={Edit}
                            onClick={() => navigate(`/permissions/edit/${row.id}`)}
                          >
                            Edit
                          </Button>
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
    </Section>
  );
};
