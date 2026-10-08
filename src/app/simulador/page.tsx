'use client';
import { useState, useMemo } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency } from '@/lib/utils';
import { Calculator, AlertCircle } from 'lucide-react';

export default function Simulador() {
  const { transactions, safetyMargin } = useFinanceStore();
  
  const [incomeChange, setIncomeChange] = useState(0);
  const [expenseChange, setExpenseChange] = useState(0);

  const baseMetrics = useMemo(() => {
    let income = 0;
    let expense = 0;
    transactions.forEach(t => {
      if (t.type === 'INCOME') income += t.amount;
      if (t.type === 'EXPENSE') expense += t.amount;
    });
    return { income, expense };
  }, [transactions]);

  const simulated = useMemo(() => {
    const sIncome = baseMetrics.income * (1 + incomeChange / 100);
    const sExpense = baseMetrics.expense * (1 + expenseChange / 100);
    const sProfit = sIncome - sExpense;
    const initialBalance = 850000;
    const sBalance = initialBalance + sProfit;
    const sMargin = sIncome > 0 ? (sProfit / sIncome) * 100 : 0;
    
    // Coverage in days = balance / (monthly expenses / 30)
    const dailyExpense = sExpense / 30;
    const coverageDays = dailyExpense > 0 ? Math.floor(sBalance / dailyExpense) : 999;
    
    return { sIncome, sExpense, sProfit, sBalance, sMargin, coverageDays };
  }, [baseMetrics, incomeChange, expenseChange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Simulador de Cenários</h1>
          <p className="text-slate-500 text-sm mt-1">Ajuste as variáveis para projectar o impacto no negócio.</p>
        </div>
        <Calculator className="w-8 h-8 text-brand-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controles */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-1 space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">Variação de Receitas</label>
              <span className={`text-sm font-bold ${incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {incomeChange > 0 ? '+' : ''}{incomeChange}%
              </span>
            </div>
            <input type="range" min="-30" max="30" step="1" value={incomeChange} 
              onChange={e => setIncomeChange(Number(e.target.value))}
              className="w-full accent-brand-600" />
            <div className="text-xs text-slate-400 mt-1 flex justify-between">
              <span>Pessimista (-30%)</span>
              <span>Optimista (+30%)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">Variação de Despesas</label>
              <span className={`text-sm font-bold ${expenseChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {expenseChange > 0 ? '+' : ''}{expenseChange}%
              </span>
            </div>
            <input type="range" min="-30" max="30" step="1" value={expenseChange} 
              onChange={e => setExpenseChange(Number(e.target.value))}
              className="w-full accent-brand-600" />
            <div className="text-xs text-slate-400 mt-1 flex justify-between">
              <span>Redução (-30%)</span>
              <span>Aumento (+30%)</span>
            </div>
          </div>
        </div>

        {/* Resultados */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
          <h3 className="text-lg font-semibold text-slate-800 mb-6 border-b pb-4">Projecção Financeira</h3>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm text-slate-500 mb-1">Receita Ajustada</p>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(simulated.sIncome)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Despesa Ajustada</p>
              <p className="text-2xl font-bold text-slate-800">{formatCurrency(simulated.sExpense)}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Resultado Projectado</p>
              <p className={`text-2xl font-bold ${simulated.sProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(simulated.sProfit)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500 mb-1">Margem Líquida Estimada</p>
              <p className="text-2xl font-bold text-slate-800">{simulated.sMargin.toFixed(1)}%</p>
            </div>
          </div>

          <div className={`p-4 rounded-lg flex items-start space-x-3 ${
            simulated.sBalance < safetyMargin ? 'bg-red-50 border border-red-200' : 'bg-brand-50 border border-brand-200'
          }`}>
            <AlertCircle className={`w-6 h-6 mt-0.5 ${simulated.sBalance < safetyMargin ? 'text-red-600' : 'text-brand-600'}`} />
            <div>
              <h4 className={`font-semibold ${simulated.sBalance < safetyMargin ? 'text-red-800' : 'text-brand-800'}`}>
                Interpretação do Cenário
              </h4>
              <p className={`text-sm mt-1 ${simulated.sBalance < safetyMargin ? 'text-red-700' : 'text-brand-700'}`}>
                {simulated.sBalance < safetyMargin 
                  ? `Alerta: Com estas alterações, o saldo projectado (${formatCurrency(simulated.sBalance)}) ficará abaixo da reserva mínima de segurança. A empresa terá apenas ${simulated.coverageDays} dias de cobertura de caixa.`
                  : `Cenário Seguro: A empresa manterá um saldo confortável de ${formatCurrency(simulated.sBalance)}, acima da reserva mínima. Existe cobertura para ${simulated.coverageDays} dias de operação sem novas receitas.`}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
