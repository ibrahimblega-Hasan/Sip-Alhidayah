"use client";

import { MoreHorizontal, Pencil, Trash2, CheckCircle2, XCircle, Receipt, Paperclip } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentStatusBadge, PaymentTypeBadge } from "@/components/keuangan/payment-badges";
import { formatRupiah, formatDate } from "@/lib/utils";
import type { Payment } from "@/types";

interface PaymentTableProps {
  data: Payment[];
  loading?: boolean;
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
  onVerify: (payment: Payment) => void;
  onReject: (payment: Payment) => void;
  onPrintReceipt: (payment: Payment) => void;
}

export function PaymentTable({ data, loading, onEdit, onDelete, onVerify, onReject, onPrintReceipt }: PaymentTableProps) {
  if (loading) {
    return (
      <div className="space-y-2 p-4">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
        <p className="text-sm font-medium">Belum ada catatan pembayaran</p>
        <p className="text-xs text-muted-foreground">Coba ubah filter atau tambahkan pembayaran baru.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Santri</TableHead>
          <TableHead>Jenis</TableHead>
          <TableHead>Periode</TableHead>
          <TableHead>Nominal</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Bukti</TableHead>
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
            <TableCell><PaymentTypeBadge type={p.type} /></TableCell>
            <TableCell className="text-sm">
              {new Date(p.period + "-01").toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
            </TableCell>
            <TableCell className="text-sm font-medium">{formatRupiah(p.amount)}</TableCell>
            <TableCell><PaymentStatusBadge status={p.status} /></TableCell>
            <TableCell>
              {p.receiptFileName ? (
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Paperclip className="h-3 w-3" /> Ada
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">-</span>
              )}
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-end gap-1">
                {p.status === "MENUNGGU_VERIFIKASI" && (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:text-primary" onClick={() => onVerify(p)}>
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onReject(p)}>
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {p.status === "LUNAS" && (
                      <DropdownMenuItem onSelect={() => onPrintReceipt(p)}>
                        <Receipt /> Cetak Kwitansi
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onSelect={() => onEdit(p)}>
                      <Pencil /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
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
