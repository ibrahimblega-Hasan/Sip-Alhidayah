"use client";

import { motion } from "framer-motion";
import { Wallet, DoorOpen, ShieldAlert, UserPlus, Server } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn, timeAgo } from "@/lib/utils";
import { MOCK_ACTIVITY } from "@/lib/mock-data";
import type { ActivityItem } from "@/types";

const ICONS: Record<ActivityItem["type"], typeof Wallet> = {
  PAYMENT: Wallet,
  PERMIT: DoorOpen,
  VIOLATION: ShieldAlert,
  SANTRI: UserPlus,
  SYSTEM: Server,
};

const COLORS: Record<ActivityItem["type"], string> = {
  PAYMENT: "bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-400",
  PERMIT: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-400",
  VIOLATION: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
  SANTRI: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
  SYSTEM: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
};

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Aktivitas Terkini</CardTitle>
          <CardDescription>Pembaruan langsung dari seluruh modul</CardDescription>
        </div>
        <span className="flex h-2 w-2">
          <span className="absolute h-2 w-2 animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative h-2 w-2 rounded-full bg-primary" />
        </span>
      </CardHeader>
      <CardContent className="space-y-1">
        {MOCK_ACTIVITY.map((item, i) => {
          const Icon = ICONS[item.type];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-muted/60"
            >
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", COLORS[item.type])}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-tight">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground leading-tight">{item.description}</p>
              </div>
              <span className="shrink-0 text-[11px] text-muted-foreground whitespace-nowrap">{timeAgo(item.timestamp)}</span>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
