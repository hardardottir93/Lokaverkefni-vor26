import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export function Layout() {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />

      <Outlet />
    </div>
  );
}
