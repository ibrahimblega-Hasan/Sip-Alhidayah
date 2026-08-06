import { create } from "zustand";
import type { Permit, Violation } from "@/types";
import { MOCK_PERMITS, MOCK_VIOLATIONS } from "@/lib/mock-data";

interface KeamananState {
  permits: Permit[];
  violations: Violation[];
  addPermit: (permit: Omit<Permit, "id" | "createdAt">) => void;
  updatePermit: (id: string, data: Partial<Permit>) => void;
  deletePermit: (id: string) => void;
  markExited: (id: string) => void;
  markReturned: (id: string, late?: boolean) => void;
  addViolation: (violation: Omit<Violation, "id">) => void;
  deleteViolation: (id: string) => void;
}

export const useKeamananStore = create<KeamananState>()((set) => ({
  permits: MOCK_PERMITS,
  violations: MOCK_VIOLATIONS,
  addPermit: (permit) =>
    set((state) => ({
      permits: [
        { ...permit, id: `permit-${Date.now()}`, createdAt: new Date().toISOString() },
        ...state.permits,
      ],
    })),
  updatePermit: (id, data) =>
    set((state) => ({
      permits: state.permits.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  deletePermit: (id) =>
    set((state) => ({ permits: state.permits.filter((p) => p.id !== id) })),
  markExited: (id) =>
    set((state) => ({
      permits: state.permits.map((p) =>
        p.id === id ? { ...p, status: "DISETUJUI", exitAt: new Date().toISOString() } : p
      ),
    })),
  markReturned: (id, late) =>
    set((state) => ({
      permits: state.permits.map((p) =>
        p.id === id
          ? { ...p, status: late ? "TERLAMBAT" : "KEMBALI", actualReturnAt: new Date().toISOString() }
          : p
      ),
    })),
  addViolation: (violation) =>
    set((state) => ({
      violations: [{ ...violation, id: `viol-${Date.now()}` }, ...state.violations],
    })),
  deleteViolation: (id) =>
    set((state) => ({ violations: state.violations.filter((v) => v.id !== id) })),
}));
