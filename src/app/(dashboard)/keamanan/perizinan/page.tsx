"use client";

import * as React from "react";
import { Plus, Search, DoorOpen, LogOut, LogIn, Clock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { PermitTable } from "@/components/keamanan/permit-table";
import { PermitFormDialog } from "@/components/keamanan/permit-form-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useKeamananStore } from "@/store/use-keamanan-store";
import type { Permit, PermitStatus } from "@/types";

export default function PerizinanPage() {
  const { permits, markExited, markReturned, deletePermit } = useKeamananStore();

  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | PermitStatus>("ALL");
  const [loading, setLoading] = React.useState(true);
  const [formOpen, setFormOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Permit | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const activeCount = permits.filter((p) => p.status === "DISETUJUI").length;
  const pendingCount = permits.filter((p) => p.status === "DIAJUKAN").length;
  const lateCount = permits.filter((p) => p.status === "TERLAMBAT").length;

  const filtered = permits.filter((p) => {
    const matchesSearch = p.santriName.toLowerCase().includes(search.toLowerCase()) || p.santriNis.includes(search);
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Perizinan</h1>
          <p className="text-sm text-muted-foreground">Pantau izin keluar-masuk santri secara langsung.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" /> Buat Izin Keluar
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard title="Sedang di Luar" value={activeCount.toString()} icon={DoorOpen} accent="sky" index={0} />
        <KpiCard title="Menunggu Persetujuan" value={pendingCount.toString()} icon={Clock} accent="amber" index={1} />
        <KpiCard title="Terlambat Kembali" value={lateCount.toString()} icon={LogIn} accent="primary" index={2} />
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:p-5">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari nama atau NIS santri..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="sm:w-52"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Status</SelectItem>
              <SelectItem value="DIAJUKAN">Diajukan</SelectItem>
              <SelectItem value="DISETUJUI">Disetujui (Di Luar)</SelectItem>
              <SelectItem value="KEMBALI">Sudah Kembali</SelectItem>
              <SelectItem value="TERLAMBAT">Terlambat</SelectItem>
              <SelectItem value="DITOLAK">Ditolak</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <PermitTable
          data={filtered}
          loading={loading}
          onExit={(p) => { markExited(p.id); toast.success("Santri tercatat keluar", { description: `${p.santriName} — ${p.destination}` }); }}
          onReturn={(p, late) => {
            markReturned(p.id, late);
            toast.success(late ? "Kembali (terlambat) dicatat" : "Santri tercatat kembali", { description: p.santriName });
          }}
          onDelete={(p) => setDeleteTarget(p)}
        />
      </Card>

      <PermitFormDialog open={formOpen} onOpenChange={setFormOpen} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus data perizinan?"
        description="Catatan izin ini akan dihapus permanen."
        onConfirm={() => {
          if (deleteTarget) {
            deletePermit(deleteTarget.id);
            toast.success("Data perizinan dihapus");
          }
        }}
      />
    </div>
  );
}
