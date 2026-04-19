import React from 'react';
import { ShoppingCart, ClipboardCheck, Send, Truck, MessageSquare } from 'lucide-react';

export default function DashboardCards() {
  const stats = [
    { label: '오늘 총 주문', value: '1,284', unit: '건', icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: '주문 수합 완료', value: '1,202', unit: '건', icon: ClipboardCheck, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: '엑셀 발주 전송', value: '984', unit: '건', icon: Send, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: '송장 등록 완료', value: '852', unit: '건', icon: Truck, color: 'text-green-400', bg: 'bg-green-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-[#1C1C1E] p-6 rounded-2xl border border-gray-800 flex items-center justify-between group hover:shadow-xl hover:shadow-black transition-all duration-300">
          <div>
            <p className="text-gray-500 text-[11px] font-black uppercase tracking-widest mb-1 italic">{stat.label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-white">{stat.value}</span>
              <span className="text-gray-500 text-xs font-bold">{stat.unit}</span>
            </div>
          </div>
          <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
            <stat.icon className="w-6 h-6" />
          </div>
        </div>
      ))}
    </div>
  );
}
