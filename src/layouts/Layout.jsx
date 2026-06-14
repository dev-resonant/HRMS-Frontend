// src/layout/Layout.jsx
import { Outlet } from "react-router";
import { Footer } from "../components/Footer/Footer";
import "./layout.scss";
import { Header } from "../components/Header/Header";
import { Sidebar } from "../components/Sidebar/Sidebar";

export const Layout = () => {
  return (
    <div className={`layout`}>
      <Header />
      <Sidebar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
