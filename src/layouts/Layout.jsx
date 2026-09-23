import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router";
import { Breadcrumb, BreadcrumbItem } from "@carbon/react";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { Header } from "../components/Header/Header";
import "./layout.scss";

export const Layout = () => {
  const [isSidebarLocked, setIsSidebarLocked] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const location = useLocation();

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

  // Generate breadcrumb items
  const pathSegments = location.pathname.split("/").filter(Boolean);

  return (
    <div className={`layout ${isExpanded ? "" : "collapsed"}`}>
      <Sidebar
        isCollapsed={!isExpanded}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      <div className="layout-content">
        <Header onToggleSidebar={toggleSidebar} />
        <div className="layout-sub-bar">
          <Breadcrumb noTrailingSlash aria-label="Page navigation breadcrumb">
            <BreadcrumbItem>
              <Link to="/dashboard">Home</Link>
            </BreadcrumbItem>
            {pathSegments.map((segment, index) => {
              const url = `/${pathSegments.slice(0, index + 1).join("/")}`;
              const isCurrentPage = index === pathSegments.length - 1;
              const formattedName = segment
                .replace(/-/g, " ")
                .replace(/\b\w/g, (l) => l.toUpperCase());

              return (
                <BreadcrumbItem key={url} isCurrentPage={isCurrentPage}>
                  {isCurrentPage ? (
                    formattedName
                  ) : (
                    <Link to={url}>{formattedName}</Link>
                  )}
                </BreadcrumbItem>
              );
            })}
          </Breadcrumb>
        </div>
        <main className="main-content-scroll">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
