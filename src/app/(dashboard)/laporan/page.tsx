"use client";

import * as React from "react";
import { FileBarChart, Download, FileText, Users, Wallet, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { SantriStatusBadge } from "@/components/santri/santri-status-badge";
import { PaymentStatusBadge, TYPE_LABELS } from "@/components/keuangan/payment-badges";
import { useSantriStore } from "@/store/use-santri-store";
import { usePaymentStore } from "@/store/use-payment-store";
import { useKeamananStore } from "@/store/use-keamanan-store";
import { useAuthStore } from "@/store/use-auth-store";
import { formatRupiah } from "@/lib/utils";
import { exportToExcel, exportToPDF } from "@/lib/export";
import type { Gender, SantriStatus, PaymentStatus } from "@/types";

export default function LaporanPage() {
  const { santris } = useSantriStore();
  const { payments } = usePaymentStore();
  const { violations } = useKeamananStore();
  const { user } = useAuthStore();

  const [genderFilter, setGenderFilter] = React.useState<"ALL" | Gender>("ALL");
  const [statusFilter, setStatusFilter] = React.useState<"ALL" | SantriStatus>("ALL");
  const [payStatusFilter, setPayStatusFilter] = React.useState<"ALL" | PaymentStatus>("ALL");
  const [month, setMonth] = React.useState(new Date().toISOString().slice(0, 7));

  const filteredSantri = santris.filter(
    (s) => (genderFilter === "ALL" || s.gender === genderFilter) && (statusFilter === "ALL" || s.status === statusFilter)
  );

  const filteredPayments = payments.filter(
    (p) => p.period === month && (payStatusFilter === "ALL" || p.status === payStatusFilter)
  );

  const monthlyRevenue = filteredPayments.filter((p) => p.status === "LUNAS").reduce((s, p) => s + p.amount, 0);

  const availableTabs = React.useMemo(() => {
    if (!user) return ["santri", "keuangan", "keamanan"];
    if (user.role === "SUPER_ADMIN") return ["santri", "keuangan", "keamanan"];
    if (user.role === "BENDAHARA") return ["keuangan"];
    return ["keamanan"];
  }, [user]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Laporan</h1>
        <p className="text-sm text-muted-foreground">Laporan terfilter berdasarkan tanggal, gender, dan status.</p>
      </div>

      <Tabs defaultValue={availableTabs[0]}>
        <TabsList>
          {availableTabs.includes("santri") && <TabsTrigger value="santri"><Users className="h-4 w-4" /> Santri</TabsTrigger>}
          {availableTabs.includes("keuangan") && <TabsTrigger value="keuangan"><Wallet className="h-4 w-4" /> Keuangan</TabsTrigger>}
          {availableTabs.includes("keamanan") && <TabsTrigger value="keamanan"><ShieldAlert className="h-4 w-4" /> Keamanan</TabsTrigger>}
        </TabsList>

        {availableTabs.includes("santri") && (
          <TabsContent value="santri" className="space-y-4">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Laporan Data Santri</CardTitle>
                  <CardDescription>{filteredSantri.length} santri sesuai filter</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      exportToExcel(
                        filteredSantri.map((s) => ({ NIS: s.nis, Nama: s.name, Gender: s.gender, Kelas: s.kelas, Asrama: s.asrama, Status: s.status })),
                        "laporan-santri.xlsx"
                      );
                      toast.success("Excel diunduh");
                    }}
                  >
                    <Download className="h-4 w-4" /> Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      exportToPDF(
                        "Laporan Data Santri",
                        ["NIS", "Nama", "Gender", "Kelas", "Asrama", "Status"],
                        filteredSantri.map((s) => [s.nis, s.name, s.gender, s.kelas, s.asrama, s.status]),
                        "laporan-santri.pdf"
                      );
                      toast.success("PDF diunduh");
                    }}
                  >
                    <FileText className="h-4 w-4" /> PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Gender</Label>
                    <Select value={genderFilter} onValueChange={(v) => setGenderFilter(v as typeof genderFilter)}>
                      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Semua Gender</SelectItem>
                        <SelectItem value="PUTRA">Putra</SelectItem>
                        <SelectItem value="PUTRI">Putri</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Status</Label>
                    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                      <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Semua Status</SelectItem>
                        <SelectItem value="AKTIF">Aktif</SelectItem>
                        <SelectItem value="CUTI">Cuti</SelectItem>
                        <SelectItem value="ALUMNI">Alumni</SelectItem>
                        <SelectItem value="KELUAR">Keluar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto rounded-xl border border-border scrollbar-thin">
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>NIS</TableHead><TableHead>Nama</TableHead><TableHead>Kelas</TableHead><TableHead>Status</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSantri.slice(0, 50).map((s) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-mono text-xs">{s.nis}</TableCell>
                          <TableCell className="text-sm">{s.name}</TableCell>
                          <TableCell className="text-sm">{s.kelas}</TableCell>
                          <TableCell><SantriStatusBadge status={s.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {availableTabs.includes("keuangan") && (
          <TabsContent value="keuangan" className="space-y-4">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Laporan Keuangan</CardTitle>
                  <CardDescription>Total lunas periode ini: {formatRupiah(monthlyRevenue)}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      exportToExcel(
                        filteredPayments.map((p) => ({ Santri: p.santriName, NIS: p.santriNis, Jenis: TYPE_LABELS[p.type], Nominal: p.amount, Status: p.status })),
                        "laporan-keuangan.xlsx"
                      );
                      toast.success("Excel diunduh");
                    }}
                  >
                    <Download className="h-4 w-4" /> Excel
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      exportToPDF(
                        "Laporan Keuangan",
                        ["Santri", "NIS", "Jenis", "Nominal", "Status"],
                        filteredPayments.map((p) => [p.santriName, p.santriNis, TYPE_LABELS[p.type], formatRupiah(p.amount), p.status]),
                        "laporan-keuangan.pdf"
                      );
                      toast.success("PDF diunduh");
                    }}
                  >
                    <FileText className="h-4 w-4" /> PDF
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Periode</Label>
                    <input
                      type="month"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Status</Label>
                    <Select value={payStatusFilter} onValueChange={(v) => setPayStatusFilter(v as typeof payStatusFilter)}>
                      <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">Semua Status</SelectItem>
                        <SelectItem value="LUNAS">Lunas</SelectItem>
                        <SelectItem value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</SelectItem>
                        <SelectItem value="BELUM_BAYAR">Belum Bayar</SelectItem>
                        <SelectItem value="DITOLAK">Ditolak</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto rounded-xl border border-border scrollbar-thin">
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>Santri</TableHead><TableHead>Jenis</TableHead><TableHead>Nominal</TableHead><TableHead>Status</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments.length === 0 ? (
                        <TableRow><TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">Tidak ada data untuk periode ini</TableCell></TableRow>
                      ) : filteredPayments.map((p) => (
                        <TableRow key={p.id}>
                          <TableCell className="text-sm">{p.santriName}</TableCell>
                          <TableCell className="text-sm">{TYPE_LABELS[p.type]}</TableCell>
                          <TableCell className="text-sm">{formatRupiah(p.amount)}</TableCell>
                          <TableCell><PaymentStatusBadge status={p.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {availableTabs.includes("keamanan") && (
          <TabsContent value="keamanan" className="space-y-4">
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Laporan Pelanggaran</CardTitle>
                  <CardDescription>{violations.length} catatan pelanggaran tercatat</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    exportToPDF(
                      "Laporan Pelanggaran Santri",
                      ["Santri", "Deskripsi", "Tingkat", "Poin"],
                      violations.map((v) => [v.santriName, v.description, v.severity, v.points.toString()]),
                      "laporan-pelanggaran.pdf"
                    );
                    toast.success("PDF diunduh");
                  }}
                >
                  <FileText className="h-4 w-4" /> PDF
                </Button>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto rounded-xl border border-border scrollbar-thin">
                  <Table>
                    <TableHeader>
                      <TableRow><TableHead>Santri</TableHead><TableHead>Deskripsi</TableHead><TableHead>Poin</TableHead></TableRow>
                    </TableHeader>
                    <TableBody>
                      {violations.map((v) => (
                        <TableRow key={v.id}>
                          <TableCell className="text-sm">{v.santriName}</TableCell>
                          <TableCell className="text-sm">{v.description}</TableCell>
                          <TableCell className="text-sm">{v.points}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
