import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils/tailwind";
import { Button, buttonVariants } from "@/components/ui/button";

// Helper function theo tài liệu
function generatePaginationButtons(
  currentPage: number,
  totalPages: number,
  maxButtons: number = 7
): (number | "ellipsis")[] {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const buttons: (number | "ellipsis")[] = [];
  buttons.push(1);
  if (currentPage <= 3) {
    for (let i = 2; i <= 5; i++) {
      buttons.push(i);
    }
    buttons.push("ellipsis");
    buttons.push(totalPages);
  } else if (currentPage >= totalPages - 2) {
    buttons.push("ellipsis");
    for (let i = totalPages - 4; i <= totalPages; i++) {
      buttons.push(i);
    }
  } else {
    buttons.push("ellipsis");
    buttons.push(currentPage - 1);
    buttons.push(currentPage);
    buttons.push(currentPage + 1);
    buttons.push("ellipsis");
    buttons.push(totalPages);
  }
  return buttons;
}

function Pagination({
  className,
  page,
  pageCount,
  onPageChange,
  ...props
}: React.ComponentProps<"nav"> & {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  const buttons = generatePaginationButtons(page, pageCount);
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    >
      <ul
        data-slot="pagination-content"
        className="flex flex-row items-center gap-1"
      >
        <li data-slot="pagination-item">
          <PaginationPrevious
            aria-disabled={page === 1}
            tabIndex={page === 1 ? -1 : 0}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              if (page > 1) onPageChange(page - 1);
            }}
          />
        </li>
        {buttons.map((button, idx) => (
          <li data-slot="pagination-item" key={idx}>
            {button === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                isActive={page === button}
                aria-current={page === button ? "page" : undefined}
                onClick={(e: React.MouseEvent) => {
                  e.preventDefault();
                  if (page !== button) onPageChange(Number(button));
                }}
              >
                {button}
              </PaginationLink>
            )}
          </li>
        ))}
        <li data-slot="pagination-item">
          <PaginationNext
            aria-disabled={page === pageCount}
            tabIndex={page === pageCount ? -1 : 0}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              if (page < pageCount) onPageChange(page + 1);
            }}
          />
        </li>
      </ul>
    </nav>
  );
}

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: {
  isActive?: boolean;
  size?: "icon" | "default";
} & React.ComponentProps<typeof Button>) {
  return (
    <Button
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      variant={isActive ? "outline" : "ghost"}
      size={size}
      className={className}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      aria-label="Go to previous page"
      variant="ghost"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </Button>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      aria-label="Go to next page"
      variant="ghost"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </Button>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
