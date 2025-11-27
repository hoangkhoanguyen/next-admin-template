import React from "react";
import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { SidebarProvider } from "@/components/ui";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />
      <Header />
      <main className="flex-1 p-4 ps-[calc(var(--sidebar-width))] pt-14">
        {children}
      </main>
    </SidebarProvider>
  );
}
