"use client";

import * as React from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { Download, Upload, FileSpreadsheet, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useSantriStore } from "@/store/use-santri-store";
import type { Santri } from "@/types";

interface ImportExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Exact column order requested for interoperability with the pondok's PPDB /
// EMIS-style spreadsheet template. `nis`, `status`, `kelas`, `asrama`, and
// `enrolled_at` are appended because the rest of the app relies on them
// internally, even though they weren't in the original column list.
const EXPORT_COLUMNS = [
  "jenis_pondok", "jenjang_pondok", "foto_santri", "nis", "nisn", "nik", "nama_lengkap",
  "tempat_lahir", "tanggal_lahir", "jenis_kelamin", "status", "kelas", "asrama",
  "sekolah_asal", "jenjang_sekolah_asal", "alamat", "provinsi", "kabupaten", "kecamatan", "kode_pos",
  "nama_ayah", "nik_ayah", "pekerjaan_ayah", "penghasilan_ayah", "status_ayah",
  "nama_ibu", "nik_ibu", "pekerjaan_ibu", "penghasilan_ibu", "status_ibu",
  "status_rumah", "telepon_ortu", "foto_kk", "enrolled_at",
] as const;

type ImportRow = Partial<Santri> & { name: string; nis: string };

// Accepts the exact snake_case headers from the pondok's template, case-insensitively,
// trimming stray blank columns that spreadsheet exports sometimes include.
function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, "_");
}

function pickCell(row: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    for (const rowKey of Object.keys(row)) {
      if (normalizeHeader(rowKey) === key && row[rowKey] !== undefined && row[rowKey] !== null) {
        return String(row[rowKey]).trim();
      }
    }
  }
  return "";
}

function parseGender(value: string): "PUTRA" | "PUTRI" {
  return /putri|perempuan|^p$/i.test(value) ? "PUTRI" : "PUTRA";
}

