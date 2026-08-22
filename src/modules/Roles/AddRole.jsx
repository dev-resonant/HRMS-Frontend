import { useState } from "react";
import {
  Grid,
  Column,
  TextInput,
  TextArea,
  Select,
  SelectItem,
  Button,
  Heading,
  Section,
  Form,
} from "@carbon/react";
import { useNavigate } from "react-router";
import { ArrowLeft, Save } from "@carbon/icons-react";
import "./roles.scss";

export const AddRole = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roleName: "",
    roleCategory: "Operations",
    dataScope: "Entire company",
    capabilities: "",
  });

  const scopePresets = [
    "Entire platform (all companies)",
    "Entire company",
    "Own department only",
    "Direct reports only",
    "Own self-service data only",
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectPreset = (preset) => {
    setFormData((prev) => ({ ...prev, dataScope: preset }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.debug("Saving Role:", formData);
    navigate("/roles/list");
  };

  return (
    <Section className="roles-page-container animate-fade-in">
      <div className="page-header-row">
        <Button
          kind="ghost"
          size="md"
          renderIcon={ArrowLeft}
          onClick={() => navigate("/roles/list")}
          style={{ marginBottom: "0.75rem" }}
        >
          Back to Roles
        </Button>
        <Heading className="page-title">Define New Role</Heading>
        <p className="page-description">
          Create a new role definition, assign scope visibility boundaries, and define capabilities.
        </p>
      </div>

      <div className="roles-form-card">
        <Form onSubmit={handleSubmit}>
          <Grid fullWidth narrow>
            {/* Section 1: General Details */}
            <Column sm={4} md={8} lg={16} className="form-section-title-wrap">
              <span className="section-step-num">1</span>
              <Heading className="section-title">General Information</Heading>
            </Column>

            <Column sm={4} md={4} lg={8}>
              <TextInput
                id="role-name"
                labelText="Role Name"
                placeholder="e.g. Talent Acquisition Lead"
                required
                value={formData.roleName}
                onChange={(e) => handleChange("roleName", e.target.value)}
                helperText="Specify a unique and descriptive title for this role"
              />
            </Column>

            <Column sm={4} md={4} lg={8}>
              <Select
                id="role-category"
                labelText="Role Category"
                value={formData.roleCategory}
                onChange={(e) => handleChange("roleCategory", e.target.value)}
                helperText="Groups similar roles for organizational reporting"
              >
                <SelectItem value="Executive" text="Executive / Governance" />
                <SelectItem value="HR Administration" text="HR Administration" />
                <SelectItem value="Management" text="Team Management" />
                <SelectItem value="Operations" text="Operations & Staff" />
                <SelectItem value="Self-Service" text="Self-Service Employee" />
              </Select>
            </Column>

            {/* Section 2: Data Scope Configuration */}
            <Column sm={4} md={8} lg={16} className="form-section-title-wrap" style={{ marginTop: "2rem" }}>
              <span className="section-step-num">2</span>
              <Heading className="section-title">Data Visibility & Scope</Heading>
            </Column>

            <Column sm={4} md={8} lg={16}>
              <div className="preset-scope-chips">
                <span className="preset-label">Quick Presets:</span>
                {scopePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`preset-scope-chip ${formData.dataScope === preset ? "selected" : ""}`}
                    onClick={() => handleSelectPreset(preset)}
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <TextInput
                id="data-scope"
                labelText="Custom Data Scope Description"
                placeholder="e.g. Own department & designated subsidiaries"
                required
                value={formData.dataScope}
                onChange={(e) => handleChange("dataScope", e.target.value)}
                helperText="Defines which specific organizational branch this role governs"
              />
            </Column>

            {/* Section 3: Capabilities Description */}
            <Column sm={4} md={8} lg={16} className="form-section-title-wrap" style={{ marginTop: "2rem" }}>
              <span className="section-step-num">3</span>
              <Heading className="section-title">Privileges & Responsibilities</Heading>
            </Column>

            <Column sm={4} md={8} lg={16}>
              <TextArea
                id="capabilities-description"
                labelText="Capabilities & Permission Scope Description"
                placeholder="Detail what actions, approvals, and reports this role can execute..."
                rows={4}
                value={formData.capabilities}
                onChange={(e) => handleChange("capabilities", e.target.value)}
                helperText="Provide a clear description for audit and compliance reviews"
              />
            </Column>

            {/* Form Action Footer */}
            <Column sm={4} md={8} lg={16}>
              <div className="form-actions-row">
                <Button
                  kind="secondary"
                  size="md"
                  onClick={() => navigate("/roles/list")}
                >
                  Cancel
                </Button>
                <Button
                  kind="primary"
                  size="md"
                  type="submit"
                  renderIcon={Save}
                >
                  Save & Activate Role
                </Button>
              </div>
            </Column>
          </Grid>
        </Form>
      </div>
    </Section>
  );
};
