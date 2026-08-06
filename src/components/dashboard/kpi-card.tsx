"use client";

import { motion } from "framer-motion";
import { type LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  accent?: "primary" | "sky" | "amber" | "violet";
  index?: number;
}

const ACCENT_MAP = {
  primary: "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-400",
  sky: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  violet: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
};

export function KpiCard({ title, value, icon: Icon, trend, accent = "primary", index = 0 }: KpiCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-start justify-between gap-3 p-5">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{title}</p>
            <p className="mt-1.5 font-display text-2xl font-bold tracking-tight">{value}</p>
            {trend && (
              <div
                className={cn(
                  "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                  trend.positive
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-400"
                    : "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400"
                )}
              >
                {trend.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {trend.value}
              </div>
            )}
          </div>
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", ACCENT_MAP[accent])}>
            <Icon className="h-5 w-5" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
