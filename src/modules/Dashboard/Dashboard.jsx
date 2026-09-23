import { useState } from "react";
import {
  Tile,
  Grid,
  Column,
  Button,
  Tag,
  Heading,
  Section,
} from "@carbon/react";
import {
  UserMultiple,
  Security,
  CheckmarkOutline,
  ArrowUpRight,
  ArrowRight,
  Add,
  Time,
  Renew,
} from "@carbon/icons-react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../context/AuthContext/AuthContextExport";
import "./dashboard.scss";

export const Dashboard = () => {
  const navigate = useNavigate();
  const { getData } = useAuthContext();
  const user = getData();
  const userName = user?.userData?.name || "Het";

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const metricCards = [
    {
      title: "Total Employees",
      value: "1,248",
      change: "+12% this month",
      trend: "up",
      icon: UserMultiple,
      colorClass: "metric-blue",
    },
    {
      title: "On Leave Today",
      value: "18",
      change: "1.4% workforce",
      trend: "neutral",
      icon: Time,
      colorClass: "metric-purple",
    },
    {
      title: "Attendance Rate",
      value: "98.2%",
      change: "+0.8% this week",
      trend: "up",
      icon: CheckmarkOutline,
      colorClass: "metric-green",
    },
    {
      title: "Active Roles",
      value: "4",
      change: "7 modules governed",
      trend: "neutral",
      icon: Security,
      colorClass: "metric-teal",
    },
  ];

  const recentActivities = [
    {
      id: "1",
      title: "Updated permissions for Attendance module",
      actor: "Het Gajjar (Admin)",
      time: "10m ago",
      tag: "Security",
      tagType: "purple",
    },
    {
      id: "2",
      title: "New role 'HR Specialist' configured",
      actor: "Sarah Jenkins",
      time: "45m ago",
      tag: "Roles",
      tagType: "blue",
    },
    {
      id: "3",
      title: "Payroll computation finalized",
      actor: "Finance Team",
      time: "2h ago",
      tag: "Payroll",
      tagType: "green",
    },
  ];

  return (
    <Section className="dashboard-container animate-fade-in">
      {/* Sleek Header Bar */}
      <div className="dashboard-top-bar">
        <div>
          <Heading className="dashboard-greeting">Welcome back, {userName}</Heading>
          <p className="dashboard-sub-greeting">
            Here is your daily organization and security overview.
          </p>
        </div>
        <div className="dashboard-actions">
          <Button
            kind="ghost"
            size="md"
            renderIcon={Renew}
            onClick={handleRefresh}
            className={`refresh-btn ${refreshing ? "rotating" : ""}`}
          >
            Refresh
          </Button>
          <Button
            kind="primary"
            size="md"
            renderIcon={Add}
            onClick={() => navigate("/roles/add")}
          >
            Add Role
          </Button>
        </div>
      </div>

      {/* KPI Metric Summary Tiles */}
      <div className="metrics-grid">
        {metricCards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <Tile key={idx} className={`metric-tile ${card.colorClass}`}>
              <div className="metric-tile-header">
                <span className="metric-title">{card.title}</span>
                <div className="metric-icon-wrap">
                  <IconComp size={18} />
                </div>
              </div>
              <div className="metric-value">{card.value}</div>
              <div className="metric-change">
                {card.trend === "up" && <ArrowUpRight size={14} />}
                <span>{card.change}</span>
              </div>
            </Tile>
          );
        })}
      </div>

      {/* 2-Column Split: Activity Stream & Quick Links */}
      <Grid fullWidth narrow className="dashboard-split-grid">
        <Column sm={4} md={5} lg={10}>
          <div className="dashboard-card">
            <div className="card-header-bar">
              <Heading className="card-heading">Recent Activities</Heading>
              <Button
                kind="ghost"
                size="sm"
                renderIcon={ArrowRight}
                onClick={() => navigate("/audit-logs")}
              >
                View all
              </Button>
            </div>

            <div className="activity-timeline">
              {recentActivities.map((act) => (
                <div key={act.id} className="activity-timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-body">
                    <div className="timeline-row">
                      <span className="activity-title">{act.title}</span>
                      <Tag size="sm" type={act.tagType}>
                        {act.tag}
                      </Tag>
                    </div>
                    <div className="timeline-meta">
                      <span>{act.actor}</span>
                      <span className="bullet">•</span>
                      <span>{act.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Column>

        <Column sm={4} md={3} lg={6}>
          <div className="dashboard-card">
            <Heading className="card-heading">Quick Actions</Heading>
            <div className="quick-actions-list">
              <button
                type="button"
                className="quick-action-button"
                onClick={() => navigate("/roles/list")}
              >
                <div className="action-icon-pill blue">
                  <Security size={16} />
                </div>
                <div className="action-label-wrap">
                  <span className="action-name">Manage Roles</span>
                </div>
                <ArrowRight size={14} className="action-chevron" />
              </button>

              <button
                type="button"
                className="quick-action-button"
                onClick={() => navigate("/permissions/list")}
              >
                <div className="action-icon-pill purple">
                  <CheckmarkOutline size={16} />
                </div>
                <div className="action-label-wrap">
                  <span className="action-name">Permissions Matrix</span>
                </div>
                <ArrowRight size={14} className="action-chevron" />
              </button>

              <button
                type="button"
                className="quick-action-button"
                onClick={() => navigate("/roles/add")}
              >
                <div className="action-icon-pill green">
                  <Add size={16} />
                </div>
                <div className="action-label-wrap">
                  <span className="action-name">Create New Role</span>
                </div>
                <ArrowRight size={14} className="action-chevron" />
              </button>
            </div>
          </div>
        </Column>
      </Grid>
    </Section>
  );
};
