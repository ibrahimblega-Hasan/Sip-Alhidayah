"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Search, FileSpreadsheet, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SantriTable } from "@/components/santri/santri-table";
import { SantriFormDialog } from "@/components/santri/santri-form-dialog";
import { SantriDetailSheet } from "@/components/santri/santri-detail-sheet";
import { ImportExportDialog } from "@/components/santri/import-export-dialog";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useSantriStore } from "@/store/use-santri-store";
import { toast } from "sonner";
import type { Santri } from "@/types";

const PAGE_SIZE = 10;

export default function SantriPage() {
  return (
    <Suspense fallback={null}>
      <SantriPageContent />
    </Suspense>
  );
}

function SantriPageContent() {
  const { santris, deleteSantri } = useSantriStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = React.useState("");
  const [kelasFilter, setKelasFilter] = React.useState("ALL");
  const [asramaFilter, setAsramaFilter] = React.useState("ALL");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [genderFilter, setGenderFilter] = React.useState("ALL");
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(true);

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingSantri, setEditingSantri] = React.useState<Santri | null>(null);
  const [viewingSantri, setViewingSantri] = React.useState<Santri | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [importOpen, setImportOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<Santri | null>(null);

  const highlightId = searchParams.get("highlight");

  React.useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (searchParams.get("new") === "1") {
      setEditingSantri(null);
      setFormOpen(true);
      router.replace("/santri");
    }
  }, [searchParams, router]);

  const kelasOptions = React.useMemo(() => Array.from(new Set(santris.map((s) => s.kelas))).sort(), [santris]);
  const asramaOptions = React.useMemo(() => Array.from(new Set(santris.map((s) => s.asrama))).sort(), [santris]);

  const filtered = React.useMemo(() => {
    return santris.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search);
      const matchesKelas = kelasFilter === "ALL" || s.kelas === kelasFilter;
      const matchesAsrama = asramaFilter === "ALL" || s.asrama === asramaFilter;
      const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
      const matchesGender = genderFilter === "ALL" || s.gender === genderFilter;
      return matchesSearch && matchesKelas && matchesAsrama && matchesStatus && matchesGender;
    });
  }, [santris, search, kelasFilter, asramaFilter, statusFilter, genderFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeFilterCount = [kelasFilter, asramaFilter, statusFilter, genderFilter].filter((f) => f !== "ALL").length;

  const resetFilters = () => {
    setKelasFilter("ALL");
    setAsramaFilter("ALL");
    setStatusFilter("ALL");
    setGenderFilter("ALL");
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Data Santri</h1>
          <p className="text-sm text-muted-foreground">Kelola data induk santri putra dan putri.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <FileSpreadsheet className="h-4 w-4" /> Impor/Ekspor
          </Button>
          <Button onClick={() => { setEditingSantri(null); setFormOpen(true); }}>
            <Plus className="h-4 w-4" /> Tambah Santri
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-4 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau NIS santri..."
                className="pl-9"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 lg:flex">
              <Select value={genderFilter} onValueChange={(v) => { setGenderFilter(v); setPage(1); }}>
                <SelectTrigger className="lg:w-36"><SelectValue placeholder="Gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Gender</SelectItem>
                  <SelectItem value="PUTRA">Putra</SelectItem>
                  <SelectItem value="PUTRI">Putri</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger className="lg:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Status</SelectItem>
                  <SelectItem value="AKTIF">Aktif</SelectItem>
                  <SelectItem value="CUTI">Cuti</SelectItem>
                  <SelectItem value="ALUMNI">Alumni</SelectItem>
                  <SelectItem value="KELUAR">Keluar</SelectItem>
                </SelectContent>
              </Select>
              <Select value={kelasFilter} onValueChange={(v) => { setKelasFilter(v); setPage(1); }}>
                <SelectTrigger className="lg:w-36"><SelectValue placeholder="Kelas" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Kelas</SelectItem>
                  {kelasOptions.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={asramaFilter} onValueChange={(v) => { setAsramaFilter(v); setPage(1); }}>
                <SelectTrigger className="lg:w-44"><SelectValue placeholder="Asrama" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Semua Asrama</SelectItem>
                  {asramaOptions.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <Badge variant="secondary">{activeFilterCount} filter aktif</Badge>
              <button onClick={resetFilters} className="inline-flex items-center gap-0.5 text-primary hover:underline">
                <X className="h-3 w-3" /> Reset
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <SantriTable
          data={paginated}
          loading={loading}
          highlightId={highlightId}
          onView={(s) => { setViewingSantri(s); setDetailOpen(true); }}
          onEdit={(s) => { setEditingSantri(s); setFormOpen(true); }}
          onDelete={(s) => setDeleteTarget(s)}
        />
        {!loading && filtered.length > 0 && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row">
            <p className="text-xs text-muted-foreground">
              Menampilkan {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} santri
            </p>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
                Sebelumnya
              </Button>
              <span className="px-2 text-xs text-muted-foreground">Hal {page} / {totalPages}</span>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
                Berikutnya
              </Button>
            </div>
          </div>
        )}
      </Card>

      <SantriFormDialog open={formOpen} onOpenChange={setFormOpen} santri={editingSantri} />
      <SantriDetailSheet santri={viewingSantri} open={detailOpen} onOpenChange={setDetailOpen} />
      <ImportExportDialog open={importOpen} onOpenChange={setImportOpen} />
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Hapus data santri?"
        description={`Data ${deleteTarget?.name ?? ""} akan dihapus permanen dan tidak dapat dikembalikan.`}
        onConfirm={() => {
          if (deleteTarget) {
            deleteSantri(deleteTarget.id);
            toast.success("Data santri dihapus", { description: `${deleteTarget.name} berhasil dihapus.` });
          }
        }}
      />
    </div>
  );
}
