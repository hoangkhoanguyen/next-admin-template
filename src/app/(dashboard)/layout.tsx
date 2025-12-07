import React from "react";
import Header from "@/components/shared/layout/Header";
import Sidebar from "@/components/shared/layout/Sidebar";
import { SidebarProvider } from "@/components/ui";
import { Content } from "@/components/shared/layout/Content";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />

      <Content>{children}</Content>
    </SidebarProvider>
  );
}
