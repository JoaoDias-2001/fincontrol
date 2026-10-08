'use client';
import { useState } from 'react';
import { useFinanceStore } from '@/store/useFinanceStore';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';
import { Transaction } from '@/types';

export default function Movimentos() {
  const { transactions, addTransaction, deleteTransaction } = useFinanceStore();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    description: '', amount: '', date: '', type: 'INCOME', category: '', entity: '', status: 'PAID'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.amount || !formData.date) return;
    
    addTransaction({
      description: formData.description,
      amount: parseFloat(formData.amount),
      date: formData.date,
      type: formData.type as any,
      category: formData.category,
      entity: formData.entity,
      status: formData.status as any,
    });
    setShowForm(false);
    setFormData({ description: '', amount: '', date: '', type: 'INCOME', category: '', entity: '', status: 'PAID' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Gestão de Movimentos</h1>
        <button onClick={() => setShowForm(!showForm)} className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Novo Movimento
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Adicionar Movimento</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Descrição</label>
              <input type="text" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm text-sm p-2 border" placeholder="Ex: Venda Servidor" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Valor (Kz)</label>
              <input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm text-sm p-2 border" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Data</label>
              <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm text-sm p-2 border" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tipo</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm text-sm p-2 border">
                <option value="INCOME">Entrada (Receita)</option>
                <option value="EXPENSE">Saída (Despesa)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Categoria</label>
              <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm text-sm p-2 border" placeholder="Ex: Vendas, RH..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Estado</label>
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full border-slate-300 rounded-md shadow-sm text-sm p-2 border">
                <option value="PAID">Pago/Recebido</option>
                <option value="PENDING">Pendente</option>
                <option value="OVERDUE">Vencido</option>
              </select>
            </div>
            <div className="md:col-span-3 flex justify-end space-x-3 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800">Cancelar</button>
              <button type="submit" className="bg-brand-600 text-white px-6 py-2 rounded-lg text-sm font-medium">Guardar Registo</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
              <tr>
                <th className="px-6 py-4">Data</th>
                <th className="px-6 py-4">Descrição</th>
                <th className="px-6 py-4">Categoria</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Valor</th>
                <th className="px-6 py-4 text-center">Acções</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">{formatDate(tx.date)}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{tx.description}</td>
                  <td className="px-6 py-4">{tx.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${tx.status === 'PAID' ? 'bg-green-100 text-green-700' : 
                        tx.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 
                        'bg-red-100 text-red-700'}`}>
                      {tx.status === 'PAID' ? 'Liquidado' : tx.status === 'PENDING' ? 'Pendente' : 'Vencido'}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-semibold ${tx.type === 'INCOME' ? 'text-green-600' : 'text-slate-800'}`}>
                    {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => deleteTransaction(tx.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Nenhum movimento registado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
