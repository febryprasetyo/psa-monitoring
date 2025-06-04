"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CheckCircle2, XCircle } from "lucide-react"; // ikon centang hijau

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ActionButton from "../actionButton/ActionButton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  type: "user" | "device" | "station";
}

export function DataTable<TData, TValue>({
  columns,
  data,
  type,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              );
            })}
            <TableHead>Action</TableHead>
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length
          ? table.getRowModel().rows.map((row, index) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isStatusColumn = cell.column.id === "is_active";
                    const value = cell.getValue();
                    const isTrue =
                      value === true || value === "true" || value === 1;

                    return (
                      <TableCell
                        key={cell.id}
                        className={
                          cell.column.id === "id" ? "font-semibold" : ""
                        }
                      >
                        {isStatusColumn ? (
                          isTrue ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )
                        ) : (
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )
                        )}
                      </TableCell>
                    );
                  })}
                  <TableCell className="w-20">
                    <ActionButton
                      action="edit"
                      type={type}
                      data={row.original as TableData}
                    />
                  </TableCell>
                </TableRow>
              );
            })
          : null}
      </TableBody>
    </Table>
  );
}
