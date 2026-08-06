"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { violationSchema, type ViolationFormValues } from "@/lib/validations/permit";
import { useKeamananStore } from "@/store/use-keamanan-store";
import { useSantriStore } from "@/store/use-santri-store";

const POINTS_MAP: Record<string, number> = { RINGAN: 5, SEDANG: 15, BERAT: 30 };

export function ViolationFormDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { addViolation } = useKeamananStore();
  const { santris } = useSantriStore();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ViolationFormValues>({
    resolver: zodResolver(violationSchema),
    defaultValues: { santriId: "", description: "", severity: "RINGAN", penalty: "" },
  });

  React.useEffect(() => {
    if (open) reset({ santriId: "", description: "", severity: "RINGAN", penalty: "" });
  }, [open, reset]);

  const onSubmit = async (values: ViolationFormValues) => {
    await new Promise((r) => setTimeout(r, 400));
    const santri = santris.find((s) => s.id === values.santriId);
    if (!santri) return;
    addViolation({
      ...values,
      santriName: santri.name,
      santriNis: santri.nis,
      points: POINTS_MAP[values.severity],
      occurredAt: new Date().toISOString(),
      recordedBy: "Petugas Keamanan",
    });
    toast.success("Pelanggaran dicatat", { description: `${santri.name} — ${values.description}` });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Catat Pelanggaran</DialogTitle>
          <DialogDescription>Dokumentasikan pelanggaran tata tertib santri beserta sanksi.</DialogDescription>
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
            <Label htmlFor="description">Deskripsi Pelanggaran</Label>
            <Input id="description" placeholder="Terlambat masuk kelas, dll." {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Tingkat Keparahan</Label>
            <Controller
              control={control}
              name="severity"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RINGAN">Ringan (5 poin)</SelectItem>
                    <SelectItem value="SEDANG">Sedang (15 poin)</SelectItem>
                    <SelectItem value="BERAT">Berat (30 poin)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="penalty">Sanksi</Label>
            <Input id="penalty" placeholder="Teguran lisan, menulis Al-Quran, dll." {...register("penalty")} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Menyimpan..." : "Catat Pelanggaran"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
