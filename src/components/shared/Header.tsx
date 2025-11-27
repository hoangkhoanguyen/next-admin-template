"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

export default function Header() {
  const { open } = useSidebar();
  return (
    <header className={"fixed top-0 w-full h-14 bg-background shadow z-20"}>
      <div
        className={cn(
          "w-full h-full",
          open ? "lg:ps-[calc(var(--sidebar-width))]" : ""
        )}
      >
        <div className="h-full flex items-center justify-between w-full px-4">
          {/* Left content */}
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Home</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {/* Right content */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
