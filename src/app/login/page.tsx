"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { GraduationCap, Mail, Lock, Eye, EyeOff, ShieldCheck, Wallet, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/store/use-auth-store";
import { loginSchema, forgotPasswordSchema, type LoginFormValues, type ForgotPasswordValues } from "@/lib/validations/auth";
import { DEMO_ACCOUNTS, SCHOOL_NAME } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = React.useState(false);
  const [forgotOpen, setForgotOpen] = React.useState(false);
  const [forgotSent, setForgotSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true },
  });

  const forgotForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    await new Promise((r) => setTimeout(r, 600));
    const result = login(values.email, values.password);
    if (result.success) {
      toast.success("Berhasil masuk", { description: "Mengalihkan ke dashboard..." });
      router.push("/dashboard");
    } else {
      toast.error("Gagal masuk", { description: result.message });
    }
  };

  const onForgotSubmit = async (values: ForgotPasswordValues) => {
    await new Promise((r) => setTimeout(r, 700));
    setForgotSent(true);
  };

  const fillDemo = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: branding panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 p-10 text-white lg:flex">
        <div className="islamic-pattern pointer-events-none absolute inset-0 opacity-40" />
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-display text-lg font-bold leading-tight">Sistem Informasi Pondok</p>
            <p className="text-sm text-white/70 leading-tight">{SCHOOL_NAME}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative max-w-md space-y-6"
        >
          <h1 className="font-display text-4xl font-bold leading-tight">
            Kelola pondok pesantren Anda dengan lebih tenang.
          </h1>
          <p className="text-white/75 leading-relaxed">
            Satu sistem terpadu untuk data santri, keuangan, dan keamanan — dirancang
            khusus untuk kebutuhan operasional pondok modern.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { icon: Users, label: "Data Santri" },
              { icon: Wallet, label: "Keuangan" },
              { icon: ShieldCheck, label: "Keamanan" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
                <Icon className="mb-2 h-5 w-5 text-primary-200" />
                <p className="text-xs font-medium text-white/90">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative text-xs text-white/50"
        >
          &copy; {new Date().getFullYear()} {SCHOOL_NAME}. Seluruh hak cipta dilindungi.
        </motion.p>
      </div>

      {/* Right: form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </div>
            <p className="font-display font-bold">Sistem Informasi Pondok</p>
          </div>

          <h2 className="font-display text-2xl font-bold">Selamat datang kembali</h2>
          <p className="mt-1 text-sm text-muted-foreground">Masuk untuk mengakses dashboard SIP.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@sip.sch.id"
                  className="pl-9"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Kata Sandi</Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-9 pr-9"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox defaultChecked {...register("remember")} />
                Ingat saya
              </label>
              <button
                type="button"
                onClick={() => setForgotOpen(true)}
                className="text-sm font-medium text-primary hover:underline"
              >
                Lupa kata sandi?
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Masuk"}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <div className="mt-8 rounded-xl border border-dashed border-border p-4">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">Akun Demo (klik untuk isi otomatis)</p>
            <div className="flex flex-wrap gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => fillDemo(acc.email, acc.password)}
                  className="rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
                >
                  {acc.name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Forgot password modal */}
      <Dialog
        open={forgotOpen}
        onOpenChange={(open) => {
          setForgotOpen(open);
          if (!open) setForgotSent(false);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pulihkan Kata Sandi</DialogTitle>
            <DialogDescription>
              Masukkan email akun Anda, kami akan mengirimkan tautan untuk mengatur ulang kata sandi.
            </DialogDescription>
          </DialogHeader>
          {forgotSent ? (
            <div className="rounded-xl bg-primary-50 p-4 text-sm text-primary-800 dark:bg-primary-950 dark:text-primary-300">
              Tautan pemulihan telah dikirim ke email Anda (simulasi). Silakan periksa kotak masuk Anda.
            </div>
          ) : (
            <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="forgot-email">Email</Label>
                <Input id="forgot-email" type="email" placeholder="nama@sip.sch.id" {...forgotForm.register("email")} />
                {forgotForm.formState.errors.email && (
                  <p className="text-xs text-destructive">{forgotForm.formState.errors.email.message}</p>
                )}
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full" disabled={forgotForm.formState.isSubmitting}>
                  {forgotForm.formState.isSubmitting ? "Mengirim..." : "Kirim Tautan Pemulihan"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
