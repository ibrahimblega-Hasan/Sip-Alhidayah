"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, APP_SHORT, SCHOOL_NAME } from "@/lib/constants";
import { ICON_MAP } from "@/lib/icon-map";
import { useSidebarStore } from "@/store/use-sidebar-store";
import { useAuthStore } from "@/store/use-auth-store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export function MobileNav() {
  const { isMobileOpen, setMobileOpen } = useSidebarStore();
  const { user } = useAuthStore();
  const pathname = usePathname();

  const items = NAV_ITEMS.filter((item) => !user || item.roles.includes(user.role));

  return (
    <Sheet open={isMobileOpen} onOpenChange={setMobileOpen}>
      <SheetContent side="left" className="w-72 bg-sidebar text-sidebar-foreground p-0 border-sidebar-border">
        <SheetHeader className="border-sidebar-border flex-row items-center gap-3 space-y-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <SheetTitle className="text-sidebar-foreground truncate text-sm">{APP_SHORT}</SheetTitle>
            <p className="truncate text-[11px] text-sidebar-foreground/60">{SCHOOL_NAME}</p>
          </div>
        </SheetHeader>
        <nav className="space-y-1 p-3">
          {items.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-white"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white"
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
