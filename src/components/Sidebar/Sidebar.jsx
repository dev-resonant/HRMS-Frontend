import { useLocation, useNavigate } from "react-router";
import { Enterprise, UserAvatar, ChevronRight } from "@carbon/icons-react";
import { sidebarSections } from "./constant";
import { Tag } from "@carbon/react";
import "./sidebar.scss";

export const Sidebar = ({ isCollapsed, onMouseEnter, onMouseLeave }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside
      className={`carbon-sidebar ${isCollapsed ? "collapsed" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label="ProHRM Enterprise Navigation"
    >
      {/* Brand Header */}
      <div className="sidebar-brand" onClick={() => handleNavigation("/dashboard")}>
        <div className="brand-logo-container">
          <Enterprise size={22} className="brand-logo" />
        </div>
        <div className="brand-info sidebar-fade">
          <div className="brand-title-row">
            <span className="brand-title">ProHRM</span>
            <Tag type="cyan" size="sm" className="brand-version">
              v1.0
            </Tag>
          </div>
          <div className="brand-subtitle">ENTERPRISE SUITE</div>
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="sidebar-nav-list">
        {sidebarSections.map((section, sIdx) => (
          <div key={sIdx} className="nav-section-block">
            <div className="section-header-label sidebar-fade">
              {section.category}
            </div>

            <div className="section-items-group">
              {section.items.map((item) => {
                const isSelected =
                  location.pathname === item.url ||
                  (item.url === "/dashboard" && location.pathname === "/");
                const IconComponent = item.icon;

                return (
                  <button
                    key={item.url}
                    type="button"
                    title={isCollapsed ? item.label : undefined}
                    className={`sidebar-nav-item ${isSelected ? "active" : ""}`}
                    onClick={() => handleNavigation(item.url)}
                  >
                    <span className="nav-item-icon">
                      {IconComponent && <IconComponent size={20} />}
                    </span>
                    <span className="nav-item-label sidebar-fade">{item.label}</span>
                    {item.badge && (
                      <span className="nav-item-badge sidebar-fade">{item.badge}</span>
                    )}
                    {isSelected && (
                      <ChevronRight size={14} className="nav-active-chevron sidebar-fade" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer" onClick={() => navigate("/profile")}>
        <div className="footer-avatar">
          <UserAvatar size={20} />
          <span className="sidebar-status-dot" />
        </div>
        <div className="footer-info sidebar-fade">
          <div className="footer-name">Het Gajjar</div>
          <div className="footer-role">Super Admin</div>
        </div>
      </div>
    </aside>
  );
};
