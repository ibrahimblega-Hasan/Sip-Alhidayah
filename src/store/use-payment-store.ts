import { create } from "zustand";
import type { Payment } from "@/types";
import { MOCK_PAYMENTS } from "@/lib/mock-data";
import { generateReceiptNumber } from "@/lib/utils";

interface PaymentState {
  payments: Payment[];
  addPayment: (payment: Omit<Payment, "id" | "createdAt">) => void;
  updatePayment: (id: string, data: Partial<Payment>) => void;
  deletePayment: (id: string) => void;
  verifyPayment: (id: string) => void;
  rejectPayment: (id: string, note: string) => void;
}

export const usePaymentStore = create<PaymentState>()((set) => ({
  payments: MOCK_PAYMENTS,
  addPayment: (payment) =>
    set((state) => ({
      payments: [
        {
          ...payment,
          id: `pay-${Date.now()}`,
          receiptNumber: payment.status === "LUNAS" ? generateReceiptNumber() : payment.receiptNumber,
          createdAt: new Date().toISOString(),
        },
        ...state.payments,
      ],
    })),
  updatePayment: (id, data) =>
    set((state) => ({
      payments: state.payments.map((p) => (p.id === id ? { ...p, ...data } : p)),
    })),
  deletePayment: (id) =>
    set((state) => ({ payments: state.payments.filter((p) => p.id !== id) })),
  verifyPayment: (id) =>
    set((state) => ({
      payments: state.payments.map((p) =>
        p.id === id
          ? {
              ...p,
              status: "LUNAS",
              receiptNumber: p.receiptNumber ?? generateReceiptNumber(),
              paidAt: new Date().toISOString(),
            }
          : p
      ),
    })),
  rejectPayment: (id, note) =>
    set((state) => ({
      payments: state.payments.map((p) => (p.id === id ? { ...p, status: "DITOLAK", note } : p)),
    })),
}));
