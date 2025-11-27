import React from "react";
import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* <div className="fixed h-full hidden md:block top-0 end-0 z-30"> */}
      <Sidebar />
      {/* </div> */}

      <Header />
      <main className="flex-1 p-4 bg-gray-50 dark:bg-gray-900 ps-[calc(var(--sidebar-width))]">
        {children}
      </main>
    </SidebarProvider>
  );
}
