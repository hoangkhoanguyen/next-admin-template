"use client";
import { FC, PropsWithChildren } from "react";
import { useSidebar } from "../ui";
import { cn } from "@/lib/utils/tailwind";

export const Content: FC<PropsWithChildren> = ({ children }) => {
  const { open } = useSidebar();

  return (
    <main
      className={cn("flex-1 py-14 duration-200", {
        "md:ps-[calc(var(--sidebar-width))]": open,
      })}
    >
      {children}
    </main>
  );
};
