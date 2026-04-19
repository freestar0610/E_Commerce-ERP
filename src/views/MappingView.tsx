import React, { useState } from 'react';
import { Search, Link, Unlink, AlertCircle, CheckCircle2, SearchCode, ShoppingBag, Truck } from 'lucide-react';

interface MappingItem {
  id: string;
  marketProduct: string;
  marketOption: string;
  supplierProduct: string | null;
  supplierOption: string | null;
  supplierName: string | null;
  status: 'MAPPED' | 'UNMAPPED';
}

export default function MappingView() {
  const [mappings, setMappings] = useState<MappingItem[]>([
    { id: '1', marketProduct: '[무료배송] 노르웨이 생연어 1kg 필렛', marketOption: '대형 / 횟감용', supplierProduct: '노르웨이 슈페리어급 연어 1kg', supplierOption: '횟감용 단품', supplierName: '바다수산', status: 'MAPPED' },
    { id: '2', marketProduct: '최고급 프리미엄 전복 10미', marketOption: '1kg내외', supplierProduct: null, supplierOption: null, supplierName: null, status: 'UNMAPPED' },
    { id: '3', marketProduct: '자연산 대하 2kg (냉동)', marketOption: 'L사이즈', supplierProduct: '냉동 대하 왕새우 2kg', supplierOption: '전용 박스포장', supplierName: '바다수산', status: 'MAPPED' },
    { id: '4', marketProduct: '명품 영광 굴비 세트', marketOption: '10미 / 1.2kg', supplierProduct: null, supplierOption: null, supplierName: null, status: 'UNMAPPED' },
    { id: '5', marketProduct: '고당도 스테비아 토마토 2kg', marketOption: '특작 / 팩포장', supplierProduct: '스테비아 토망고 브랜드 2kg', supplierOption: '완전 익음', supplierName: '한솔농산', status: 'MAPPED' },
  ]);

  const [activeTab, setActiveTab] = useState<'ALL' | 'UNMAPPED'>('ALL');
  
  // Mapping Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetProduct, setTargetProduct] = useState<MappingItem | null>(null);
  const [supplierSearch, setSupplierSearch] = useState('');
  
  const openMappingModal = (item: MappingItem) => {
    setTargetProduct(item);
    setSupplierSearch('');
    setIsModalOpen(true);
  };

  const completeMapping = (supplierProduct: string, supplierOption: string, supplierName: string) => {
    if (!targetProduct) return;
    setMappings(mappings.map(m => m.id === targetProduct.id ? {
      ...m,
      supplierProduct,
      supplierOption,
      supplierName,
      status: 'MAPPED'
    } : m));
    setIsModalOpen(false);
  };

  const removeMapping = (id: string) => {
    setMappings(mappings.map(m => m.id === id ? {
      ...m,
      supplierProduct: null,
      supplierOption: null,
      supplierName: null,
      status: 'UNMAPPED'
    } : m));
  };

  const filteredMappings = activeTab === 'UNMAPPED' 
    ? mappings.filter(m => m.status === 'UNMAPPED') 
    : mappings;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">상품 매핑 관리</h1>
          <p className="text-gray-400 font-medium">마켓 판매 상품과 도매처 공급 상품의 연결 정보를 관리합니다.</p>
        </div>
        <div className="flex bg-[#1C1C1E] p-1 rounded-xl border border-gray-800">
          <button 
            onClick={() => setActiveTab('ALL')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'ALL' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            전체 보기
          </button>
          <button 
            onClick={() => setActiveTab('UNMAPPED')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'UNMAPPED' ? 'bg-red-500 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
          >
            미매핑 ({mappings.filter(m => m.status === 'UNMAPPED').length})
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-blue-600/10 rounded-xl">
            <ShoppingBag className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">총 판매 상품</p>
            <p className="text-2xl font-black text-white">482 <span className="text-xs text-gray-600">종</span></p>
          </div>
        </div>
        <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-green-600/10 rounded-xl">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">매핑 완료</p>
            <p className="text-2xl font-black text-white text-green-500">456 <span className="text-xs text-green-900">종</span></p>
          </div>
        </div>
        <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
          <div className="p-3 bg-red-600/10 rounded-xl">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">미매핑 상품</p>
            <p className="text-2xl font-black text-white text-red-500">26 <span className="text-xs text-red-900">종</span></p>
          </div>
        </div>
      </div>

      {/* Mapping Tool */}
      <div className="bg-[#1C1C1E] rounded-2xl border border-gray-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-[#1C1C1E]">
          <div className="relative w-96">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="마켓 상품명 검색..."
              className="w-full bg-[#2C2C2E] border-none text-sm text-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-500 transition-all">
            <SearchCode className="w-4 h-4" />
            마켓 상품 동기화
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic">
                <th className="px-8 py-4">마켓 상품 정보 (판매용)</th>
                <th className="px-8 py-4 text-center">연결</th>
                <th className="px-8 py-4">도매처 상품 정보 (매입용)</th>
                <th className="px-8 py-4 text-center">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredMappings.map((mapped) => (
                <tr key={mapped.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6 w-1/2">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#2C2C2E] rounded-xl flex-shrink-0 flex items-center justify-center border border-gray-800 group-hover:border-gray-600 transition-colors">
                        <ShoppingBag className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-200 mb-1 leading-tight">{mapped.marketProduct}</p>
                        <p className="text-xs text-gray-500 font-medium">옵션: {mapped.marketOption}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    {mapped.status === 'MAPPED' ? (
                      <Link className="w-5 h-5 text-blue-500 mx-auto" />
                    ) : (
                      <Unlink className="w-5 h-5 text-gray-800 mx-auto" />
                    )}
                  </td>
                  <td className="px-8 py-6 w-1/2">
                    {mapped.status === 'MAPPED' ? (
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex-shrink-0 flex items-center justify-center border border-blue-600/20">
                          <Truck className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-blue-400 mb-1 leading-tight">{mapped.supplierProduct}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest italic">{mapped.supplierName}</span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500 font-medium">{mapped.supplierOption}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full">
                        <button 
                          onClick={() => openMappingModal(mapped)}
                          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-700 text-gray-600 hover:text-blue-500 hover:border-blue-500/50 rounded-xl transition-all group/btn"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-widest italic">도매 상품 연결하기</span>
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-center">
                    {mapped.status === 'MAPPED' ? (
                      <button 
                        onClick={() => removeMapping(mapped.id)}
                        className="text-gray-600 hover:text-red-500 transition-colors p-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => openMappingModal(mapped)}
                        className="text-blue-500 hover:underline text-xs font-bold whitespace-nowrap"
                      >
                        자동 추천
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mapping Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-2xl bg-[#1C1C1E] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-800 bg-[#1C1C1E]">
              <h3 className="text-xl font-black text-white italic tracking-tight uppercase">도매 상품 매핑</h3>
              {targetProduct && (
                <div className="mt-4 p-4 bg-blue-600/5 border border-blue-600/10 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#2C2C2E] rounded-xl flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-0.5">선택된 마켓 상품</p>
                    <p className="text-sm font-bold text-white leading-tight">{targetProduct.marketProduct}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">옵션: {targetProduct.marketOption}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-8 space-y-6 bg-[#161617]">
              <div>
                <div className="relative mb-6">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="text" 
                    value={supplierSearch}
                    onChange={(e) => setSupplierSearch(e.target.value)}
                    placeholder="도매처 상품명 혹은 상품번호 검색..."
                    className="w-full bg-[#2C2C2E] border-none text-white pl-12 pr-4 py-4 rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-700 font-bold"
                  />
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {[
                    { name: '대용량 노르웨이 연어 필렛', opt: '1.2kg 벌크', supplier: '바다수산' },
                    { name: '명주 수산 프리미엄 전복 1kg', opt: '10-12미 내외', supplier: '바다수산' },
                    { name: '완도산 전복 특대 1kg', opt: '8-9미 전용박스', supplier: '명산푸드' },
                    { name: '영광 굴비 선물세트 1호', opt: '1.5kg', supplier: '한솔농산' },
                  ].map((sitem, i) => (
                    <div 
                      key={i} 
                      onClick={() => completeMapping(sitem.name, sitem.opt, sitem.supplier)}
                      className="bg-[#2C2C2E] p-5 rounded-2xl border border-gray-800 hover:border-blue-600/50 hover:bg-[#343436] transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                          <Truck className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{sitem.name}</p>
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{sitem.supplier} • {sitem.opt}</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-600/10 text-blue-500 text-xs font-black uppercase rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">선택</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 bg-[#1C1C1E] flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 bg-gray-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-700 transition-all italic"
              >
                매핑 취소
              </button>
              <div className="flex-[2] flex flex-col justify-center">
                <p className="text-[10px] text-center text-gray-600 font-black uppercase tracking-widest underline decoration-blue-600/50 underline-offset-4">리스트에 없는 상품은 엑셀 일괄 매핑을 이용하세요</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Plus(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  );
}

function X(props: any) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}
