import { useState, useRef } from "react";
import {
  Search,
  Popover,
  PopoverContent,
  Tag,
  Button,
} from "@carbon/react";
import {
  Notification,
  Settings,
  Logout,
  Menu as MenuIcon,
  Checkmark,
  User,
  Help,
  ChevronDown,
} from "@carbon/icons-react";
import { useNavigate } from "react-router";
import { useAuthContext } from "../../context/AuthContext/AuthContextExport";
import "./header.scss";

export const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { getData } = useAuthContext();
  const user = getData();

  const [searchValue, setSearchValue] = useState("");
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [notificationTab, setNotificationTab] = useState("all");

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New Leave Application",
      description: "Sarah Connor requested 3 days of Annual Leave",
      time: "5m ago",
      category: "requests",
      unread: true,
    },
    {
      id: "2",
      title: "Security Permission Modified",
      description: "Scope changed for HR Admin in Leave module",
      time: "1h ago",
      category: "system",
      unread: true,
    },
    {
      id: "3",
      title: "Monthly Payroll Auto-Generated",
      description: "Payroll batch for August is ready for audit approval",
      time: "4h ago",
      category: "system",
      unread: false,
    },
  ]);

  const notificationBtnRef = useRef(null);
  const userBtnRef = useRef(null);

  const userName = user?.userData?.name || user?.userData?.user_name || "Het";
  const userRole = user?.userData?.role === "admin" ? "Administrator" : "Employee";
  const userEmail = user?.userData?.email || "het@gmail.com";
  const userInitial = userName.charAt(0).toUpperCase();

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    navigate("/logout");
  };

  const filteredNotifications =
    notificationTab === "all"
      ? notifications
      : notifications.filter((n) => n.category === notificationTab);

  return (
    <header className="app-top-header" aria-label="ProHRM Platform Header">
      {/* Left: Sidebar Toggle & Search */}
      <div className="header-left-section">
        <button
          type="button"
          aria-label="Toggle Sidebar"
          className="header-icon-btn toggle-sidebar-btn"
          onClick={onToggleSidebar}
        >
          <MenuIcon size={20} />
        </button>

        <div className="header-search-wrap">
          <Search
            size="sm"
            id="app-header-search"
            placeholder="Search anything (e.g. employees, permissions, payroll)..."
            labelText="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClear={() => setSearchValue("")}
          />
          <span className="search-kbd-tag">Ctrl + K</span>
        </div>
      </div>

      {/* Right: Global Actions & User Profile */}
      <div className="header-right-section">
        <button
          type="button"
          aria-label="Help Center"
          onClick={() => window.open("https://carbondesignsystem.com", "_blank")}
          className="header-icon-btn"
        >
          <Help size={20} />
        </button>

        {/* Notifications Popover */}
        <div className="header-popover-anchor">
          <Popover
            open={isNotificationOpen}
            align="bottom-right"
            onRequestClose={() => setIsNotificationOpen(false)}
          >
            <button
              ref={notificationBtnRef}
              type="button"
              aria-label="Notifications"
              className={`header-icon-btn ${isNotificationOpen ? "active" : ""}`}
              onClick={() => {
                setIsNotificationOpen((prev) => !prev);
                setIsUserMenuOpen(false);
              }}
            >
              <Notification size={20} />
              {unreadCount > 0 && (
                <span className="header-badge-count">{unreadCount}</span>
              )}
            </button>

            <PopoverContent className="notifications-popover-content">
              <div className="popover-header">
                <div className="title-row">
                  <h6>Notifications</h6>
                  {unreadCount > 0 && (
                    <Tag type="blue" size="sm">
                      {unreadCount} unread
                    </Tag>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    className="mark-all-read-btn"
                    onClick={markAllRead}
                  >
                    <Checkmark size={14} /> Mark all read
                  </button>
                )}
              </div>

              <div className="notifications-tab-bar">
                <button
                  type="button"
                  className={`tab-btn ${notificationTab === "all" ? "active" : ""}`}
                  onClick={() => setNotificationTab("all")}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  className={`tab-btn ${notificationTab === "requests" ? "active" : ""}`}
                  onClick={() => setNotificationTab("requests")}
                >
                  Requests
                </button>
                <button
                  type="button"
                  className={`tab-btn ${notificationTab === "system" ? "active" : ""}`}
                  onClick={() => setNotificationTab("system")}
                >
                  System
                </button>
              </div>

              <div className="notifications-list">
                {filteredNotifications.length === 0 ? (
                  <div className="no-notifications">No notifications to display</div>
                ) : (
                  filteredNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`notification-item ${notif.unread ? "unread" : ""}`}
                    >
                      {notif.unread && <div className="unread-dot" />}
                      <div className="notif-content">
                        <div className="notif-title">{notif.title}</div>
                        <div className="notif-desc">{notif.description}</div>
                        <div className="notif-time">{notif.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Settings Button */}
        <button
          type="button"
          aria-label="Settings"
          onClick={() => navigate("/settings")}
          className="header-icon-btn"
        >
          <Settings size={20} />
        </button>

        {/* User Profile Popover */}
        <div className="header-popover-anchor">
          <Popover
            open={isUserMenuOpen}
            align="bottom-right"
            onRequestClose={() => setIsUserMenuOpen(false)}
          >
            <button
              ref={userBtnRef}
              type="button"
              aria-label="User Profile"
              className={`user-profile-btn ${isUserMenuOpen ? "active" : ""}`}
              onClick={() => {
                setIsUserMenuOpen((prev) => !prev);
                setIsNotificationOpen(false);
              }}
            >
              <div className="user-avatar">
                {userInitial}
                <span className="online-dot" />
              </div>
              <ChevronDown size={14} className="user-arrow" />
            </button>

            <PopoverContent className="user-menu-popover-content">
              <div className="user-info-section">
                <div className="user-avatar-large">
                  {userInitial}
                  <span className="avatar-online-dot" />
                </div>
                <div className="user-meta">
                  <div className="user-name">{userName}</div>
                  <div className="user-email">{userEmail}</div>
                  <Tag type="blue" size="sm" className="role-tag">
                    {userRole}
                  </Tag>
                </div>
              </div>

              <div className="user-menu-divider" />

              <div className="user-quick-links">
                <button
                  type="button"
                  className="menu-link-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate("/profile");
                  }}
                >
                  <User size={16} /> My Profile & Preferences
                </button>
                <button
                  type="button"
                  className="menu-link-btn"
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate("/settings");
                  }}
                >
                  <Settings size={16} /> Workspace Settings
                </button>
              </div>

              <div className="user-menu-divider" />

              <div className="user-menu-actions">
                <Button
                  kind="danger--ghost"
                  size="sm"
                  renderIcon={Logout}
                  onClick={handleLogout}
                  className="user-logout-btn"
                >
                  Sign Out
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};
