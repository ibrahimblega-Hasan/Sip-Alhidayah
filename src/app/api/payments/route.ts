import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const payments = await prisma.payment.findMany({
      where: status ? { status: status as never } : {},
      include: { santri: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ data: payments });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal memuat data pembayaran. Pastikan DATABASE_URL sudah dikonfigurasi." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payment = await prisma.payment.create({ data: body });
    return NextResponse.json({ data: payment }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mencatat pembayaran." }, { status: 500 });
  }
}
