import type { NavItem, Role } from "@/types";

export const APP_NAME = "Sistem Informasi Pondok";
export const APP_SHORT = "SIP";
export const SCHOOL_NAME = "Pondok Pesantren Al-Hikmah";

export const NAV_ITEMS: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "LayoutDashboard",
    roles: ["SUPER_ADMIN", "BENDAHARA", "KEAMANAN"],
  },
  {
    title: "Data Santri",
    href: "/santri",
    icon: "Users",
    roles: ["SUPER_ADMIN", "BENDAHARA", "KEAMANAN"],
  },
  {
    title: "Pembayaran",
    href: "/keuangan",
    icon: "Wallet",
    roles: ["SUPER_ADMIN", "BENDAHARA"],
  },
  {
    title: "Perizinan",
    href: "/keamanan/perizinan",
    icon: "DoorOpen",
    roles: ["SUPER_ADMIN", "KEAMANAN"],
  },
  {
    title: "Pelanggaran",
    href: "/keamanan/pelanggaran",
    icon: "ShieldAlert",
    roles: ["SUPER_ADMIN", "KEAMANAN"],
  },
  {
    title: "Laporan",
    href: "/laporan",
    icon: "FileBarChart",
    roles: ["SUPER_ADMIN", "BENDAHARA", "KEAMANAN"],
  },
  {
    title: "Pengaturan",
    href: "/pengaturan",
    icon: "Settings",
    roles: ["SUPER_ADMIN"],
  },
];

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  BENDAHARA: "Bendahara",
  KEAMANAN: "Keamanan",
};

export const DEMO_ACCOUNTS: { role: Role; email: string; password: string; name: string }[] = [
  { role: "SUPER_ADMIN", email: "admin@sip.sch.id", password: "admin123", name: "Ust. Abdullah" },
  { role: "BENDAHARA", email: "bendahara@sip.sch.id", password: "bendahara123", name: "Ustadzah Salma" },
  { role: "KEAMANAN", email: "keamanan@sip.sch.id", password: "keamanan123", name: "Ust. Kamal" },
];

export const JENIS_PONDOK_LABELS: Record<string, string> = {
  SALAFIYAH: "Salafiyah",
  MODERN: "Modern",
  KOMBINASI: "Kombinasi",
};

export const JENJANG_PONDOK_LABELS: Record<string, string> = {
  WUSTHO: "Wustho",
  ULYA: "Ulya",
  MTS: "MTs",
  MA: "MA",
};

export const JENJANG_SEKOLAH_ASAL_LABELS: Record<string, string> = {
  SD: "SD",
  MI: "MI",
  SMP: "SMP",
  MTS: "MTs",
  PAKET_A: "Paket A",
  PAKET_B: "Paket B",
  LAINNYA: "Lainnya",
};

export const PENGHASILAN_LABELS: Record<string, string> = {
  TIDAK_BERPENGHASILAN: "Tidak Berpenghasilan",
  KURANG_500K: "< Rp500.000",
  "500K_999K": "Rp500.000 - Rp999.999",
  "1JT_1_9JT": "Rp1.000.000 - Rp1.999.999",
  "2JT_4_9JT": "Rp2.000.000 - Rp4.999.999",
  "5JT_20JT": "Rp5.000.000 - Rp20.000.000",
  LEBIH_20JT: "> Rp20.000.000",
};

export const STATUS_RUMAH_LABELS: Record<string, string> = {
  MILIK_SENDIRI: "Milik Sendiri",
  SEWA: "Sewa/Kontrak",
  MENUMPANG: "Menumpang",
};

export const STATUS_ORANG_TUA_LABELS: Record<string, string> = {
  HIDUP: "Hidup",
  WAFAT: "Wafat",
};

export const PROVINSI_OPTIONS = [
  "Jawa Timur", "Jawa Tengah", "Jawa Barat", "DKI Jakarta", "DI Yogyakarta",
  "Banten", "Sumatera Utara", "Sumatera Barat", "Sumatera Selatan", "Lampung",
  "Kalimantan Timur", "Kalimantan Selatan", "Sulawesi Selatan", "Bali", "Nusa Tenggara Barat",
];
