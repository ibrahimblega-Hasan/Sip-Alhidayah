import type { Santri, Payment, Permit, Violation, ActivityItem } from "@/types";

const NAMES_PUTRA = [
  "Ahmad Fauzan", "Muhammad Rizki", "Abdul Aziz", "Faisal Rahman", "Ilham Maulana",
  "Zaki Firmansyah", "Rafi Hidayat", "Dzaki Ramadhan", "Fajar Nugroho", "Yusuf Ibrahim",
  "Hafiz Anwar", "Rizal Pratama", "Bilal Saputra", "Umar Syahid", "Arif Setiawan",
];
const NAMES_PUTRI = [
  "Siti Aminah", "Nur Azizah", "Fatimah Zahra", "Khadijah Putri", "Aisyah Rahmawati",
  "Zahra Amelia", "Hafshah Salsabila", "Maryam Wulandari", "Nabila Safitri", "Halimah Oktaviani",
  "Farah Anindita", "Rania Kusuma", "Salma Fadhilah", "Aliyah Ramadhani", "Yasmin Aulia",
];
const KELAS = ["VII A", "VII B", "VIII A", "VIII B", "IX A", "X IPA 1", "X IPA 2", "XI IPS 1", "XII Agama"];
const ASRAMA_PUTRA = ["Asrama Al-Farabi", "Asrama Ibnu Sina", "Asrama Al-Khawarizmi"];
const ASRAMA_PUTRI = ["Asrama Khadijah", "Asrama Aisyah", "Asrama Fatimah"];

function seedRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}
const rand = seedRandom(42);
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function pad(n: number, len = 4) {
  return String(n).padStart(len, "0");
}

const KOTA_JATIM = ["Surabaya", "Malang", "Jombang", "Kediri", "Gresik", "Sidoarjo", "Mojokerto", "Pasuruan"];
const KECAMATAN_SAMPLE = ["Wonokromo", "Sukolilo", "Lowokwaru", "Diwek", "Gudo", "Krian", "Waru", "Taman"];
const PEKERJAAN_OPTIONS = ["Wiraswasta", "Petani", "PNS", "Buruh", "Pedagang", "Guru", "Karyawan Swasta", "Nelayan"];
const SEKOLAH_ASAL_PREFIX = ["SDN", "MI", "SDIT", "MIN"];
const PENGHASILAN_OPTIONS = ["TIDAK_BERPENGHASILAN", "KURANG_500K", "500K_999K", "1JT_1_9JT", "2JT_4_9JT", "5JT_20JT", "LEBIH_20JT"] as const;
const JENJANG_SEKOLAH_ASAL_OPTIONS = ["SD", "MI"] as const;

export const MOCK_SANTRI: Santri[] = Array.from({ length: 60 }).map((_, i) => {
  const gender = i % 2 === 0 ? "PUTRA" : "PUTRI";
  const names = gender === "PUTRA" ? NAMES_PUTRA : NAMES_PUTRI;
  const name = `${pick(names)} ${i > 28 ? i : ""}`.trim();
  const statusRoll = rand();
  const status = statusRoll > 0.94 ? "ALUMNI" : statusRoll > 0.9 ? "CUTI" : statusRoll > 0.87 ? "KELUAR" : "AKTIF";
  const kota = pick(KOTA_JATIM);
  const ayahName = `${pick(NAMES_PUTRA)}`;
  const ibuName = `${pick(NAMES_PUTRI)}`;
  return {
    id: `santri-${i + 1}`,
    jenisPondok: "SALAFIYAH",
    jenjangPondok: gender === "PUTRA" ? (rand() > 0.5 ? "WUSTHO" : "MTS") : (rand() > 0.5 ? "ULYA" : "MA"),
    nis: `2024${pad(i + 1)}`,
    nisn: `00${pad(30000000 + i, 8)}`,
    nik: `35${pad(1 + i, 14)}`,
    name,
    tempatLahir: kota,
    birthDate: `20${10 + Math.floor(rand() * 3)}-0${1 + Math.floor(rand() * 9)}-1${Math.floor(rand() * 9)}`,
    gender,
    status,
    kelas: pick(KELAS),
    asrama: pick(gender === "PUTRA" ? ASRAMA_PUTRA : ASRAMA_PUTRI),
    sekolahAsal: `${pick(SEKOLAH_ASAL_PREFIX)} ${kota} ${1 + Math.floor(rand() * 12)}`,
    jenjangSekolahAsal: pick([...JENJANG_SEKOLAH_ASAL_OPTIONS]),
    address: `Jl. Merdeka No. ${i + 1}, ${kota}`,
    provinsi: "Jawa Timur",
    kabupaten: kota,
    kecamatan: pick(KECAMATAN_SAMPLE),
    kodePos: `6${pad(1000 + i, 4)}`,
    namaAyah: ayahName,
    nikAyah: `35${pad(1000 + i, 14)}`,
    pekerjaanAyah: pick(PEKERJAAN_OPTIONS),
    penghasilanAyah: pick([...PENGHASILAN_OPTIONS]),
    statusAyah: rand() > 0.05 ? "HIDUP" : "WAFAT",
    namaIbu: ibuName,
    nikIbu: `35${pad(2000 + i, 14)}`,
    pekerjaanIbu: pick(["Ibu Rumah Tangga", ...PEKERJAAN_OPTIONS]),
    penghasilanIbu: pick(["TIDAK_BERPENGHASILAN", ...PENGHASILAN_OPTIONS]),
    statusIbu: rand() > 0.03 ? "HIDUP" : "WAFAT",
    statusRumah: pick(["MILIK_SENDIRI", "SEWA", "MENUMPANG"]),
    parentPhone: `08${Math.floor(1000000000 + rand() * 8999999999)}`.slice(0, 12),
    photoUrl: `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(name + i)}`,
    enrolledAt: `2024-07-${10 + (i % 15)}`,
  };
});

