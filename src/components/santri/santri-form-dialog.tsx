"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Upload, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { santriSchema, type SantriFormValues } from "@/lib/validations/santri";
import { useSantriStore } from "@/store/use-santri-store";
import {
  JENIS_PONDOK_LABELS,
  JENJANG_PONDOK_LABELS,
  JENJANG_SEKOLAH_ASAL_LABELS,
  PENGHASILAN_LABELS,
  STATUS_RUMAH_LABELS,
  STATUS_ORANG_TUA_LABELS,
  PROVINSI_OPTIONS,
} from "@/lib/constants";
import type { Santri } from "@/types";

const KELAS_OPTIONS = ["VII A", "VII B", "VIII A", "VIII B", "IX A", "X IPA 1", "X IPA 2", "XI IPS 1", "XII Agama"];
const ASRAMA_OPTIONS = ["Asrama Al-Farabi", "Asrama Ibnu Sina", "Asrama Al-Khawarizmi", "Asrama Khadijah", "Asrama Aisyah", "Asrama Fatimah"];

const EMPTY_VALUES: SantriFormValues = {
  jenisPondok: undefined,
  jenjangPondok: undefined,
  nis: "",
  nisn: "",
  nik: "",
  name: "",
  tempatLahir: "",
  birthDate: "",
  gender: "PUTRA",
  status: "AKTIF",
  kelas: "",
  asrama: "",
  sekolahAsal: "",
  jenjangSekolahAsal: undefined,
  address: "",
  provinsi: "",
  kabupaten: "",
  kecamatan: "",
  kodePos: "",
  namaAyah: "",
  nikAyah: "",
  pekerjaanAyah: "",
  penghasilanAyah: undefined,
  statusAyah: "HIDUP",
  namaIbu: "",
  nikIbu: "",
  pekerjaanIbu: "",
  penghasilanIbu: undefined,
  statusIbu: "HIDUP",
  statusRumah: undefined,
  parentPhone: "",
};

interface SantriFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  santri?: Santri | null;
}

