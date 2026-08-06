"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Wallet,
  DoorOpen,
  ShieldAlert,
  FileBarChart,
  Settings,
  UserPlus,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useSantriStore } from "@/store/use-santri-store";
import { useCommandMenuStore } from "@/store/use-command-store";

export function CommandMenu() {
  const { isOpen, setOpen, toggle } = useCommandMenuStore();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const { santris } = useSantriStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <CommandDialog open={isOpen} onOpenChange={setOpen}>
      <CommandInput placeholder="Cari santri, menu, atau tindakan..." />
      <CommandList>
        <CommandEmpty>Tidak ada hasil ditemukan.</CommandEmpty>
        <CommandGroup heading="Navigasi">
          <CommandItem onSelect={() => run(() => router.push("/dashboard"))}>
            <LayoutDashboard /> Dashboard
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/santri"))}>
            <Users /> Data Santri
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/keuangan"))}>
            <Wallet /> Pembayaran
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/keamanan/perizinan"))}>
            <DoorOpen /> Perizinan
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/keamanan/pelanggaran"))}>
            <ShieldAlert /> Pelanggaran
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/laporan"))}>
            <FileBarChart /> Laporan
          </CommandItem>
          <CommandItem onSelect={() => run(() => router.push("/pengaturan"))}>
            <Settings /> Pengaturan
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Tindakan Cepat">
          <CommandItem onSelect={() => run(() => router.push("/santri?new=1"))}>
            <UserPlus /> Tambah Santri Baru
          </CommandItem>
          <CommandItem onSelect={() => run(() => setTheme(theme === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? <Sun /> : <Moon />} Ganti Mode {theme === "dark" ? "Terang" : "Gelap"}
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Santri">
          {santris.slice(0, 6).map((s) => (
            <CommandItem key={s.id} onSelect={() => run(() => router.push(`/santri?highlight=${s.id}`))}>
              <Users />
              <span>{s.name}</span>
              <CommandShortcut>{s.nis}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
