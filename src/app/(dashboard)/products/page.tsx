"use client";

import { useState } from "react";
import { BasicTable } from "@/components/features/tables/BasicTable";
import {
  FilterManager,
  FilterItem,
  ActiveFilters,
} from "@/components/features/filters/FilterManager";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Label,
  Button,
} from "@/components/ui";
import { products } from "@/mock/products";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui";
import Image from "next/image";
import type { Product } from "@/types/product";
import Header from "@/components/shared/Header";
import { Container } from "@/components/shared/Container";
import type { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Eye, RotateCcw, Plus, Download } from "lucide-react";
import { TableToolbar } from "@/components/features/tables/TableToolbars";
import { Card } from "@/components/ui";
import { useFilters } from "@/components/features/filters/useFilters";

const PAGE_SIZE = 3;

const columns: ColumnDef<Product, any>[] = [
  {
    id: "details",
    header: "",
    cell: ({ row }) => (
      <Link href={`/products/${row.original.id}`}>
        <Button size="icon" variant="ghost" aria-label="View details">
          <Eye className="w-5 h-5" />
        </Button>
      </Link>
    ),
    meta: { align: "center" },
  },
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ getValue }: { getValue: () => string }) => (
      <Image
        src={getValue()}
        alt="Product"
        width={48}
        height={48}
        className="rounded"
      />
    ),
    meta: { align: "center" },
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }: { getValue: () => string }) => (
      <span className="font-medium">{getValue()}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ getValue }: { getValue: () => string }) => (
      <span>{getValue()}</span>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }: { getValue: () => number }) => (
      <span>${getValue()}</span>
    ),
    meta: { align: "right" },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ getValue }: { getValue: () => number }) => (
      <span>{getValue()}</span>
    ),
    meta: { align: "right" },
  },
];

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { filters, setMultipleFilters, addFilter, removeFilter, clearFilters } =
    useFilters();

  // Filter form state
  const [tempCategory, setTempCategory] = useState<string>("");
  const [tempStatus, setTempStatus] = useState<string>("");

  const total = products.length;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Demo: handle create, export
  const handleReload = () => setPage(1);
  const handleCreate = () => alert("Create product action");
  const handleExport = () => alert("Export CSV action");

  const handleApplyFilters = () => {
    const newFilters: FilterItem[] = [];
    if (tempCategory) {
      newFilters.push({
        key: "category",
        label: "Danh mục",
        value: tempCategory,
        displayValue: tempCategory,
      });
    }
    if (tempStatus) {
      newFilters.push({
        key: "status",
        label: "Trạng thái",
        value: tempStatus,
        displayValue:
          tempStatus === "active" ? "Đang hoạt động" : "Ngừng hoạt động",
      });
    }
    setMultipleFilters(newFilters);
  };

  const handleRemoveFilter = (key: string) => {
    removeFilter(key);
    if (key === "category") setTempCategory("");
    if (key === "status") setTempStatus("");
  };

  const handleClearAllFilters = () => {
    clearFilters();
    setTempCategory("");
    setTempStatus("");
  };

  return (
    <>
      <Header breadcrumbItems={[{ label: "Products", isCurrent: true }]} />
      <Container className="py-5">
        <TableToolbar searchValue={search} onSearchChange={setSearch}>
          <Button
            size="icon"
            variant="outline"
            aria-label="Reload table"
            onClick={handleReload}
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
          <FilterManager onApply={handleApplyFilters}>
            {(onClose) => (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Danh mục</Label>
                  <Select value={tempCategory} onValueChange={setTempCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Home">Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select value={tempStatus} onValueChange={setTempStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Đang hoạt động</SelectItem>
                      <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={onClose} className="w-full">
                  Áp dụng bộ lọc
                </Button>
              </div>
            )}
          </FilterManager>
          <Button
            size="icon"
            variant="outline"
            aria-label="Create product"
            onClick={handleCreate}
          >
            <Plus className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-label="Export"
            onClick={handleExport}
          >
            <Download className="w-5 h-5" />
          </Button>
        </TableToolbar>
        <ActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />
        <Card className="mb-4 py-0">
          <BasicTable data={paginated} columns={columns} />
        </Card>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.max(1, p - 1));
                }}
                aria-disabled={page === 1}
                tabIndex={page === 1 ? -1 : 0}
              />
            </PaginationItem>
            {Array.from({ length: pageCount }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPage((p) => Math.min(pageCount, p + 1));
                }}
                aria-disabled={page === pageCount}
                tabIndex={page === pageCount ? -1 : 0}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Container>
    </>
  );
}
