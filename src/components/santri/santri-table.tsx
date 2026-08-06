"use client";

import { MoreHorizontal, Pencil, Trash2, Eye, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SantriStatusBadge } from "@/components/santri/santri-status-badge";
import { initials } from "@/lib/utils";
import type { Santri } from "@/types";

interface SantriTableProps {
  data: Santri[];
  loading?: boolean;
  highlightId?: string | null;
  onView: (santri: Santri) => void;
  onEdit: (santri: Santri) => void;
  onDelete: (santri: Santri) => void;
}

export function SantriTable({ data, loading, highlightId, onView, onEdit, onDelete }: SantriTableProps) {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-sm font-medium">Tidak ada data santri ditemukan</p>
        <p className="text-xs text-muted-foreground">Coba ubah kata kunci pencarian atau filter Anda.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Santri</TableHead>
          <TableHead>NIS</TableHead>
          <TableHead>Kelas</TableHead>
          <TableHead>Asrama</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Kontak Wali</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((s) => (
          <TableRow key={s.id} className={s.id === highlightId ? "bg-primary-50/60 dark:bg-primary-950/40" : undefined}>
            <TableCell>
              <button onClick={() => onView(s)} className="flex items-center gap-3 text-left">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={s.photoUrl} alt={s.name} />
                  <AvatarFallback>{initials(s.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium leading-tight hover:underline">{s.name}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{s.gender === "PUTRA" ? "Putra" : "Putri"}</p>
                </div>
              </button>
            </TableCell>
            <TableCell><Badge variant="outline" className="font-mono">{s.nis}</Badge></TableCell>
            <TableCell className="text-sm">{s.kelas}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{s.asrama}</TableCell>
            <TableCell><SantriStatusBadge status={s.status} /></TableCell>
            <TableCell>
              {s.parentPhone ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" /> {s.parentPhone}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => onView(s)}>
                    <Eye /> Lihat Detail
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onEdit(s)}>
                    <Pencil /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => onDelete(s)} className="text-destructive focus:text-destructive">
                    <Trash2 /> Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
