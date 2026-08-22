import { useState } from "react";
import {
  Grid,
  Column,
  TextInput,
  Select,
  SelectItem,
  Button,
  Heading,
  Section,
  Form,
  Tag,
} from "@carbon/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Save } from "@carbon/icons-react";
import "./permissions.scss";

export const AddPermission = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    module: "Attendance",
    actionName: "",
    description: "",
    employeeScope: "-",
    managerScope: "Team",
    hrAdminScope: "All",
    superAdminScope: "All",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.debug("Saving Permission Configuration:", formData);
    navigate("/permissions/list");
  };

  return (
    <Section className="permissions-page-container animate-fade-in">
      <div className="page-header-row">
        <Button
          kind="ghost"
          size="md"
          renderIcon={ArrowLeft}
          onClick={() => navigate("/permissions/list")}
          style={{ marginBottom: "0.75rem" }}
        >
          Back to Permissions Matrix
        </Button>
        <Heading className="page-title">Configure Authorization Rule</Heading>
        <p className="page-description">
          Define permission rules, action identifiers, and specify role authorization boundaries.
        </p>
      </div>

      <div className="permissions-form-card">
        <Form onSubmit={handleSubmit}>
          <Grid fullWidth narrow>
            {/* Step 1: Module & Identifier */}
            <Column sm={4} md={8} lg={16} className="form-section-title-wrap">
              <span className="section-step-num">1</span>
              <Heading className="section-title">Module & Action Details</Heading>
            </Column>

            <Column sm={4} md={4} lg={6}>
              <Select
                id="module-select"
                labelText="Target System Module"
                value={formData.module}
                onChange={(e) => handleChange("module", e.target.value)}
                helperText="System domain where this authorization applies"
              >
                <SelectItem value="Attendance" text="Attendance & Biometrics" />
                <SelectItem value="Leave" text="Leave Management" />
                <SelectItem value="Timesheet" text="Timesheet & Hours" />
                <SelectItem value="Employees" text="Employee Master Records" />
                <SelectItem value="Payroll" text="Payroll & Compensation" />
                <SelectItem value="System" text="Core System Settings" />
              </Select>
            </Column>

            <Column sm={4} md={4} lg={10}>
              <TextInput
                id="action-name"
                labelText="Action Name / Identifier"
                placeholder="e.g. Approve team leave requests"
                required
                value={formData.actionName}
                onChange={(e) => handleChange("actionName", e.target.value)}
                helperText="Unique programmatic or human-readable capability name"
              />
            </Column>

            <Column sm={4} md={8} lg={16} style={{ marginTop: "1rem" }}>
              <TextInput
                id="action-description"
                labelText="Rule Description"
                placeholder="e.g. Permits managers to approve or reject submitted annual and sick leaves"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                helperText="Brief summary of capability scope"
              />
            </Column>

            {/* Step 2: Role Access Matrix Scopes */}
            <Column sm={4} md={8} lg={16} className="form-section-title-wrap" style={{ marginTop: "2rem" }}>
              <span className="section-step-num">2</span>
              <Heading className="section-title">Role Scope Mapping</Heading>
            </Column>

            <Column sm={4} md={2} lg={4}>
              <div className="role-scope-input-card">
                <Tag size="sm" type="cool-gray" className="role-chip">Employee</Tag>
                <Select
                  id="employee-scope"
                  labelText="Access Scope"
                  value={formData.employeeScope}
                  onChange={(e) => handleChange("employeeScope", e.target.value)}
                >
                  <SelectItem value="-" text="None (-)" />
                  <SelectItem value="Y" text="Allowed (Self)" />
                </Select>
              </div>
            </Column>

            <Column sm={4} md={2} lg={4}>
              <div className="role-scope-input-card">
                <Tag size="sm" type="blue" className="role-chip">Manager</Tag>
                <Select
                  id="manager-scope"
                  labelText="Access Scope"
                  value={formData.managerScope}
                  onChange={(e) => handleChange("managerScope", e.target.value)}
                >
                  <SelectItem value="-" text="None (-)" />
                  <SelectItem value="Team" text="Direct Team" />
                  <SelectItem value="All" text="All Scopes" />
                  <SelectItem value="Y" text="Allowed (Y)" />
                </Select>
              </div>
            </Column>

            <Column sm={4} md={2} lg={4}>
              <div className="role-scope-input-card">
                <Tag size="sm" type="purple" className="role-chip">HR Admin</Tag>
                <Select
                  id="hr-admin-scope"
                  labelText="Access Scope"
                  value={formData.hrAdminScope}
                  onChange={(e) => handleChange("hrAdminScope", e.target.value)}
                >
                  <SelectItem value="-" text="None (-)" />
                  <SelectItem value="Team" text="Direct Team" />
                  <SelectItem value="All" text="All Company" />
                  <SelectItem value="Y" text="Allowed (Y)" />
                </Select>
              </div>
            </Column>

            <Column sm={4} md={2} lg={4}>
              <div className="role-scope-input-card">
                <Tag size="sm" type="magenta" className="role-chip">Super Admin</Tag>
                <Select
                  id="super-admin-scope"
                  labelText="Access Scope"
                  value={formData.superAdminScope}
                  onChange={(e) => handleChange("superAdminScope", e.target.value)}
                >
                  <SelectItem value="-" text="None (-)" />
                  <SelectItem value="Team" text="Direct Team" />
                  <SelectItem value="All" text="All Platform" />
                  <SelectItem value="Y" text="Allowed (Y)" />
                </Select>
              </div>
            </Column>

            {/* Actions */}
            <Column sm={4} md={8} lg={16}>
              <div className="form-actions-row">
                <Button
                  kind="secondary"
                  size="md"
                  onClick={() => navigate("/permissions/list")}
                >
                  Cancel
                </Button>
                <Button
                  kind="primary"
                  size="md"
                  type="submit"
                  renderIcon={Save}
                >
                  Save & Publish Rule
                </Button>
              </div>
            </Column>
          </Grid>
        </Form>
      </div>
    </Section>
  );
};
