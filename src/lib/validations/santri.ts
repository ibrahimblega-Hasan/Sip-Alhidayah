import { z } from "zod";

const optionalText = z.string().optional().or(z.literal(""));
const phoneField = z
  .string()
  .regex(/^[0-9+\s-]*$/, "Nomor telepon tidak valid")
  .optional()
  .or(z.literal(""));
const nikField = z
  .string()
  .regex(/^[0-9]{0,16}$/, "NIK harus berupa angka, maksimal 16 digit")
  .optional()
  .or(z.literal(""));

export const santriSchema = z.object({
  // Identitas Pondok & Santri
  jenisPondok: z.enum(["SALAFIYAH", "MODERN", "KOMBINASI"]).optional(),
  jenjangPondok: z.enum(["WUSTHO", "ULYA", "MTS", "MA"]).optional(),
  nis: z.string().min(4, "NIS minimal 4 karakter").max(20, "NIS maksimal 20 karakter"),
  nisn: z.string().max(20).optional().or(z.literal("")),
  nik: nikField,
  name: z.string().min(3, "Nama minimal 3 karakter").max(100),
  tempatLahir: optionalText,
  birthDate: optionalText,
  gender: z.enum(["PUTRA", "PUTRI"], { required_error: "Pilih jenis kelamin" }),
  status: z.enum(["AKTIF", "ALUMNI", "CUTI", "KELUAR"]),
  kelas: z.string().min(1, "Pilih kelas"),
  asrama: z.string().min(1, "Pilih asrama"),

  // Sekolah Asal
  sekolahAsal: optionalText,
  jenjangSekolahAsal: z.enum(["SD", "MI", "SMP", "MTS", "PAKET_A", "PAKET_B", "LAINNYA"]).optional(),

  // Alamat
  address: optionalText,
  provinsi: optionalText,
  kabupaten: optionalText,
  kecamatan: optionalText,
  kodePos: z.string().max(10).optional().or(z.literal("")),

  // Data Ayah
  namaAyah: optionalText,
  nikAyah: nikField,
  pekerjaanAyah: optionalText,
  penghasilanAyah: z
    .enum(["TIDAK_BERPENGHASILAN", "KURANG_500K", "500K_999K", "1JT_1_9JT", "2JT_4_9JT", "5JT_20JT", "LEBIH_20JT"])
    .optional(),
  statusAyah: z.enum(["HIDUP", "WAFAT"]).optional(),

  // Data Ibu
  namaIbu: optionalText,
  nikIbu: nikField,
  pekerjaanIbu: optionalText,
  penghasilanIbu: z
    .enum(["TIDAK_BERPENGHASILAN", "KURANG_500K", "500K_999K", "1JT_1_9JT", "2JT_4_9JT", "5JT_20JT", "LEBIH_20JT"])
    .optional(),
  statusIbu: z.enum(["HIDUP", "WAFAT"]).optional(),

  statusRumah: z.enum(["MILIK_SENDIRI", "SEWA", "MENUMPANG"]).optional(),
  parentPhone: phoneField,
});

export type SantriFormValues = z.infer<typeof santriSchema>;
