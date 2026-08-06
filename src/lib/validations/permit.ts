import { z } from "zod";

export const permitSchema = z.object({
  santriId: z.string().min(1, "Pilih santri"),
  reason: z.string().min(3, "Alasan minimal 3 karakter"),
  destination: z.string().min(3, "Tujuan minimal 3 karakter"),
  expectedReturnAt: z.string().min(1, "Tentukan estimasi kembali"),
  status: z.enum(["DIAJUKAN", "DISETUJUI", "DITOLAK", "KEMBALI", "TERLAMBAT"]),
});

export type PermitFormValues = z.infer<typeof permitSchema>;

export const violationSchema = z.object({
  santriId: z.string().min(1, "Pilih santri"),
  description: z.string().min(3, "Deskripsi minimal 3 karakter"),
  severity: z.enum(["RINGAN", "SEDANG", "BERAT"]),
  penalty: z.string().optional(),
});

export type ViolationFormValues = z.infer<typeof violationSchema>;
