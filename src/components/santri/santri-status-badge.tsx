import { Badge } from "@/components/ui/badge";
import type { SantriStatus } from "@/types";

const CONFIG: Record<SantriStatus, { label: string; variant: "success" | "muted" | "warning" | "destructive" }> = {
  AKTIF: { label: "Aktif", variant: "success" },
  ALUMNI: { label: "Alumni", variant: "muted" },
  CUTI: { label: "Cuti", variant: "warning" },
  KELUAR: { label: "Keluar", variant: "destructive" },
};

export function SantriStatusBadge({ status }: { status: SantriStatus }) {
  const config = CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
