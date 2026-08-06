"use client";

import { Users, Wallet, GraduationCap, DoorOpen, UserCog, Award } from "lucide-react";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { SantriChart } from "@/components/dashboard/santri-chart";
import { PaymentChart } from "@/components/dashboard/payment-chart";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { useSantriStore } from "@/store/use-santri-store";
import { usePaymentStore } from "@/store/use-payment-store";
import { useKeamananStore } from "@/store/use-keamanan-store";
import { useAuthStore } from "@/store/use-auth-store";
import { formatRupiah } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/constants";

export default function DashboardPage() {
  const { santris } = useSantriStore();
  const { payments } = usePaymentStore();
  const { permits } = useKeamananStore();
  const { user } = useAuthStore();

  const putra = santris.filter((s) => s.gender === "PUTRA" && s.status === "AKTIF").length;
  const putri = santris.filter((s) => s.gender === "PUTRI" && s.status === "AKTIF").length;
  const alumni = santris.filter((s) => s.status === "ALUMNI").length;
  const totalRevenue = payments.filter((p) => p.status === "LUNAS").reduce((sum, p) => sum + p.amount, 0);
  const activePermits = permits.filter((p) => p.status === "DISETUJUI").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Assalamu&apos;alaikum, {user?.name?.split(" ")[0] ?? "Admin"} 👋
        </h1>
        <p className="text-sm text-muted-foreground">
          Ringkasan operasional pondok hari ini — akses {user ? ROLE_LABELS[user.role] : ""}.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard title="Santri Putra Aktif" value={putra.toString()} icon={Users} accent="primary" index={0} trend={{ value: "+4 bulan ini", positive: true }} />
        <KpiCard title="Santri Putri Aktif" value={putri.toString()} icon={Users} accent="violet" index={1} trend={{ value: "+3 bulan ini", positive: true }} />
        <KpiCard title="Guru & Ustadz" value="42" icon={GraduationCap} accent="sky" index={2} />
        <KpiCard title="Staff Pondok" value="18" icon={UserCog} accent="amber" index={3} />
        <KpiCard title="Alumni Terdaftar" value={alumni.toString()} icon={Award} accent="primary" index={4} />
        <KpiCard title="Izin Aktif" value={activePermits.toString()} icon={DoorOpen} accent="sky" index={5} />
      </div>

      <KpiCard
        title="Total Pemasukan (Lunas) — Bulan Ini"
        value={formatRupiah(totalRevenue)}
        icon={Wallet}
        accent="primary"
        index={0}
        trend={{ value: "+8.2% dari bulan lalu", positive: true }}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <SantriChart />
          <PaymentChart />
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}
