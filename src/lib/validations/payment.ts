import { z } from "zod";

export const paymentSchema = z.object({
  santriId: z.string().min(1, "Pilih santri"),
  type: z.enum(["SYAHRIAH", "DAFTAR_ULANG", "INFAQ", "TABUNGAN", "LAINNYA"], {
    required_error: "Pilih jenis pembayaran",
  }),
  period: z.string().min(1, "Pilih periode"),
  amount: z.coerce.number().min(1000, "Nominal minimal Rp1.000"),
  status: z.enum(["LUNAS", "MENUNGGU_VERIFIKASI", "BELUM_BAYAR", "DITOLAK"]),
  method: z.enum(["TUNAI", "TRANSFER", "QRIS"]),
  note: z.string().optional(),
  receiptFileName: z.string().optional(),
});

export type PaymentFormValues = z.infer<typeof paymentSchema>;
