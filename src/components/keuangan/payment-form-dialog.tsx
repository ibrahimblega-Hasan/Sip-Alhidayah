"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Upload, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { paymentSchema, type PaymentFormValues } from "@/lib/validations/payment";
import { usePaymentStore } from "@/store/use-payment-store";
import { useSantriStore } from "@/store/use-santri-store";
import { TYPE_LABELS } from "@/components/keuangan/payment-badges";
import type { Payment } from "@/types";

const AMOUNT_DEFAULTS: Record<string, number> = {
  SYAHRIAH: 350000,
  DAFTAR_ULANG: 2500000,
  INFAQ: 100000,
  TABUNGAN: 50000,
  LAINNYA: 0,
};

interface PaymentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: Payment | null;
}

export function PaymentFormDialog({ open, onOpenChange, payment }: PaymentFormDialogProps) {
  const { addPayment, updatePayment } = usePaymentStore();
  const { santris } = useSantriStore();
  const isEditing = !!payment;
  const [fileName, setFileName] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      santriId: "",
      type: "SYAHRIAH",
      period: new Date().toISOString().slice(0, 7),
      amount: 350000,
      status: "MENUNGGU_VERIFIKASI",
      method: "TRANSFER",
      note: "",
    },
  });

  const watchedType = watch("type");

  React.useEffect(() => {
    if (open) {
      setFileName(payment?.receiptFileName ?? null);
      reset(
        payment
          ? {
              santriId: payment.santriId,
              type: payment.type,
              period: payment.period,
              amount: payment.amount,
              status: payment.status,
              method: payment.method,
              note: payment.note ?? "",
            }
          : {
              santriId: "",
              type: "SYAHRIAH",
              period: new Date().toISOString().slice(0, 7),
              amount: 350000,
              status: "MENUNGGU_VERIFIKASI",
              method: "TRANSFER",
              note: "",
            }
      );
    }
  }, [open, payment, reset]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const onSubmit = async (values: PaymentFormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    const santri = santris.find((s) => s.id === values.santriId);
    if (!santri) return;

    if (isEditing && payment) {
      updatePayment(payment.id, { ...values, receiptFileName: fileName ?? payment.receiptFileName });
      toast.success("Pembayaran diperbarui");
    } else {
      addPayment({
        ...values,
        santriName: santri.name,
        santriNis: santri.nis,
        receiptFileName: fileName ?? undefined,
        paidAt: values.status === "LUNAS" ? new Date().toISOString() : undefined,
      });
      toast.success("Pembayaran dicatat", { description: `${santri.name} — ${TYPE_LABELS[values.type]}` });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Pembayaran" : "Catat Pembayaran Baru"}</DialogTitle>
          <DialogDescription>Isi detail pembayaran syahriah, daftar ulang, infaq, atau tabungan santri.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Santri</Label>
            <Controller
              control={control}
              name="santriId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Pilih santri" /></SelectTrigger>
                  <SelectContent>
                    {santris.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name} — {s.nis}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.santriId && <p className="text-xs text-destructive">{errors.santriId.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Jenis Pembayaran</Label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                    if (!isEditing) setValue("amount", AMOUNT_DEFAULTS[v] ?? 0);
                  }}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="period">Periode</Label>
            <Input id="period" type="month" {...register("period")} />
            {errors.period && <p className="text-xs text-destructive">{errors.period.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amount">Nominal (Rp)</Label>
            <Input id="amount" type="number" step="1000" {...register("amount")} />
            {errors.amount && <p className="text-xs text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Metode</Label>
            <Controller
              control={control}
              name="method"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TUNAI">Tunai</SelectItem>
                    <SelectItem value="TRANSFER">Transfer</SelectItem>
                    <SelectItem value="QRIS">QRIS</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LUNAS">Lunas</SelectItem>
                    <SelectItem value="MENUNGGU_VERIFIKASI">Menunggu Verifikasi</SelectItem>
                    <SelectItem value="BELUM_BAYAR">Belum Bayar</SelectItem>
                    <SelectItem value="DITOLAK">Ditolak</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {watchedType !== undefined && (
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Bukti Transfer (opsional)</Label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary-50/50 dark:hover:bg-primary-950/30">
                {fileName ? <FileCheck2 className="h-4 w-4 text-primary" /> : <Upload className="h-4 w-4" />}
                <span className="truncate">{fileName ?? "Klik untuk unggah bukti transfer (JPG/PNG/PDF)"}</span>
                <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
              </label>
            </div>
          )}

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="note">Catatan</Label>
            <Textarea id="note" rows={2} placeholder="Catatan tambahan (opsional)" {...register("note")} />
          </div>

          <DialogFooter className="sm:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : isEditing ? "Simpan Perubahan" : "Simpan Pembayaran"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
