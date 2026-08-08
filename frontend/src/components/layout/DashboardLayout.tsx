import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="mx-auto flex max-w-7xl">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-h-[calc(100vh-4rem)] flex-1 flex-col">
          <div className="border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700"
            >
              Open menu
            </button>
          </div>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
