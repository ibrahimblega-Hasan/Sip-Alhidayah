# SIP — Sistem Informasi Pondok

Sistem manajemen pondok pesantren modern berbasis Next.js 14 (App Router), TypeScript, Tailwind CSS, dan komponen bergaya shadcn/ui.

![Status](https://img.shields.io/badge/build-passing-059669) ![Next.js](https://img.shields.io/badge/Next.js-14.2-black) ![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Fitur Utama

| Modul | Fitur |
|---|---|
| **Auth** | Login split-screen, "Ingat Saya", modal lupa password, 3 akun demo (role-based) |
| **Dashboard** | KPI cards, chart Recharts (santri & pembayaran), activity feed real-time |
| **Data Santri** | CRUD lengkap, filter (kelas/asrama/status/gender), **impor/ekspor Excel** (SheetJS), detail slide-over |
| **Pembayaran (Bendahara)** | Catat syahriah/daftar ulang/infaq/tabungan, upload bukti transfer, verifikasi/tolak, **cetak kwitansi PDF**, ekspor Excel/PDF |
| **Perizinan (Keamanan)** | Log keluar-masuk santri real-time, status izin, penanda terlambat |
| **Pelanggaran (Keamanan)** | Catat pelanggaran + poin + sanksi, filter tingkat keparahan |
| **Laporan** | Filter tanggal/gender/status per modul, ekspor Excel/PDF |
| **Pengaturan** | Profil, dark mode, simulasi backup/restore database (Super Admin) |
| **Global** | Command palette `Ctrl+K`, dark mode, sidebar collapsible, mobile drawer, toast notifications |

## 🔐 Akun Demo

| Role | Email | Password |
|---|---|---|
| Super Admin | `admin@sip.sch.id` | `admin123` |
| Bendahara | `bendahara@sip.sch.id` | `bendahara123` |
| Keamanan | `keamanan@sip.sch.id` | `keamanan123` |

Klik nama akun di halaman login untuk mengisi kredensial otomatis.

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router, Server + Client Components)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS + tema Emerald kustom (`#059669`) via CSS variables (mendukung dark mode)
- **Komponen UI:** Primitif bergaya shadcn/ui di atas Radix UI + Lucide React Icons
- **Animasi:** Framer Motion
- **Form & Validasi:** React Hook Form + Zod
- **State Global:** Zustand (auth, sidebar, santri, pembayaran, keamanan, command palette)
- **Chart:** Recharts
- **Database ORM:** Prisma (schema PostgreSQL siap pakai, lihat catatan arsitektur di bawah)
- **Export:** SheetJS (`xlsx`) untuk Excel, jsPDF + autotable untuk PDF

## 📌 Catatan Arsitektur Penting — Baca Ini Dulu

Proyek ini **berjalan penuh tanpa database** saat pertama kali di-clone: seluruh data (santri, pembayaran, izin, pelanggaran) disimpan di **Zustand store sisi klien**, di-seed dari data mock realistis (`src/lib/mock-data.ts`). Ini sengaja dibuat begitu supaya:

1. Anda bisa langsung `npm install && npm run dev` dan mencoba **seluruh alur CRUD** tanpa setup database.
2. Deploy ke Vercel berhasil dengan **zero configuration** — tidak ada langkah migrasi wajib.

Skema `prisma/schema.prisma` sudah lengkap dan production-ready (mencakup Users/Role, Santri, Kelas, Asrama, Payment, Permit, Violation, Teacher, Staff, AuditLog, BackupLog), dan dua contoh route API (`src/app/api/santri/route.ts`, `src/app/api/payments/route.ts`) sudah dikabelkan ke Prisma sebagai referensi. **Untuk produksi sungguhan**, langkah yang perlu Anda lakukan:

1. Sediakan database PostgreSQL (Vercel Postgres, Neon, atau Supabase semuanya cocok).
2. Isi `DATABASE_URL` di environment variables.
3. `npx prisma migrate deploy` (atau `prisma db push` untuk prototyping cepat).
4. Ganti pemanggilan Zustand store di setiap halaman (`useSantriStore`, `usePaymentStore`, dst.) dengan `fetch()` ke route API tersebut, atau gunakan React Query/SWR di atasnya.
5. Ganti autentikasi demo (`src/store/use-auth-store.ts`) dengan penyedia auth sungguhan seperti **NextAuth.js/Auth.js** atau **Clerk**, dan hash password dengan bcrypt/argon2 (kolom `passwordHash` sudah disiapkan di skema).

Client Prisma (`src/lib/prisma.ts`) ditulis sebagai **lazy singleton** — artinya `next build` dan `next dev` tidak akan pernah gagal hanya karena `DATABASE_URL` belum diisi atau `prisma generate` belum jalan. Ia baru benar-benar terhubung ke database saat route API dipanggil.

## 🚀 Menjalankan Secara Lokal

