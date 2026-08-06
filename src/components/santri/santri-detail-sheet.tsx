"use client";

import { Phone, MapPin, Calendar, Home, User, School, CreditCard, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SantriStatusBadge } from "@/components/santri/santri-status-badge";
import { formatDate, initials } from "@/lib/utils";
import {
  JENIS_PONDOK_LABELS,
  JENJANG_PONDOK_LABELS,
  JENJANG_SEKOLAH_ASAL_LABELS,
  PENGHASILAN_LABELS,
  STATUS_RUMAH_LABELS,
  STATUS_ORANG_TUA_LABELS,
} from "@/lib/constants";
import type { Santri } from "@/types";

function Field({ icon: Icon, label, value }: { icon: typeof Phone; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</p>;
}

export function SantriDetailSheet({
  santri,
  open,
  onOpenChange,
}: {
  santri: Santri | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!santri) return null;

  const alamatLengkap = [santri.address, santri.kecamatan, santri.kabupaten, santri.provinsi, santri.kodePos]
    .filter(Boolean)
    .join(", ");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto scrollbar-thin">
        <SheetHeader>
          <SheetTitle>Detail Santri</SheetTitle>
        </SheetHeader>
        <div className="space-y-6 p-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={santri.photoUrl} alt={santri.name} />
              <AvatarFallback className="text-lg">{initials(santri.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-display text-lg font-semibold leading-tight">{santri.name}</p>
              <p className="text-sm text-muted-foreground">{santri.nis} &middot; {santri.kelas}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <SantriStatusBadge status={santri.status} />
                {santri.jenjangPondok && <Badge variant="outline">{JENJANG_PONDOK_LABELS[santri.jenjangPondok]}</Badge>}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <SectionTitle>Identitas</SectionTitle>
            <Field icon={CreditCard} label="NISN" value={santri.nisn} />
            <Field icon={CreditCard} label="NIK" value={santri.nik} />
            <Field icon={MapPin} label="Tempat, Tanggal Lahir" value={`${santri.tempatLahir ?? "-"}, ${santri.birthDate ? formatDate(santri.birthDate) : "-"}`} />
            <Field icon={Home} label="Asrama" value={santri.asrama} />
            <Field icon={FileText} label="Jenis Pondok" value={santri.jenisPondok ? JENIS_PONDOK_LABELS[santri.jenisPondok] : undefined} />
          </div>

          <Separator />

          <div className="space-y-3">
            <SectionTitle>Sekolah Asal</SectionTitle>
            <Field icon={School} label="Nama Sekolah" value={santri.sekolahAsal} />
            <Field icon={School} label="Jenjang" value={santri.jenjangSekolahAsal ? JENJANG_SEKOLAH_ASAL_LABELS[santri.jenjangSekolahAsal] : undefined} />
          </div>

          <Separator />

          <div className="space-y-3">
            <SectionTitle>Alamat</SectionTitle>
            <Field icon={Home} label="Alamat Lengkap" value={alamatLengkap || undefined} />
          </div>

          <Separator />

          <div className="space-y-3">
            <SectionTitle>Data Ayah</SectionTitle>
            <Field icon={User} label="Nama" value={santri.namaAyah} />
            <Field icon={CreditCard} label="NIK" value={santri.nikAyah} />
            <Field icon={User} label="Pekerjaan" value={santri.pekerjaanAyah} />
            <Field icon={User} label="Penghasilan" value={santri.penghasilanAyah ? PENGHASILAN_LABELS[santri.penghasilanAyah] : undefined} />
            <Field icon={User} label="Status" value={santri.statusAyah ? STATUS_ORANG_TUA_LABELS[santri.statusAyah] : undefined} />
          </div>

          <Separator />

          <div className="space-y-3">
            <SectionTitle>Data Ibu</SectionTitle>
            <Field icon={User} label="Nama" value={santri.namaIbu} />
            <Field icon={CreditCard} label="NIK" value={santri.nikIbu} />
            <Field icon={User} label="Pekerjaan" value={santri.pekerjaanIbu} />
            <Field icon={User} label="Penghasilan" value={santri.penghasilanIbu ? PENGHASILAN_LABELS[santri.penghasilanIbu] : undefined} />
            <Field icon={User} label="Status" value={santri.statusIbu ? STATUS_ORANG_TUA_LABELS[santri.statusIbu] : undefined} />
          </div>

          <Separator />

          <div className="space-y-3">
            <SectionTitle>Lainnya</SectionTitle>
            <Field icon={Home} label="Status Rumah" value={santri.statusRumah ? STATUS_RUMAH_LABELS[santri.statusRumah] : undefined} />
            <Field icon={Phone} label="No. Telepon Orang Tua" value={santri.parentPhone} />
            <Field icon={FileText} label="Foto KK" value={santri.fotoKkFileName} />
            <Field icon={Calendar} label="Terdaftar Sejak" value={formatDate(santri.enrolledAt)} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
