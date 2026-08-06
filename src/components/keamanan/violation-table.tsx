"use client";

import { Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ViolationSeverityBadge } from "@/components/keamanan/keamanan-badges";
import { formatDate } from "@/lib/utils";
import type { Violation } from "@/types";

export function ViolationTable({
  data,
  loading,
  onDelete,
}: {
  data: Violation[];
  loading?: boolean;
  onDelete: (v: Violation) => void;
}) {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-sm font-medium">Tidak ada catatan pelanggaran</p>
        <p className="text-xs text-muted-foreground">Alhamdulillah, tidak ada pelanggaran pada filter ini.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Santri</TableHead>
          <TableHead>Deskripsi</TableHead>
          <TableHead>Tingkat</TableHead>
          <TableHead>Poin</TableHead>
          <TableHead>Sanksi</TableHead>
          <TableHead>Tanggal</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((v) => (
          <TableRow key={v.id}>
            <TableCell>
              <p className="text-sm font-medium leading-tight">{v.santriName}</p>
              <p className="text-xs text-muted-foreground leading-tight">{v.santriNis}</p>
            </TableCell>
            <TableCell className="max-w-[200px] truncate text-sm">{v.description}</TableCell>
            <TableCell><ViolationSeverityBadge severity={v.severity} /></TableCell>
            <TableCell className="text-sm font-medium">{v.points}</TableCell>
            <TableCell className="max-w-[160px] truncate text-sm text-muted-foreground">{v.penalty ?? "-"}</TableCell>
            <TableCell className="text-xs text-muted-foreground">{formatDate(v.occurredAt)}</TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(v)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