```bash
# 1. Install dependencies
npm install

# 2. (Opsional, hanya jika Anda ingin mencoba route API Prisma)
cp .env.example .env
npx prisma generate

# 3. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — Anda akan diarahkan ke halaman login.

## 📦 Struktur Proyek

```
sip-pesantren/
├── prisma/
│   └── schema.prisma              # Skema database lengkap (PostgreSQL)
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout (font, providers)
│   │   ├── page.tsx                 # Redirect ke /login
│   │   ├── login/page.tsx           # Halaman login split-screen
│   │   ├── (dashboard)/             # Route group terproteksi
│   │   │   ├── layout.tsx           # Sidebar + Header + auth guard
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── santri/page.tsx
│   │   │   ├── keuangan/page.tsx
│   │   │   ├── keamanan/perizinan/page.tsx
│   │   │   ├── keamanan/pelanggaran/page.tsx
│   │   │   ├── laporan/page.tsx
│   │   │   └── pengaturan/page.tsx
│   │   └── api/                     # Contoh route API berbasis Prisma
│   ├── components/
│   │   ├── ui/                      # ~20 primitif shadcn/ui (Button, Dialog, Table, dst.)
│   │   ├── layout/                  # Sidebar, Header, MobileNav, CommandMenu, Providers
│   │   ├── dashboard/                # KpiCard, SantriChart, PaymentChart, ActivityFeed
│   │   ├── santri/                   # Table, FormDialog, DetailSheet, ImportExportDialog
│   │   ├── keuangan/                 # Table, FormDialog, ReceiptDialog, Badges
│   │   ├── keamanan/                 # Permit/Violation table & form dialogs, Badges
│   │   └── shared/                   # ConfirmDialog
│   ├── lib/
│   │   ├── utils.ts                  # cn(), formatRupiah, formatDate, dll.
│   │   ├── export.ts                 # Helper ekspor Excel & PDF
│   │   ├── mock-data.ts              # Data seed realistis
│   │   ├── constants.ts              # Nav items, role labels, akun demo
│   │   ├── prisma.ts                 # Prisma client (lazy singleton)
│   │   └── validations/              # Skema Zod per modul
│   ├── store/                        # Zustand stores
│   └── types/                        # TypeScript types bersama
├── package.json
├── tailwind.config.ts                 # Tema Emerald + shadcn CSS variables
└── components.json                    # Konfigurasi shadcn/ui
```

## ☁️ Deploy ke GitHub + Vercel

### 1. Push ke GitHub

```bash
cd sip-pesantren
git init
git add .
git commit -m "Initial commit: SIP - Sistem Informasi Pondok"
git branch -M main
git remote add origin https://github.com/<username-anda>/sip-pesantren.git
git push -u origin main
```

### 2. Deploy ke Vercel

**Opsi A — Lewat Dashboard (disarankan untuk pertama kali):**

1. Buka [vercel.com/new](https://vercel.com/new) dan login dengan akun GitHub Anda.
2. Pilih repository `sip-pesantren` yang baru saja di-push.
3. Vercel otomatis mendeteksi framework Next.js — biarkan semua pengaturan build default.
4. **(Opsional, hanya jika ingin mengaktifkan route API Prisma)** tambahkan environment variable `DATABASE_URL` di tab *Environment Variables* dengan connection string PostgreSQL Anda (mis. dari Vercel Postgres/Neon/Supabase).
5. Klik **Deploy**. Build seharusnya selesai tanpa error dalam ~2 menit.

**Opsi B — Lewat Vercel CLI:**

```bash
npm i -g vercel
vercel login
vercel          # deploy preview
vercel --prod   # deploy ke production
```

### 3. Setelah Deploy

- Aplikasi langsung bisa dipakai dengan 3 akun demo di atas — **tidak perlu setup database** untuk mencoba semua fitur CRUD (data tersimpan di memori browser selama sesi berjalan).
- Jika Anda mengaktifkan `DATABASE_URL`, jalankan migrasi sebelum trafik produksi:
  ```bash
  npx prisma migrate deploy
  ```
- Untuk auth produksi sungguhan dan penyimpanan data permanen, ikuti langkah di bagian **Catatan Arsitektur** di atas.

## ⚠️ Sebelum Produksi Sungguhan

Proyek ini adalah **scaffold yang solid dan dapat langsung dijalankan**, bukan sistem yang sudah 100% siap produksi dengan pengguna sungguhan. Sebelum go-live, pastikan Anda:

- [ ] Mengganti autentikasi demo dengan penyedia auth sungguhan + hashing password
- [ ] Menghubungkan store Zustand ke database sungguhan via route API/Prisma
- [ ] Menjalankan `npm audit` dan memperbarui dependency ke versi patch terbaru secara berkala
- [ ] Menambahkan rate limiting & validasi input sisi server pada seluruh route API
- [ ] Mengatur kebijakan backup otomatis (bukan simulasi) untuk database produksi
- [ ] Meninjau ulang kontrol akses berbasis peran (RBAC) untuk kebutuhan kepatuhan spesifik pondok Anda

## 📄 Lisensi

MIT — silakan gunakan dan modifikasi sesuai kebutuhan pondok Anda.
