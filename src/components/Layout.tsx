import { Outlet } from "react-router-dom";
import { Navbar } from "./navbar";

export function Layout() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <Outlet />
    </div>
  );
}
