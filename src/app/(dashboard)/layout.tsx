import React from "react";
import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { SidebarProvider } from "@/components/ui";
import { Content } from "@/components/shared/Content";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar />

      <Content>{children}</Content>
    </SidebarProvider>
  );
}
