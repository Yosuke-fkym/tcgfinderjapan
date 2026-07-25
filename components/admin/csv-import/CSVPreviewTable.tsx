"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface CSVColumn<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface CSVPreviewTableProps<T> {
  rows: T[];
  columns: CSVColumn<T>[];
  maxRows?: number;
}

export function CSVPreviewTable<T extends Record<string, any>>({
  rows,
  columns,
  maxRows = 10,
}: CSVPreviewTableProps<T>) {
  return (
    <div className="border rounded-lg overflow-auto max-h-100">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {rows.slice(0, maxRows).map((row, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col.key} className="text-xs">
                  {col.render ? col.render(row) : (row[col.key] ?? "-")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}