export function SantriFormDialog({ open, onOpenChange, santri }: SantriFormDialogProps) {
  const { addSantri, updateSantri } = useSantriStore();
  const isEditing = !!santri;
  const [photoName, setPhotoName] = React.useState<string | null>(null);
  const [kkName, setKkName] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SantriFormValues>({
    resolver: zodResolver(santriSchema),
    defaultValues: EMPTY_VALUES,
  });

  React.useEffect(() => {
    if (!open) return;
    setPhotoName(null);
    setKkName(santri?.fotoKkFileName ?? null);
    reset(
      santri
        ? {
            jenisPondok: santri.jenisPondok,
            jenjangPondok: santri.jenjangPondok,
            nis: santri.nis,
            nisn: santri.nisn ?? "",
            nik: santri.nik ?? "",
            name: santri.name,
            tempatLahir: santri.tempatLahir ?? "",
            birthDate: santri.birthDate ?? "",
            gender: santri.gender,
            status: santri.status,
            kelas: santri.kelas,
            asrama: santri.asrama,
            sekolahAsal: santri.sekolahAsal ?? "",
            jenjangSekolahAsal: santri.jenjangSekolahAsal,
            address: santri.address ?? "",
            provinsi: santri.provinsi ?? "",
            kabupaten: santri.kabupaten ?? "",
            kecamatan: santri.kecamatan ?? "",
            kodePos: santri.kodePos ?? "",
            namaAyah: santri.namaAyah ?? "",
            nikAyah: santri.nikAyah ?? "",
            pekerjaanAyah: santri.pekerjaanAyah ?? "",
            penghasilanAyah: santri.penghasilanAyah,
            statusAyah: santri.statusAyah ?? "HIDUP",
            namaIbu: santri.namaIbu ?? "",
            nikIbu: santri.nikIbu ?? "",
            pekerjaanIbu: santri.pekerjaanIbu ?? "",
            penghasilanIbu: santri.penghasilanIbu,
            statusIbu: santri.statusIbu ?? "HIDUP",
            statusRumah: santri.statusRumah,
            parentPhone: santri.parentPhone ?? "",
          }
        : EMPTY_VALUES
    );
  }, [open, santri, reset]);

  const onSubmit = async (values: SantriFormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    const payload = { ...values, fotoKkFileName: kkName ?? santri?.fotoKkFileName };
    if (isEditing && santri) {
      updateSantri(santri.id, payload);
      toast.success("Data santri diperbarui", { description: `${values.name} berhasil disimpan.` });
    } else {
      addSantri(payload);
      toast.success("Santri baru ditambahkan", { description: `${values.name} berhasil didaftarkan.` });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Data Santri" : "Tambah Santri Baru"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Perbarui informasi santri di bawah ini." : "Lengkapi formulir pendaftaran santri baru."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="identitas">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="identitas">Identitas</TabsTrigger>
              <TabsTrigger value="sekolah">Sekolah Asal</TabsTrigger>
              <TabsTrigger value="alamat">Alamat</TabsTrigger>
              <TabsTrigger value="ortu">Data Orang Tua</TabsTrigger>
              <TabsTrigger value="dokumen">Dokumen</TabsTrigger>
            </TabsList>

            {/* Tab: Identitas */}
            <TabsContent value="identitas" className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-h-[50vh] overflow-y-auto scrollbar-thin pr-1">
              <div className="space-y-1.5">
                <Label>Jenis Pondok</Label>
                <Controller control={control} name="jenisPondok" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Pilih jenis pondok" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(JENIS_PONDOK_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div className="space-y-1.5">
                <Label>Jenjang Pondok</Label>
                <Controller control={control} name="jenjangPondok" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Pilih jenjang" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(JENJANG_PONDOK_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nis">NIS (Internal)</Label>
                <Input id="nis" placeholder="20240001" {...register("nis")} />
                {errors.nis && <p className="text-xs text-destructive">{errors.nis.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nisn">NISN</Label>
                <Input id="nisn" placeholder="0030000001" {...register("nisn")} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="nik">NIK Santri</Label>
                <Input id="nik" placeholder="16 digit NIK" maxLength={16} {...register("nik")} />
                {errors.nik && <p className="text-xs text-destructive">{errors.nik.message}</p>}
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input id="name" placeholder="Ahmad Fauzan" {...register("name")} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tempatLahir">Tempat Lahir</Label>
                <Input id="tempatLahir" placeholder="Surabaya" {...register("tempatLahir")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="birthDate">Tanggal Lahir</Label>
                <Input id="birthDate" type="date" {...register("birthDate")} />
              </div>

              <div className="space-y-1.5">
                <Label>Jenis Kelamin</Label>
                <Controller control={control} name="gender" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUTRA">Putra</SelectItem>
                      <SelectItem value="PUTRI">Putri</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Controller control={control} name="status" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AKTIF">Aktif</SelectItem>
                      <SelectItem value="CUTI">Cuti</SelectItem>
                      <SelectItem value="ALUMNI">Alumni</SelectItem>
                      <SelectItem value="KELUAR">Keluar</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>

              <div className="space-y-1.5">
                <Label>Kelas</Label>
                <Controller control={control} name="kelas" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Pilih kelas" /></SelectTrigger>
                    <SelectContent>{KELAS_OPTIONS.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
                  </Select>
                )} />
                {errors.kelas && <p className="text-xs text-destructive">{errors.kelas.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Asrama</Label>
                <Controller control={control} name="asrama" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Pilih asrama" /></SelectTrigger>
                    <SelectContent>{ASRAMA_OPTIONS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent>
                  </Select>
                )} />
                {errors.asrama && <p className="text-xs text-destructive">{errors.asrama.message}</p>}
              </div>
            </TabsContent>

            {/* Tab: Sekolah Asal */}
            <TabsContent value="sekolah" className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-h-[50vh] overflow-y-auto scrollbar-thin pr-1">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="sekolahAsal">Nama Sekolah Asal</Label>
                <Input id="sekolahAsal" placeholder="SDN Surabaya 1" {...register("sekolahAsal")} />
              </div>
              <div className="space-y-1.5">
                <Label>Jenjang Sekolah Asal</Label>
                <Controller control={control} name="jenjangSekolahAsal" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Pilih jenjang" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(JENJANG_SEKOLAH_ASAL_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </TabsContent>

            {/* Tab: Alamat */}
            <TabsContent value="alamat" className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-h-[50vh] overflow-y-auto scrollbar-thin pr-1">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Input id="address" placeholder="Jl. Merdeka No. 1" {...register("address")} />
              </div>
              <div className="space-y-1.5">
                <Label>Provinsi</Label>
                <Controller control={control} name="provinsi" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Pilih provinsi" /></SelectTrigger>
                    <SelectContent>{PROVINSI_OPTIONS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
                  </Select>
                )} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kabupaten">Kabupaten/Kota</Label>
                <Input id="kabupaten" placeholder="Surabaya" {...register("kabupaten")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kecamatan">Kecamatan</Label>
                <Input id="kecamatan" placeholder="Wonokromo" {...register("kecamatan")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="kodePos">Kode Pos</Label>
                <Input id="kodePos" placeholder="60243" {...register("kodePos")} />
              </div>
            </TabsContent>

            {/* Tab: Data Orang Tua */}
            <TabsContent value="ortu" className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-h-[50vh] overflow-y-auto scrollbar-thin pr-1">
              <div className="space-y-1.5 sm:col-span-2">
                <p className="text-xs font-semibold text-muted-foreground">Data Ayah</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="namaAyah">Nama Ayah</Label>
                <Input id="namaAyah" {...register("namaAyah")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nikAyah">NIK Ayah</Label>
                <Input id="nikAyah" maxLength={16} {...register("nikAyah")} />
                {errors.nikAyah && <p className="text-xs text-destructive">{errors.nikAyah.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pekerjaanAyah">Pekerjaan Ayah</Label>
                <Input id="pekerjaanAyah" placeholder="Wiraswasta" {...register("pekerjaanAyah")} />
              </div>
              <div className="space-y-1.5">
                <Label>Penghasilan Ayah</Label>
                <Controller control={control} name="penghasilanAyah" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Pilih rentang" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(PENGHASILAN_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Status Ayah</Label>
                <Controller control={control} name="statusAyah" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="sm:w-52"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_ORANG_TUA_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </div>

              <div className="space-y-1.5 sm:col-span-2 pt-2">
                <p className="text-xs font-semibold text-muted-foreground">Data Ibu</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="namaIbu">Nama Ibu</Label>
                <Input id="namaIbu" {...register("namaIbu")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nikIbu">NIK Ibu</Label>
                <Input id="nikIbu" maxLength={16} {...register("nikIbu")} />
                {errors.nikIbu && <p className="text-xs text-destructive">{errors.nikIbu.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pekerjaanIbu">Pekerjaan Ibu</Label>
                <Input id="pekerjaanIbu" placeholder="Ibu Rumah Tangga" {...register("pekerjaanIbu")} />
              </div>
              <div className="space-y-1.5">
                <Label>Penghasilan Ibu</Label>
                <Controller control={control} name="penghasilanIbu" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Pilih rentang" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(PENGHASILAN_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div className="space-y-1.5">
                <Label>Status Ibu</Label>
                <Controller control={control} name="statusIbu" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_ORANG_TUA_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </div>

              <div className="space-y-1.5">
                <Label>Status Rumah</Label>
                <Controller control={control} name="statusRumah" render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger><SelectValue placeholder="Pilih status" /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_RUMAH_LABELS).map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="parentPhone">No. Telepon Orang Tua</Label>
                <Input id="parentPhone" placeholder="08xxxxxxxxxx" {...register("parentPhone")} />
                {errors.parentPhone && <p className="text-xs text-destructive">{errors.parentPhone.message}</p>}
              </div>
            </TabsContent>

            {/* Tab: Dokumen */}
            <TabsContent value="dokumen" className="space-y-4 max-h-[50vh] overflow-y-auto scrollbar-thin pr-1">
              <div className="space-y-1.5">
                <Label>Foto Santri</Label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary-50/50 dark:hover:bg-primary-950/30">
                  {photoName ? <FileCheck2 className="h-4 w-4 text-primary" /> : <Upload className="h-4 w-4" />}
                  <span className="truncate">{photoName ?? "Klik untuk unggah foto santri (JPG/PNG)"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => setPhotoName(e.target.files?.[0]?.name ?? null)} />
                </label>
                <p className="text-xs text-muted-foreground">Jika tidak diunggah, avatar akan dibuat otomatis.</p>
              </div>
              <div className="space-y-1.5">
                <Label>Foto Kartu Keluarga (KK)</Label>
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary-50/50 dark:hover:bg-primary-950/30">
                  {kkName ? <FileCheck2 className="h-4 w-4 text-primary" /> : <Upload className="h-4 w-4" />}
                  <span className="truncate">{kkName ?? "Klik untuk unggah foto KK (JPG/PNG/PDF)"}</span>
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setKkName(e.target.files?.[0]?.name ?? null)} />
                </label>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Tambah Santri"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
