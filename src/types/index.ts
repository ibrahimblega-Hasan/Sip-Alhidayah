export type Role = "SUPER_ADMIN" | "BENDAHARA" | "KEAMANAN";

export type Gender = "PUTRA" | "PUTRI";

export type SantriStatus = "AKTIF" | "ALUMNI" | "CUTI" | "KELUAR";

export type JenisPondok = "SALAFIYAH" | "MODERN" | "KOMBINASI";
export type JenjangPondok = "WUSTHO" | "ULYA" | "MTS" | "MA";
export type JenjangSekolahAsal = "SD" | "MI" | "SMP" | "MTS" | "PAKET_A" | "PAKET_B" | "LAINNYA";

export type PenghasilanRange =
  | "TIDAK_BERPENGHASILAN"
  | "KURANG_500K"
  | "500K_999K"
  | "1JT_1_9JT"
  | "2JT_4_9JT"
  | "5JT_20JT"
  | "LEBIH_20JT";

export type StatusRumah = "MILIK_SENDIRI" | "SEWA" | "MENUMPANG";

export type StatusOrangTua = "HIDUP" | "WAFAT";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Santri {
  id: string;
  // Identitas Pondok & Santri
  jenisPondok?: JenisPondok;
  jenjangPondok?: JenjangPondok;
  photoUrl?: string; // foto_santri
  nis: string; // Nomor Induk Santri (internal)
  nisn?: string; // Nomor Induk Siswa Nasional
  nik?: string; // NIK santri (16 digit)
  name: string; // nama_lengkap
  tempatLahir?: string;
  birthDate?: string; // tanggal_lahir
  gender: Gender; // jenis_kelamin
  status: SantriStatus;
  kelas: string;
  asrama: string; // dormitory

  // Sekolah Asal
  sekolahAsal?: string;
  jenjangSekolahAsal?: JenjangSekolahAsal;

  // Alamat
  address?: string; // alamat
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  kodePos?: string;

  // Data Ayah
  namaAyah?: string;
  nikAyah?: string;
  pekerjaanAyah?: string;
  penghasilanAyah?: PenghasilanRange;
  statusAyah?: StatusOrangTua;

  // Data Ibu
  namaIbu?: string;
  nikIbu?: string;
  pekerjaanIbu?: string;
  penghasilanIbu?: PenghasilanRange;
  statusIbu?: StatusOrangTua;

  statusRumah?: StatusRumah;
  parentPhone?: string; // telepon_ortu
  fotoKkFileName?: string; // foto_kk

  enrolledAt: string;
}

export type PaymentType = "SYAHRIAH" | "DAFTAR_ULANG" | "INFAQ" | "TABUNGAN" | "LAINNYA";
export type PaymentStatus = "LUNAS" | "MENUNGGU_VERIFIKASI" | "BELUM_BAYAR" | "DITOLAK";
export type PaymentMethod = "TUNAI" | "TRANSFER" | "QRIS";

export interface Payment {
  id: string;
  santriId: string;
  santriName: string;
  santriNis: string;
  type: PaymentType;
  period: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  receiptNumber?: string;
  receiptFileName?: string;
  note?: string;
  paidAt?: string;
  createdAt: string;
}

export type PermitStatus = "DIAJUKAN" | "DISETUJUI" | "DITOLAK" | "KEMBALI" | "TERLAMBAT";

export interface Permit {
  id: string;
  santriId: string;
  santriName: string;
  santriNis: string;
  reason: string;
  destination: string;
  exitAt?: string;
  expectedReturnAt?: string;
  actualReturnAt?: string;
  status: PermitStatus;
  approvedBy?: string;
  createdAt: string;
}

export type ViolationSeverity = "RINGAN" | "SEDANG" | "BERAT";

export interface Violation {
  id: string;
  santriId: string;
  santriName: string;
  santriNis: string;
  description: string;
  severity: ViolationSeverity;
  points: number;
  penalty?: string;
  occurredAt: string;
  recordedBy?: string;
}

export interface ActivityItem {
  id: string;
  type: "PAYMENT" | "PERMIT" | "VIOLATION" | "SANTRI" | "SYSTEM";
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  roles: Role[];
  badge?: string;
}
