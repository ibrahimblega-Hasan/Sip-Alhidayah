"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { permitSchema, type PermitFormValues } from "@/lib/validations/permit";
import { useKeamananStore } from "@/store/use-keamanan-store";
import { useSantriStore } from "@/store/use-santri-store";

export function PermitFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { addPermit } = useKeamananStore();
  const { santris } = useSantriStore();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PermitFormValues>({
    resolver: zodResolver(permitSchema),
    defaultValues: { santriId: "", reason: "", destination: "", expectedReturnAt: "", status: "DIAJUKAN" },
  });

  React.useEffect(() => {
    if (open) reset({ santriId: "", reason: "", destination: "", expectedReturnAt: "", status: "DIAJUKAN" });
  }, [open, reset]);

  const onSubmit = async (values: PermitFormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    const santri = santris.find((s) => s.id === values.santriId);
    if (!santri) return;
    addPermit({
      ...values,
      santriName: santri.name,
      santriNis: santri.nis,
    });
    toast.success("Izin keluar dicatat", { description: `${santri.name} — ${values.destination}` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buat Izin Keluar</DialogTitle>
          <DialogDescription>Catat permohonan izin keluar-masuk santri.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
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
            <Label htmlFor="reason">Alasan Izin</Label>
            <Input id="reason" placeholder="Pulang kampung, kontrol kesehatan, dll." {...register("reason")} />
            {errors.reason && <p className="text-xs text-destructive">{errors.reason.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="destination">Tujuan</Label>
            <Input id="destination" placeholder="Rumah orang tua, rumah sakit, dll." {...register("destination")} />
            {errors.destination && <p className="text-xs text-destructive">{errors.destination.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="expectedReturnAt">Estimasi Kembali</Label>
            <Input id="expectedReturnAt" type="datetime-local" {...register("expectedReturnAt")} />
            {errors.expectedReturnAt && <p className="text-xs text-destructive">{errors.expectedReturnAt.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Menyimpan..." : "Buat Izin"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
