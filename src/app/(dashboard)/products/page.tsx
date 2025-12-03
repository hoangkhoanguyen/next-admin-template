"use client";

import { useState } from "react";

import { BasicTable } from "@/components/features/tables/BasicTable";
import { products } from "@/mock/products";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui";
import Image from "next/image";
import type { Product } from "@/types/product";
import Header from "@/components/shared/Header";
import { Container } from "@/components/shared/Container";

const PAGE_SIZE = 3;

import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<Product, any>[] = [
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
  const total = products.length;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <Header />
      <Container className="py-5">
        <BasicTable data={paginated} columns={columns} className="mb-4" />

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
