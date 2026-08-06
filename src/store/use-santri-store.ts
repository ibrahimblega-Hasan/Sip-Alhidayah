import { create } from "zustand";
import type { Santri } from "@/types";
import { MOCK_SANTRI } from "@/lib/mock-data";

interface SantriState {
  santris: Santri[];
  addSantri: (santri: Omit<Santri, "id" | "enrolledAt"> & { enrolledAt?: string }) => void;
  updateSantri: (id: string, data: Partial<Santri>) => void;
  deleteSantri: (id: string) => void;
  getById: (id: string) => Santri | undefined;
}

export const useSantriStore = create<SantriState>()((set, get) => ({
  santris: MOCK_SANTRI,
  addSantri: (santri) =>
    set((state) => ({
      santris: [
        {
          ...santri,
          id: `santri-${Date.now()}`,
          enrolledAt: santri.enrolledAt ?? new Date().toISOString().slice(0, 10),
          photoUrl:
            santri.photoUrl ??
            `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(santri.name)}`,
        },
        ...state.santris,
      ],
    })),
  updateSantri: (id, data) =>
    set((state) => ({
      santris: state.santris.map((s) => (s.id === id ? { ...s, ...data } : s)),
    })),
  deleteSantri: (id) =>
    set((state) => ({ santris: state.santris.filter((s) => s.id !== id) })),
  getById: (id) => get().santris.find((s) => s.id === id),
}));
