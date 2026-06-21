import { useState } from "react";
import { Outlet } from "react-router";
import "./layout.scss";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Header } from "../components/Header/Header";

export const Layout = () => {
  const [isSidebarLocked, setIsSidebarLocked] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarLocked((prev) => !prev);
  };

  const handleMouseEnter = () => {
    setIsSidebarHovered(true);
  };

  const handleMouseLeave = () => {
    setIsSidebarHovered(false);
  };

  const isExpanded = isSidebarLocked || isSidebarHovered;

  return (
    <div className={`layout ${isExpanded ? "" : "collapsed"}`}>
      <Sidebar
        isCollapsed={!isExpanded}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <div className="layout-content">
        <Header onToggleSidebar={toggleSidebar} />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

