"use client";

import * as React from "react";
import { Plus, Search, ShieldAlert, AlertTriangle, ShieldX } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { ViolationTable } from "@/components/keamanan/violation-table";
import { ViolationFormDialog } from "@/components/keamanan/violation-form-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useKeamananStore } from "@/store/use-keamanan-store";
import type { Violation, ViolationSeverity } from "@/types";

export default function PelanggaranPage() {
  const { violations, deleteViolation } = useKeamananStore();

  const [search, setSearch] = React.useState("");
  const [severityFilter, setSeverityFilter] = React.useState<"ALL" | ViolationSeverity>("ALL");
  const [loading, setLoading] = React.useState(true);
  const [formOpen, setFormOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Violation | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const ringan = violations.filter((v) => v.severity === "RINGAN").length;
  const sedang = violations.filter((v) => v.severity === "SEDANG").length;
  const berat = violations.filter((v) => v.severity === "BERAT").length;

  const filtered = violations.filter((v) => {
    const matchesSearch = v.santriName.toLowerCase().includes(search.toLowerCase()) || v.santriNis.includes(search);
    const matchesSeverity = severityFilter === "ALL" || v.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Pelanggaran</h1>
          <p className="text-sm text-muted-foreground">Catat dan pantau pelanggaran tata tertib santri.</p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4" /> Catat Pelanggaran
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard title="Pelanggaran Ringan" value={ringan.toString()} icon={ShieldAlert} accent="primary" index={0} />
        <KpiCard title="Pelanggaran Sedang" value={sedang.toString()} icon={AlertTriangle} accent="amber" index={1} />
        <KpiCard title="Pelanggaran Berat" value={berat.toString()} icon={ShieldX} accent="sky" index={2} />
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
          <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as typeof severityFilter)}>
            <SelectTrigger className="sm:w-52"><SelectValue placeholder="Tingkat" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Semua Tingkat</SelectItem>
              <SelectItem value="RINGAN">Ringan</SelectItem>
              <SelectItem value="SEDANG">Sedang</SelectItem>
              <SelectItem value="BERAT">Berat</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <ViolationTable data={filtered} loading={loading} onDelete={(v) => setDeleteTarget(v)} />
      </Card>

      <ViolationFormDialog open={formOpen} onOpenChange={setFormOpen} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus catatan pelanggaran?"
        description="Catatan pelanggaran ini akan dihapus permanen."
        onConfirm={() => {
          if (deleteTarget) {
            deleteViolation(deleteTarget.id);
            toast.success("Catatan pelanggaran dihapus");
          }
        }}
      />
    </div>
  );
}
