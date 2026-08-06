"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Menu, Search, Sun, Moon, Bell, LogOut, User, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useAuthStore } from "@/store/use-auth-store";
import { ROLE_LABELS } from "@/lib/constants";
import { initials } from "@/lib/utils";
import { MOCK_ACTIVITY } from "@/lib/mock-data";
import { timeAgo } from "@/lib/utils";

export function Header({ onOpenCommand }: { onOpenCommand: () => void }) {
  const { setMobileOpen } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    logout();
    toast.success("Berhasil keluar", { description: "Sampai jumpa kembali!" });
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>

      <button
        onClick={onOpenCommand}
        className="flex flex-1 max-w-md items-center gap-2 rounded-xl border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground shadow-sm transition-colors hover:bg-muted"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Cari santri, menu...</span>
        <span className="sm:hidden">Cari...</span>
        <kbd className="ml-auto hidden items-center gap-0.5 rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium sm:flex">
          Ctrl K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Ganti tema"
        >
          {mounted && theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-[18px] w-[18px]" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Aktivitas Terbaru
              <Badge variant="success">{MOCK_ACTIVITY.length}</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {MOCK_ACTIVITY.slice(0, 5).map((a) => (
                <DropdownMenuItem key={a.id} className="flex-col items-start gap-0.5 py-2">
                  <span className="text-sm font-medium leading-tight">{a.title}</span>
                  <span className="text-xs text-muted-foreground leading-tight">{a.description}</span>
                  <span className="text-[11px] text-muted-foreground/70">{timeAgo(a.timestamp)}</span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl p-1 pr-2 transition-colors hover:bg-muted">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback>{initials(user?.name ?? "SIP")}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-xs font-medium leading-tight">{user?.name ?? "Pengguna"}</p>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {user ? ROLE_LABELS[user.role] : ""}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push("/pengaturan")}>
              <User /> Profil
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => router.push("/pengaturan")}>
              <SettingsIcon /> Pengaturan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout} className="text-destructive focus:text-destructive">
              <LogOut /> Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
