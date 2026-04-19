import React from 'react';
import WorkflowStepper from '../components/WorkflowStepper';
import DashboardCards from '../components/DashboardCards';
import { ExternalLink, Download } from 'lucide-react';

export default function DashboardView() {
  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">이커머스 운영 대시보드</h1>
          <p className="text-gray-400 mt-1 font-medium">오늘도 성공적인 판매를 응원합니다.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600/10 border border-blue-600/30 text-blue-400 rounded-xl font-bold text-sm hover:bg-blue-600 hover:text-white transition-all group shadow-lg shadow-blue-600/5">
            <Download className="w-4 h-4 group-hover:scale-110 transition-transform" />
            보고서 다운로드
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
            주문 수합 시작
          </button>
        </div>
      </div>

      <WorkflowStepper currentStep={3} />
      
      <DashboardCards />

      <div className="bg-[#1C1C1E] rounded-2xl border border-gray-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">최근 주문 수합 내역</h3>
            <p className="text-sm text-gray-500 font-medium">실시간으로 마켓 정보를 가져오고 있습니다.</p>
          </div>
          <button className="text-blue-500 text-sm font-bold flex items-center gap-1 hover:underline">
            전체보기 <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1C1C1E]">
              <tr className="border-b border-gray-800">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest italic">마켓</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest italic">주문번호</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest italic">상품명</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest italic">수량</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest italic">주문자</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest italic">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {[
                { market: 'COUPANG', id: '20240417-1011', product: '[무료배송] 노르웨이 생연어 1kg 필렛', qty: 2, buyer: '김철수', status: '발주완료' },
                { market: 'SMART_STORE', id: 'SS-99283-01', product: '최고급 프리미엄 전복 10미', qty: 1, buyer: '이영희', status: '수합완료' },
                { market: 'COUPANG', id: '20240417-1012', product: '자연산 대하 2kg (냉동)', qty: 1, buyer: '박지민', status: '송장대기' },
                { market: 'SMART_STORE', id: 'SS-99283-02', product: '명품 영광 굴비 세트', qty: 3, buyer: '정우성', status: '수합완료' },
              ].map((order, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-black text-white ${order.market === 'COUPANG' ? 'bg-red-500' : 'bg-green-600'}`}>
                      {order.market === 'COUPANG' ? 'CP' : 'SS'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">{order.id}</td>
                  <td className="px-6 py-4 font-bold text-sm text-gray-300">{order.product}</td>
                  <td className="px-6 py-4 font-bold text-sm text-gray-300">{order.qty}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-400">{order.buyer}</td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-2 py-1 rounded-full text-[10px] font-bold
                      ${order.status === '발주완료' ? 'bg-blue-900/40 text-blue-400 border border-blue-800' : 
                        order.status === '수합완료' ? 'bg-purple-900/40 text-purple-400 border border-purple-800' : 'bg-orange-900/40 text-orange-400 border border-orange-800'}
                    `}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
