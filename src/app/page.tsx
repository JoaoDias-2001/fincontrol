'use client';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency } from '@/lib/utils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { useMemo } from 'react';

export default function Dashboard() {
  const { transactions, safetyMargin } = useFinanceStore();

  const metrics = useMemo(() => {
    let income = 0;
    let expense = 0;
    let overdue = 0;

    transactions.forEach(t => {
      if (t.type === 'INCOME') income += t.amount;
      if (t.type === 'EXPENSE') expense += t.amount;
      if (t.status === 'OVERDUE') overdue += t.amount;
    });

    const netProfit = income - expense;
    const initialBalance = 850000;
    const currentBalance = initialBalance + netProfit;
    const netMargin = income > 0 ? (netProfit / income) * 100 : 0;
    
    let score = 100;
    if (currentBalance < safetyMargin) score -= 30;
    if (overdue > 0) score -= 15;
    if (netMargin < 10) score -= 10;
    
    return { income, expense, netProfit, currentBalance, netMargin, overdue, score };
  }, [transactions, safetyMargin]);

  const chartData = [
    { name: 'Jul', entradas: 1800000, saidas: 1200000 },
    { name: 'Ago', entradas: 2100000, saidas: 1400000 },
    { name: 'Set', entradas: 1950000, saidas: 1350000 },
    { name: 'Out', entradas: metrics.income, saidas: metrics.expense },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Visão Executiva</h1>
      </div>

      {/* Resumo Executivo */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-brand-50 rounded-lg">
            <Activity className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">Resumo Executivo</h3>
            <p className="text-slate-600 leading-relaxed text-sm">
              A posição financeira actual apresenta liquidez {metrics.currentBalance >= safetyMargin ? 'confortável' : 'em alerta'}, com caixa de <strong>{formatCurrency(metrics.currentBalance)}</strong>. 
              A margem líquida mantém-se em <strong>{metrics.netMargin.toFixed(1)}%</strong>. 
              {metrics.overdue > 0 ? ` O principal ponto de atenção encontra-se em contas vencidas no valor de ${formatCurrency(metrics.overdue)}.` : ' Não existem valores vencidos no momento, o que demonstra excelente disciplina financeira.'}
            </p>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Saldo Disponível" value={metrics.currentBalance} trend={+5.2} isCurrency />
        <MetricCard title="Entradas do Período" value={metrics.income} trend={+8.4} isCurrency icon={<TrendingUp className="text-green-500 w-5 h-5"/>} />
        <MetricCard title="Saídas do Período" value={metrics.expense} trend={+3.1} isCurrency icon={<TrendingDown className="text-red-500 w-5 h-5"/>} />
        <MetricCard title="Resultado Líquido" value={metrics.netProfit} isCurrency 
          valueColor={metrics.netProfit >= 0 ? 'text-green-600' : 'text-red-600'} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center items-center">
          <h3 className="text-slate-500 text-sm font-medium mb-4">Saúde Financeira</h3>
          <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-brand-100 mb-2">
            <span className="text-3xl font-bold text-slate-800">{metrics.score}/100</span>
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-brand-500" strokeDasharray={`${metrics.score * 2.89} 289`} />
            </svg>
          </div>
          <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full uppercase tracking-wider">
            {metrics.score >= 80 ? 'Saudável' : metrics.score >= 50 ? 'Atenção' : 'Risco'}
          </span>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm col-span-2">
           <h3 className="text-slate-800 font-semibold mb-6">Fluxo de Caixa Mensal</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} tickFormatter={(val) => `${val/1000}k`} />
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                  <Bar dataKey="entradas" fill="#22c55e" radius={[4, 4, 0, 0]} name="Entradas" />
                  <Bar dataKey="saidas" fill="#ef4444" radius={[4, 4, 0, 0]} name="Saídas" />
                </BarChart>
             </ResponsiveContainer>
           </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, trend, isCurrency, icon, valueColor = "text-slate-800" }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="flex items-baseline space-x-2">
        <h2 className={`text-2xl font-bold ${valueColor}`}>
          {isCurrency ? formatCurrency(value) : value}
        </h2>
      </div>
      {trend && (
        <div className={`mt-2 text-xs font-medium flex items-center ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% face ao mês anterior
        </div>
      )}
    </div>
  );
}
