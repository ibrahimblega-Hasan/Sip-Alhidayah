import { Badge } from "@/components/ui/badge";
import type { PaymentStatus, PaymentType } from "@/types";

const STATUS_CONFIG: Record<PaymentStatus, { label: string; variant: "success" | "warning" | "muted" | "destructive" }> = {
  LUNAS: { label: "Lunas", variant: "success" },
  MENUNGGU_VERIFIKASI: { label: "Menunggu Verifikasi", variant: "warning" },
  BELUM_BAYAR: { label: "Belum Bayar", variant: "muted" },
  DITOLAK: { label: "Ditolak", variant: "destructive" },
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const config = STATUS_CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

const TYPE_LABELS: Record<PaymentType, string> = {
  SYAHRIAH: "Syahriah",
  DAFTAR_ULANG: "Daftar Ulang",
  INFAQ: "Infaq",
  TABUNGAN: "Tabungan",
  LAINNYA: "Lainnya",
};

export function PaymentTypeBadge({ type }: { type: PaymentType }) {
  return <Badge variant="outline">{TYPE_LABELS[type]}</Badge>;
}

export { TYPE_LABELS };
