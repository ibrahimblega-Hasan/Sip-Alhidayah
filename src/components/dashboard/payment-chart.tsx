"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MONTHLY_PAYMENT_STATS } from "@/lib/mock-data";
import { formatRupiah } from "@/lib/utils";

export function PaymentChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Statistik Pembayaran</CardTitle>
        <CardDescription>Pemasukan aktual vs target bulanan (Rupiah)</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={MONTHLY_PAYMENT_STATS} margin={{ top: 4, right: 16, left: -4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="hsl(var(--muted-foreground))" />
            <YAxis
              tickLine={false}
              axisLine={false}
              fontSize={12}
              stroke="hsl(var(--muted-foreground))"
              width={56}
              tickFormatter={(v) => `${(v / 1_000_000).toFixed(0)}jt`}
            />
            <Tooltip
              formatter={(value: number) => formatRupiah(value)}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--popover))",
                color: "hsl(var(--popover-foreground))",
                fontSize: 13,
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="masuk" name="Pemasukan" fill="hsl(var(--chart-1))" radius={[6, 6, 0, 0]} maxBarSize={28} />
            <Bar dataKey="target" name="Target" fill="hsl(var(--chart-2))" radius={[6, 6, 0, 0]} maxBarSize={28} opacity={0.5} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
