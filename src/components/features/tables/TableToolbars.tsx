"use client";
import { SearchInput } from "@/components/ui/search-input";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui";
import { Download, Filter, Plus, RotateCcw } from "lucide-react";
import { ReactNode } from "react";

type TableToolbarProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  children?: ReactNode;
};

export function TableToolbar({
  searchValue,
  onSearchChange,
  children,
}: TableToolbarProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <SearchInput
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        wrapperClassName="flex-1"
        iconPosition="start"
      />
      {children}
    </div>
  );
}