const PAYMENT_TYPES: Payment["type"][] = ["SYAHRIAH", "DAFTAR_ULANG", "INFAQ", "TABUNGAN"];
const PAYMENT_STATUSES: Payment["status"][] = ["LUNAS", "MENUNGGU_VERIFIKASI", "BELUM_BAYAR", "DITOLAK"];
const PAYMENT_METHODS: Payment["method"][] = ["TUNAI", "TRANSFER", "QRIS"];
const AMOUNTS: Record<Payment["type"], number> = {
  SYAHRIAH: 350000,
  DAFTAR_ULANG: 2500000,
  INFAQ: 100000,
  TABUNGAN: 50000,
  LAINNYA: 75000,
};

export const MOCK_PAYMENTS: Payment[] = Array.from({ length: 80 }).map((_, i) => {
  const santri = pick(MOCK_SANTRI);
  const type = pick(PAYMENT_TYPES);
  const status = pick(PAYMENT_STATUSES);
  const month = 1 + Math.floor(rand() * 8);
  return {
    id: `pay-${i + 1}`,
    santriId: santri.id,
    santriName: santri.name,
    santriNis: santri.nis,
    type,
    period: `2025-${String(month).padStart(2, "0")}`,
    amount: AMOUNTS[type],
    status,
    method: pick(PAYMENT_METHODS),
    receiptNumber: status === "LUNAS" ? `KWT/2025${String(month).padStart(2, "0")}/${1000 + i}` : undefined,
    receiptFileName: status !== "BELUM_BAYAR" ? "bukti-transfer.jpg" : undefined,
    note: status === "DITOLAK" ? "Nominal transfer tidak sesuai" : undefined,
    paidAt: status === "LUNAS" ? `2025-0${month}-${5 + (i % 20)}` : undefined,
    createdAt: `2025-0${month}-${1 + (i % 25)}`,
  };
});

const PERMIT_REASONS = ["Pulang kampung", "Kontrol kesehatan", "Acara keluarga", "Keperluan sekolah luar", "Membeli kebutuhan"];
const PERMIT_STATUSES: Permit["status"][] = ["DIAJUKAN", "DISETUJUI", "KEMBALI", "TERLAMBAT", "DITOLAK"];

