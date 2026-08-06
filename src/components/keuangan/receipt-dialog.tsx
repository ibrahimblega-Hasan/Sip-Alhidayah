"use client";

import { jsPDF } from "jspdf";
import { Download, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatRupiah, formatDate } from "@/lib/utils";
import { TYPE_LABELS } from "@/components/keuangan/payment-badges";
import { SCHOOL_NAME } from "@/lib/constants";
import type { Payment } from "@/types";

export function ReceiptDialog({
  payment,
  open,
  onOpenChange,
}: {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!payment) return null;

  const handleDownload = () => {
    const doc = new jsPDF({ format: [148, 210] });
    doc.setFillColor(5, 150, 105);
    doc.rect(0, 0, 148, 30, "F");
    doc.setTextColor(255);
    doc.setFontSize(14);
    doc.text("KWITANSI PEMBAYARAN", 10, 14);
    doc.setFontSize(9);
    doc.text(SCHOOL_NAME, 10, 21);

    doc.setTextColor(20);
    doc.setFontSize(10);
    let y = 42;
    const rows: [string, string][] = [
      ["No. Kwitansi", payment.receiptNumber ?? "-"],
      ["Nama Santri", payment.santriName],
      ["NIS", payment.santriNis],
      ["Jenis Pembayaran", TYPE_LABELS[payment.type]],
      ["Periode", payment.period],
      ["Metode", payment.method],
      ["Tanggal Bayar", payment.paidAt ? formatDate(payment.paidAt) : "-"],
    ];
    rows.forEach(([label, value]) => {
      doc.setFont("helvetica", "normal");
      doc.text(label, 10, y);
      doc.text(":", 55, y);
      doc.setFont("helvetica", "bold");
      doc.text(value, 60, y);
      y += 8;
    });

    y += 4;
    doc.setDrawColor(5, 150, 105);
    doc.line(10, y, 138, y);
    y += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Jumlah Dibayar:", 10, y);
    doc.setFontSize(16);
    doc.text(formatRupiah(payment.amount), 10, y + 8);

    doc.save(`kwitansi-${payment.receiptNumber ?? payment.id}.pdf`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Kwitansi Pembayaran</DialogTitle>
        </DialogHeader>

        <div className="overflow-hidden rounded-xl border border-border">
          <div className="bg-primary p-4 text-primary-foreground">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              <p className="font-display text-sm font-bold">{SCHOOL_NAME}</p>
            </div>
            <p className="mt-0.5 text-xs text-primary-foreground/80">No. {payment.receiptNumber ?? "-"}</p>
          </div>
          <div className="space-y-2 p-4 text-sm">
            {[
              ["Nama Santri", payment.santriName],
              ["NIS", payment.santriNis],
              ["Jenis", TYPE_LABELS[payment.type]],
              ["Periode", payment.period],
              ["Metode", payment.method],
              ["Tanggal", payment.paidAt ? formatDate(payment.paidAt) : "-"],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{value}</span>
              </div>
            ))}
            <Separator className="my-2" />
            <div className="flex justify-between text-base">
              <span className="font-semibold">Total</span>
              <span className="font-display font-bold text-primary">{formatRupiah(payment.amount)}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleDownload} className="w-full">
            <Download className="h-4 w-4" /> Unduh PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
