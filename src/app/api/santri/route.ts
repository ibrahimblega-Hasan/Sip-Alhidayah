import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Example server-backed endpoint. The UI in this scaffold reads/writes through
// the Zustand stores (client-side mock data) so it works instantly without a
// database. Once DATABASE_URL is configured and `prisma migrate deploy` has
// been run, you can point the stores at these routes instead of local state.

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const gender = searchParams.get("gender");

    const santris = await prisma.santri.findMany({
      where: {
        ...(status ? { status: status as never } : {}),
        ...(gender ? { gender: gender as never } : {}),
      },
      include: { kelas: true, dormitory: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: santris });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal memuat data santri. Pastikan DATABASE_URL sudah dikonfigurasi." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const santri = await prisma.santri.create({ data: body });
    return NextResponse.json({ data: santri }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal menambahkan santri." }, { status: 500 });
  }
}
