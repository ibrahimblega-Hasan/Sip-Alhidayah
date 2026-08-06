"use client";

import { LogOut, LogIn, Trash2, MoreHorizontal } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PermitStatusBadge } from "@/components/keamanan/keamanan-badges";
import { formatDate } from "@/lib/utils";
import type { Permit } from "@/types";

interface PermitTableProps {
  data: Permit[];
  loading?: boolean;
  onExit: (permit: Permit) => void;
  onReturn: (permit: Permit, late: boolean) => void;
  onDelete: (permit: Permit) => void;
}

export function PermitTable({ data, loading, onExit, onReturn, onDelete }: PermitTableProps) {
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
        <p className="text-sm font-medium">Belum ada data perizinan</p>
        <p className="text-xs text-muted-foreground">Buat izin keluar baru untuk mulai mencatat.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Santri</TableHead>
          <TableHead>Alasan / Tujuan</TableHead>
          <TableHead>Waktu Keluar</TableHead>
          <TableHead>Estimasi Kembali</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((p) => (
          <TableRow key={p.id}>
            <TableCell>
              <p className="text-sm font-medium leading-tight">{p.santriName}</p>
              <p className="text-xs text-muted-foreground leading-tight">{p.santriNis}</p>
            </TableCell>
            <TableCell className="max-w-[220px]">
              <p className="truncate text-sm">{p.reason}</p>
              <p className="truncate text-xs text-muted-foreground">{p.destination}</p>
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {p.exitAt ? formatDate(p.exitAt, true) : "-"}
            </TableCell>
            <TableCell className="text-xs text-muted-foreground">
              {p.expectedReturnAt ? formatDate(p.expectedReturnAt, true) : "-"}
            </TableCell>
            <TableCell><PermitStatusBadge status={p.status} /></TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                {p.status === "DIAJUKAN" && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-sky-600 hover:text-sky-600" onClick={() => onExit(p)} title="Catat keluar">
                    <LogOut className="h-4 w-4" />
                  </Button>
                )}
                {p.status === "DISETUJUI" && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary" onClick={() => onReturn(p, false)} title="Catat kembali">
                    <LogIn className="h-4 w-4" />
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {p.status === "DISETUJUI" && (
                      <DropdownMenuItem onSelect={() => onReturn(p, true)}>Tandai Terlambat Kembali</DropdownMenuItem>
                    )}
                    <DropdownMenuItem onSelect={() => onDelete(p)} className="text-destructive focus:text-destructive">
                      <Trash2 /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
