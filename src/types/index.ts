export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionStatus = 'PENDING' | 'PAID' | 'OVERDUE';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: string;
  status: TransactionStatus;
  entity: string; // Cliente ou Fornecedor
}

export interface FinancialMetrics {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  netMargin: number;
  healthScore: number;
  overdueAmount: number;
  safetyMargin: number;
}
