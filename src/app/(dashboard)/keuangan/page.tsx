"use client";

import * as React from "react";
import { Plus, Search, Download, FileText, Wallet, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PaymentTable } from "@/components/keuangan/payment-table";
import { PaymentFormDialog } from "@/components/keuangan/payment-form-dialog";
import { ReceiptDialog } from "@/components/keuangan/receipt-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { usePaymentStore } from "@/store/use-payment-store";
import { formatRupiah } from "@/lib/utils";
import { exportToExcel, exportToPDF } from "@/lib/export";
import { TYPE_LABELS } from "@/components/keuangan/payment-badges";
import type { Payment, PaymentStatus } from "@/types";

const PAGE_SIZE = 10;

export default function KeuanganPage() {
  const { payments, deletePayment, verifyPayment, rejectPayment } = usePaymentStore();

  const [tab, setTab] = React.useState<"ALL" | PaymentStatus>("ALL");
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("ALL");
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingPayment, setEditingPayment] = React.useState<Payment | null>(null);
  const [receiptPayment, setReceiptPayment] = React.useState<Payment | null>(null);
  const [receiptOpen, setReceiptOpen] = React.useState(false);
  const [rejectTarget, setRejectTarget] = React.useState<Payment | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<Payment | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const totalLunas = payments.filter((p) => p.status === "LUNAS").reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter((p) => p.status === "MENUNGGU_VERIFIKASI").length;
  const totalBelumBayar = payments.filter((p) => p.status === "BELUM_BAYAR").length;

  const filtered = React.useMemo(() => {
    return payments.filter((p) => {
      const matchesTab = tab === "ALL" || p.status === tab;
      const matchesSearch = p.santriName.toLowerCase().includes(search.toLowerCase()) || p.santriNis.includes(search);
      const matchesType = typeFilter === "ALL" || p.type === typeFilter;
      return matchesTab && matchesSearch && matchesType;
    });
  }, [payments, tab, search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleExportExcel = () => {
    const rows = filtered.map((p) => ({
      Santri: p.santriName,
      NIS: p.santriNis,
      Jenis: TYPE_LABELS[p.type],
      Periode: p.period,
      Nominal: p.amount,
      Status: p.status,
      Metode: p.method,
      "No. Kwitansi": p.receiptNumber ?? "-",
    }));
    exportToExcel(rows, `rekap-pembayaran-${new Date().toISOString().slice(0, 10)}.xlsx`, "Pembayaran");
    toast.success("Excel berhasil diunduh");
  };

  const handleExportPDF = () => {
    exportToPDF(
      "Rekap Pembayaran Santri",
      ["Santri", "NIS", "Jenis", "Periode", "Nominal", "Status"],
      filtered.map((p) => [p.santriName, p.santriNis, TYPE_LABELS[p.type], p.period, formatRupiah(p.amount), p.status]),
      `rekap-pembayaran-${new Date().toISOString().slice(0, 10)}.pdf`
    );
    toast.success("PDF berhasil diunduh");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Pembayaran</h1>
          <p className="text-sm text-muted-foreground">Kelola syahriah, daftar ulang, infaq, dan tabungan santri.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportExcel}><Download className="h-4 w-4" /> Excel</Button>
          <Button variant="outline" onClick={handleExportPDF}><FileText className="h-4 w-4" /> PDF</Button>
          <Button onClick={() => { setEditingPayment(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> Catat Pembayaran
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard title="Total Pemasukan (Lunas)" value={formatRupiah(totalLunas)} icon={Wallet} accent="primary" index={0} />
        <KpiCard title="Menunggu Verifikasi" value={totalPending.toString()} icon={Clock} accent="amber" index={1} />
        <KpiCard title="Belum Bayar" value={totalBelumBayar.toString()} icon={AlertCircle} accent="sky" index={2} />
      </div>

      <Card>
        <CardContent className="space-y-4 p-4 sm:p-5">
          <Tabs value={tab} onValueChange={(v) => { setTab(v as typeof tab); setPage(1); }}>
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="ALL">Semua</TabsTrigger>
              <TabsTrigger value="LUNAS">Lunas</TabsTrigger>
              <TabsTrigger value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</TabsTrigger>
              <TabsTrigger value="BELUM_BAYAR">Belum Bayar</TabsTrigger>
              <TabsTrigger value="DITOLAK">Ditolak</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau NIS santri..."
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(1); }}>
              <SelectTrigger className="lg:w-48"><SelectValue placeholder="Jenis" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Jenis</SelectItem>
                {Object.entries(TYPE_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <PaymentTable
          data={paginated}
          loading={loading}
          onEdit={(p) => { setEditingPayment(p); setFormOpen(true); }}
          onDelete={(p) => setDeleteTarget(p)}
          onVerify={(p) => { verifyPayment(p.id); toast.success("Pembayaran diverifikasi", { description: `${p.santriName} — status diubah menjadi Lunas.` }); }}
          onReject={(p) => setRejectTarget(p)}
          onPrintReceipt={(p) => { setReceiptPayment(p); setReceiptOpen(true); }}
        />
        {!loading && filtered.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              Menampilkan {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} transaksi
            </p>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Sebelumnya</Button>
              <span className="px-2 text-xs text-muted-foreground">Hal {page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Berikutnya</Button>
            </div>
          </div>
        )}
      </Card>

      <PaymentFormDialog open={formOpen} onOpenChange={setFormOpen} payment={editingPayment} />
      <ReceiptDialog payment={receiptPayment} open={receiptOpen} onOpenChange={setReceiptOpen} />
      <ConfirmDialog
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        title="Tolak pembayaran ini?"
        description={`Pembayaran ${rejectTarget?.santriName ?? ""} akan ditandai sebagai ditolak.`}
        confirmLabel="Tolak"
        onConfirm={() => {
          if (rejectTarget) {
            rejectPayment(rejectTarget.id, "Bukti transfer tidak sesuai");
            toast.success("Pembayaran ditolak");
          }
        }}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus catatan pembayaran?"
        description="Data pembayaran ini akan dihapus permanen."
        onConfirm={() => {
          if (deleteTarget) {
            deletePayment(deleteTarget.id);
            toast.success("Catatan pembayaran dihapus");
          }
        }}
      />
    </div>
  );
}
