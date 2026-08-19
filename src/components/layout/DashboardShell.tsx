"use client";

import React, { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";

export interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col antialiased">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by sidebar width on lg screens) */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0 transition-all duration-300">
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1600px] w-full mx-auto">
          {React.isValidElement(children)
            ? React.cloneElement(children as React.ReactElement<any>, {
                onMenuToggle: () => setIsSidebarOpen(!isSidebarOpen),
              })
            : children}
        </main>
      </div>
    </div>
  );
};
