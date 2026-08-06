import { Badge } from "@/components/ui/badge";
import type { PermitStatus, ViolationSeverity } from "@/types";

const PERMIT_CONFIG: Record<PermitStatus, { label: string; variant: "success" | "warning" | "muted" | "destructive" | "info" }> = {
  DIAJUKAN: { label: "Diajukan", variant: "muted" },
  DISETUJUI: { label: "Disetujui (Di Luar)", variant: "info" },
  DITOLAK: { label: "Ditolak", variant: "destructive" },
  KEMBALI: { label: "Sudah Kembali", variant: "success" },
  TERLAMBAT: { label: "Terlambat", variant: "warning" },
};

export function PermitStatusBadge({ status }: { status: PermitStatus }) {
  const config = PERMIT_CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

const SEVERITY_CONFIG: Record<ViolationSeverity, { label: string; variant: "success" | "warning" | "destructive" }> = {
  RINGAN: { label: "Ringan", variant: "success" },
  SEDANG: { label: "Sedang", variant: "warning" },
  BERAT: { label: "Berat", variant: "destructive" },
};

export function ViolationSeverityBadge({ severity }: { severity: ViolationSeverity }) {
  const config = SEVERITY_CONFIG[severity];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
