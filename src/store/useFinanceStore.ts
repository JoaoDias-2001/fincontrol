import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction } from '@/types';

interface FinanceState {
  transactions: Transaction[];
  safetyMargin: number;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  setSafetyMargin: (val: number) => void;
}

const generateMockData = (): Transaction[] => {
  return [
    { id: '1', description: 'Venda de Licenças', amount: 1500000, date: '2026-10-01', type: 'INCOME', category: 'Vendas', status: 'PAID', entity: 'Cliente A' },
    { id: '2', description: 'Consultoria TI', amount: 850000, date: '2026-10-05', type: 'INCOME', category: 'Serviços', status: 'PAID', entity: 'Cliente B' },
    { id: '3', description: 'Renda Escritório', amount: 450000, date: '2026-10-02', type: 'EXPENSE', category: 'Instalações', status: 'PAID', entity: 'Imobiliária X' },
    { id: '4', description: 'Salários', amount: 980000, date: '2026-10-28', type: 'EXPENSE', category: 'RH', status: 'PENDING', entity: 'Equipa' },
    { id: '5', description: 'Licenças Software', amount: 120000, date: '2026-09-15', type: 'EXPENSE', category: 'Tecnologia', status: 'OVERDUE', entity: 'Fornecedor Cloud' },
    { id: '6', description: 'Manutenção Servidores', amount: 310000, date: '2026-09-20', type: 'EXPENSE', category: 'Tecnologia', status: 'OVERDUE', entity: 'TechOps Lda' },
  ];
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: generateMockData(),
      safetyMargin: 500000,
      addTransaction: (tx) => set((state) => ({
        transactions: [{ ...tx, id: Math.random().toString(36).substring(7) }, ...state.transactions]
      })),
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
      setSafetyMargin: (val) => set({ safetyMargin: val })
    }),
    {
      name: 'fincontrol-storage',
    }
  )
);
