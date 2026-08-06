"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import {
  Database, Download, Upload, HardDrive, Moon, Sun, Monitor,
  ShieldCheck, User as UserIcon, Bell, Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuthStore } from "@/store/use-auth-store";
import { ROLE_LABELS, SCHOOL_NAME } from "@/lib/constants";
import { initials, formatDate } from "@/lib/utils";

interface BackupEntry {
  id: string;
  fileName: string;
  size: string;
  date: string;
}

export default function PengaturanPage() {
  const { user } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const [backing, setBacking] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [backups, setBackups] = React.useState<BackupEntry[]>([
    { id: "1", fileName: "backup-2025-08-05.sql", size: "48.2 MB", date: "2025-08-05T02:00:00" },
    { id: "2", fileName: "backup-2025-08-04.sql", size: "47.9 MB", date: "2025-08-04T02:00:00" },
    { id: "3", fileName: "backup-2025-08-03.sql", size: "47.6 MB", date: "2025-08-03T02:00:00" },
  ]);

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const runBackup = () => {
    setBacking(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setBacking(false);
          setBackups((prev) => [
            {
              id: Date.now().toString(),
              fileName: `backup-${new Date().toISOString().slice(0, 10)}.sql`,
              size: `${(48 + Math.random() * 2).toFixed(1)} MB`,
              date: new Date().toISOString(),
            },
            ...prev,
          ]);
          toast.success("Backup basis data berhasil", { description: "Salinan terbaru telah disimpan dengan aman." });
          return 100;
        }
        return p + 10;
      });
    }, 150);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">Kelola profil, tampilan, dan sistem SIP.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><UserIcon className="h-4 w-4" /> Profil Akun</CardTitle>
            <CardDescription>Informasi akun Anda yang masuk saat ini.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback className="text-lg">{initials(user?.name ?? "SIP")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-display font-semibold">{user?.name}</p>
                <Badge variant="success" className="mt-1">{user ? ROLE_LABELS[user.role] : ""}</Badge>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Nama Lengkap</Label>
                <Input defaultValue={user?.name} disabled />
              </div>
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input defaultValue={user?.email} disabled />
              </div>
              <div className="space-y-1.5">
                <Label>Peran</Label>
                <Input defaultValue={user ? ROLE_LABELS[user.role] : ""} disabled />
              </div>
              <div className="space-y-1.5">
                <Label>Pondok</Label>
                <Input defaultValue={SCHOOL_NAME} disabled />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Ini adalah data demo. Di lingkungan produksi, hubungkan formulir ini ke penyedia autentikasi Anda (mis. NextAuth/Auth.js).
            </p>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Palette className="h-4 w-4" /> Tampilan</CardTitle>
            <CardDescription>Sesuaikan mode tampilan aplikasi.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { value: "light", label: "Terang", icon: Sun },
              { value: "dark", label: "Gelap", icon: Moon },
              { value: "system", label: "Sistem", icon: Monitor },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                  theme === opt.value ? "border-primary bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-400" : "border-border hover:bg-muted"
                }`}
              >
                <opt.icon className="h-4 w-4" /> {opt.label}
              </button>
            ))}
            <Separator className="my-2" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Bell className="h-4 w-4 text-muted-foreground" /> Notifikasi Email
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup - Super Admin only */}
      {isSuperAdmin ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Database className="h-4 w-4" /> Backup & Restore Basis Data</CardTitle>
            <CardDescription>Cadangkan seluruh data SIP secara berkala untuk mencegah kehilangan data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-400">
                  <HardDrive className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Backup Manual</p>
                  <p className="text-xs text-muted-foreground">Buat salinan basis data saat ini</p>
                </div>
              </div>
              <Button onClick={runBackup} disabled={backing}>
                {backing ? "Mencadangkan..." : "Backup Sekarang"}
              </Button>
            </div>

            {backing && (
              <div className="space-y-1.5">
                <Progress value={progress} />
                <p className="text-xs text-muted-foreground">Mencadangkan basis data... {progress}%</p>
              </div>
            )}

            <div>
              <p className="mb-2 text-xs font-semibold text-muted-foreground">Riwayat Backup</p>
              <div className="space-y-2">
                {backups.map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <div>
                        <p className="text-sm font-medium">{b.fileName}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(b.date, true)} &middot; {b.size}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success("Mengunduh file backup (simulasi)")}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toast.info("Restore basis data (simulasi)", { description: `Memulihkan dari ${b.fileName}...` })}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex items-center gap-3 p-5 text-sm text-muted-foreground">
            <ShieldCheck className="h-5 w-5" />
            Backup & restore basis data hanya dapat diakses oleh Super Admin.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