export function ImportExportDialog({ open, onOpenChange }: ImportExportDialogProps) {
  const { santris, addSantri } = useSantriStore();
  const [importRows, setImportRows] = React.useState<ImportRow[]>([]);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const rows = santris.map((s) => ({
      jenis_pondok: s.jenisPondok ?? "",
      jenjang_pondok: s.jenjangPondok ?? "",
      foto_santri: s.photoUrl ?? "",
      nis: s.nis,
      nisn: s.nisn ?? "",
      nik: s.nik ?? "",
      nama_lengkap: s.name,
      tempat_lahir: s.tempatLahir ?? "",
      tanggal_lahir: s.birthDate ?? "",
      jenis_kelamin: s.gender === "PUTRA" ? "Putra" : "Putri",
      status: s.status,
      kelas: s.kelas,
      asrama: s.asrama,
      sekolah_asal: s.sekolahAsal ?? "",
      jenjang_sekolah_asal: s.jenjangSekolahAsal ?? "",
      alamat: s.address ?? "",
      provinsi: s.provinsi ?? "",
      kabupaten: s.kabupaten ?? "",
      kecamatan: s.kecamatan ?? "",
      kode_pos: s.kodePos ?? "",
      nama_ayah: s.namaAyah ?? "",
      nik_ayah: s.nikAyah ?? "",
      pekerjaan_ayah: s.pekerjaanAyah ?? "",
      penghasilan_ayah: s.penghasilanAyah ?? "",
      status_ayah: s.statusAyah ?? "",
      nama_ibu: s.namaIbu ?? "",
      nik_ibu: s.nikIbu ?? "",
      pekerjaan_ibu: s.pekerjaanIbu ?? "",
      penghasilan_ibu: s.penghasilanIbu ?? "",
      status_ibu: s.statusIbu ?? "",
      status_rumah: s.statusRumah ?? "",
      telepon_ortu: s.parentPhone ?? "",
      foto_kk: s.fotoKkFileName ?? "",
      enrolled_at: s.enrolledAt,
    }));
    const worksheet = XLSX.utils.json_to_sheet(rows, { header: [...EXPORT_COLUMNS] });
    worksheet["!cols"] = EXPORT_COLUMNS.map(() => ({ wch: 16 }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Santri");
    XLSX.writeFile(workbook, `data-santri-${new Date().toISOString().slice(0, 10)}.xlsx`);
    toast.success("Export berhasil", { description: `${rows.length} data santri diunduh ke Excel.` });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

        const parsed: ImportRow[] = json
          .map((row) => ({
            jenisPondok: pickCell(row, "jenis_pondok") || undefined,
            jenjangPondok: pickCell(row, "jenjang_pondok") || undefined,
            photoUrl: pickCell(row, "foto_santri") || undefined,
            nis: pickCell(row, "nis") || `NIS-${Math.floor(Math.random() * 90000 + 10000)}`,
            nisn: pickCell(row, "nisn") || undefined,
            nik: pickCell(row, "nik") || undefined,
            name: pickCell(row, "nama_lengkap", "nama"),
            tempatLahir: pickCell(row, "tempat_lahir") || undefined,
            birthDate: pickCell(row, "tanggal_lahir") || undefined,
            gender: parseGender(pickCell(row, "jenis_kelamin", "gender")),
            status: "AKTIF" as const,
            kelas: pickCell(row, "kelas") || "-",
            asrama: pickCell(row, "asrama") || "-",
            sekolahAsal: pickCell(row, "sekolah_asal") || undefined,
            jenjangSekolahAsal: pickCell(row, "jenjang_sekolah_asal") || undefined,
            address: pickCell(row, "alamat") || undefined,
            provinsi: pickCell(row, "provinsi") || undefined,
            kabupaten: pickCell(row, "kabupaten") || undefined,
            kecamatan: pickCell(row, "kecamatan") || undefined,
            kodePos: pickCell(row, "kode_pos") || undefined,
            namaAyah: pickCell(row, "nama_ayah") || undefined,
            nikAyah: pickCell(row, "nik_ayah") || undefined,
            pekerjaanAyah: pickCell(row, "pekerjaan_ayah") || undefined,
            penghasilanAyah: pickCell(row, "penghasilan_ayah") || undefined,
            statusAyah: pickCell(row, "status_ayah") || undefined,
            namaIbu: pickCell(row, "nama_ibu") || undefined,
            nikIbu: pickCell(row, "nik_ibu") || undefined,
            pekerjaanIbu: pickCell(row, "pekerjaan_ibu") || undefined,
            penghasilanIbu: pickCell(row, "penghasilan_ibu") || undefined,
            statusIbu: pickCell(row, "status_ibu") || undefined,
            statusRumah: pickCell(row, "status_rumah") || undefined,
            parentPhone: pickCell(row, "telepon_ortu") || undefined,
            fotoKkFileName: pickCell(row, "foto_kk") || undefined,
          }))
          .filter((r) => r.name) as ImportRow[];

        setImportRows(parsed);
        if (parsed.length === 0) {
          toast.error("Tidak ada data valid ditemukan di file ini.", {
            description: "Pastikan kolom 'nama_lengkap' terisi pada setiap baris.",
          });
        }
      } catch (err) {
        toast.error("Gagal membaca file", { description: "Pastikan format file adalah .xlsx atau .csv" });
      }
    };
    reader.readAsBinaryString(file);
  };

  const confirmImport = () => {
    importRows.forEach((row) => {
      addSantri({ ...row, enrolledAt: new Date().toISOString().slice(0, 10) } as Santri);
    });
    toast.success("Impor berhasil", { description: `${importRows.length} santri baru ditambahkan.` });
    setImportRows([]);
    setFileName(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Impor / Ekspor Data Santri</DialogTitle>
          <DialogDescription>
            Kompatibel dengan template kolom PPDB pondok (jenis_pondok, nisn, nik, nama_ayah, dst).
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="export">
          <TabsList>
            <TabsTrigger value="export">Ekspor</TabsTrigger>
            <TabsTrigger value="import">Impor</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-4">
            <div className="rounded-xl border border-dashed border-border p-6 text-center">
              <FileSpreadsheet className="mx-auto mb-3 h-10 w-10 text-primary" />
              <p className="text-sm font-medium">{santris.length} data santri siap diekspor</p>
              <p className="mt-1 text-xs text-muted-foreground">
                File .xlsx berisi {EXPORT_COLUMNS.length} kolom lengkap: identitas, sekolah asal, alamat, dan data orang tua.
              </p>
              <Button className="mt-4" onClick={handleExport}>
                <Download className="h-4 w-4" /> Unduh Excel
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            {importRows.length === 0 ? (
              <div
                className="cursor-pointer rounded-xl border border-dashed border-border p-6 text-center transition-colors hover:border-primary hover:bg-primary-50/50 dark:hover:bg-primary-950/30"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="text-sm font-medium">Klik untuk unggah file Excel/CSV</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Gunakan header: jenis_pondok, jenjang_pondok, nisn, nik, nama_lengkap, tempat_lahir,
                  tanggal_lahir, jenis_kelamin, sekolah_asal, alamat, provinsi, nama_ayah, nik_ayah, dst.
                </p>
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFileChange} />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2 rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-800 dark:bg-primary-950 dark:text-primary-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  {fileName} — {importRows.length} baris siap diimpor
                </div>
                <div className="flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
                  <Info className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  Menampilkan ringkasan kolom utama. Seluruh {EXPORT_COLUMNS.length} kolom (alamat, data ayah/ibu, dst.) tetap ikut terimpor.
                </div>
                <div className="max-h-64 overflow-y-auto rounded-xl border border-border scrollbar-thin">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>NISN</TableHead>
                        <TableHead>Gender</TableHead>
                        <TableHead>Kelas</TableHead>
                        <TableHead>Orang Tua</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {importRows.map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-sm">{row.name}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{row.nisn || "-"}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{row.gender === "PUTRA" ? "Putra" : "Putri"}</Badge>
                          </TableCell>
                          <TableCell className="text-sm">{row.kelas}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{row.namaAyah || row.namaIbu || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button variant="outline" size="sm" onClick={() => { setImportRows([]); setFileName(null); }}>
                  Pilih file lain
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {importRows.length > 0 && (
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button onClick={confirmImport}>Konfirmasi Impor ({importRows.length})</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