export const MOCK_PERMITS: Permit[] = Array.from({ length: 40 }).map((_, i) => {
  const santri = pick(MOCK_SANTRI);
  const status = pick(PERMIT_STATUSES);
  return {
    id: `permit-${i + 1}`,
    santriId: santri.id,
    santriName: santri.name,
    santriNis: santri.nis,
    reason: pick(PERMIT_REASONS),
    destination: pick(["Rumah orang tua", "Rumah sakit", "Kota Surabaya", "Puskesmas terdekat"]),
    exitAt: `2025-08-0${1 + (i % 6)}T0${7 + (i % 3)}:00:00`,
    expectedReturnAt: `2025-08-0${2 + (i % 6)}T1${6 + (i % 3)}:00:00`,
    actualReturnAt: status === "KEMBALI" || status === "TERLAMBAT" ? `2025-08-0${2 + (i % 6)}T1${7 + (i % 3)}:30:00` : undefined,
    status,
    approvedBy: status !== "DIAJUKAN" ? "Ust. Kamal (Keamanan)" : undefined,
    createdAt: `2025-08-0${1 + (i % 6)}T06:${10 + i}:00`,
  };
});

const VIOLATION_DESCRIPTIONS = [
  "Terlambat masuk kelas", "Tidak mengikuti sholat berjamaah", "Membawa handphone", "Keluar asrama tanpa izin",
  "Tidak merapikan kamar", "Membuat kegaduhan malam hari", "Melanggar tata tertib bahasa",
];

export const MOCK_VIOLATIONS: Violation[] = Array.from({ length: 25 }).map((_, i) => {
  const santri = pick(MOCK_SANTRI);
  const severity = pick<Violation["severity"]>(["RINGAN", "SEDANG", "BERAT"]);
  const points = severity === "RINGAN" ? 5 : severity === "SEDANG" ? 15 : 30;
  return {
    id: `viol-${i + 1}`,
    santriId: santri.id,
    santriName: santri.name,
    santriNis: santri.nis,
    description: pick(VIOLATION_DESCRIPTIONS),
    severity,
    points,
    penalty: severity === "BERAT" ? "Panggilan orang tua" : severity === "SEDANG" ? "Menulis Al-Quran 1 juz" : "Teguran lisan",
    occurredAt: `2025-08-0${1 + (i % 6)}`,
    recordedBy: "Ust. Kamal (Keamanan)",
  };
});

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: "a1", type: "PAYMENT", title: "Pembayaran syahriah dikonfirmasi", description: "Ahmad Fauzan - Rp350.000", timestamp: "2025-08-06T08:12:00", actor: "Bendahara" },
  { id: "a2", type: "PERMIT", title: "Izin keluar disetujui", description: "Siti Aminah - Pulang kampung", timestamp: "2025-08-06T07:45:00", actor: "Keamanan" },
  { id: "a3", type: "VIOLATION", title: "Pelanggaran baru dicatat", description: "Rafi Hidayat - Terlambat masuk kelas", timestamp: "2025-08-06T07:20:00", actor: "Keamanan" },
  { id: "a4", type: "SANTRI", title: "Santri baru terdaftar", description: "Zahra Amelia - Kelas VII A", timestamp: "2025-08-05T16:05:00", actor: "Super Admin" },
  { id: "a5", type: "PAYMENT", title: "Bukti transfer menunggu verifikasi", description: "Umar Syahid - Rp2.500.000", timestamp: "2025-08-05T14:30:00", actor: "Bendahara" },
  { id: "a6", type: "SYSTEM", title: "Backup basis data berhasil", description: "backup-2025-08-05.sql (48 MB)", timestamp: "2025-08-05T02:00:00", actor: "Sistem" },
];

export const MONTHLY_SANTRI_STATS = [
  { month: "Mar", putra: 168, putri: 152 },
  { month: "Apr", putra: 172, putri: 156 },
  { month: "Mei", putra: 175, putri: 158 },
  { month: "Jun", putra: 178, putri: 161 },
  { month: "Jul", putra: 182, putri: 165 },
  { month: "Agu", putra: 186, putri: 169 },
];

export const MONTHLY_PAYMENT_STATS = [
  { month: "Mar", masuk: 62_400_000, target: 68_000_000 },
  { month: "Apr", masuk: 65_100_000, target: 68_000_000 },
  { month: "Mei", masuk: 59_800_000, target: 70_000_000 },
  { month: "Jun", masuk: 71_200_000, target: 70_000_000 },
  { month: "Jul", masuk: 68_900_000, target: 72_000_000 },
  { month: "Agu", masuk: 74_500_000, target: 72_000_000 },
];

export const PAYMENT_TYPE_DISTRIBUTION = [
  { name: "Syahriah", value: 45 },
  { name: "Daftar Ulang", value: 15 },
  { name: "Infaq", value: 25 },
  { name: "Tabungan", value: 15 },
];
