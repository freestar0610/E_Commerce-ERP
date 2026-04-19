import React, { useState } from 'react';
import { Plus, Search, FileText, Phone, Mail, Globe, Settings2, Trash2, Edit2, ShieldCheck, Database } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  category: string;
  contact: string;
  email: string;
  website: string;
  apiType: 'EXCEL' | 'API';
  itemCount: number;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function SuppliersView() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([
    { id: '1', name: '한솔농산', category: '과일/채소', contact: '010-1234-5678', email: 'hansol@market.com', website: 'https://hansol-agri.co.kr', apiType: 'EXCEL', itemCount: 124, status: 'ACTIVE' },
    { id: '2', name: '바다수산', category: '수산물/해산물', contact: '02-998-1234', email: 'service@bada-sea.com', website: 'https://bada-sea.com', apiType: 'EXCEL', itemCount: 85, status: 'ACTIVE' },
    { id: '3', name: '정육대통령', category: '축산/식육', contact: '010-5555-4433', email: 'king@meat.net', website: 'https://meat-king.net', apiType: 'API', itemCount: 52, status: 'ACTIVE' },
    { id: '4', name: '산지직송농원', category: '과일/곡류', contact: '031-778-0012', email: 'direct@farm.kr', website: 'http://farm-direct.kr', apiType: 'EXCEL', itemCount: 18, status: 'INACTIVE' },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    contact: '',
    email: '',
    website: '',
    apiType: 'EXCEL' as 'EXCEL' | 'API',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE'
  });

  const openAddModal = () => {
    setEditingSupplier(null);
    setFormData({ name: '', category: '', contact: '', email: '', website: '', apiType: 'EXCEL', status: 'ACTIVE' });
    setIsModalOpen(true);
  };

  const openEditModal = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({ 
      name: supplier.name, 
      category: supplier.category, 
      contact: supplier.contact, 
      email: supplier.email, 
      website: supplier.website, 
      apiType: supplier.apiType, 
      status: supplier.status 
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingSupplier) {
      setSuppliers(suppliers.map(s => s.id === editingSupplier.id ? { ...s, ...formData } : s));
    } else {
      setSuppliers([...suppliers, { ...formData, id: Date.now().toString(), itemCount: 0 }]);
    }
    setIsModalOpen(false);
  };

  const deleteSupplier = (id: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setSuppliers(suppliers.filter(s => s.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">도매처 관리</h1>
          <p className="text-gray-400 font-medium">거래 중인 모든 도매 공급처의 정보와 발주 방식을 통합 관리합니다.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus className="w-5 h-5" />
          신규 도매처 등록
        </button>
      </div>

      {/* Stats Table */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: '활성 도매처', value: '12', icon: ShieldCheck, color: 'text-green-500' },
          { label: '전체 취급 품목', value: '8,492', icon: Database, color: 'text-blue-500' },
          { label: '이번 달 발주액', value: '4,280', unit: '만원', icon: FileText, color: 'text-purple-500' },
          { label: '평균 배송 소요일', value: '1.2', unit: '일', icon: Clock, color: 'text-orange-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#1C1C1E] p-6 rounded-2xl border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-white/5 rounded-lg ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest italic">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white">{stat.value}</span>
              {stat.unit && <span className="text-xs text-gray-500 font-bold">{stat.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="bg-[#1C1C1E] border border-gray-800 rounded-3xl p-8 hover:border-gray-700 transition-all group shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#2C2C2E] rounded-2xl flex items-center justify-center border border-gray-800 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300">
                    <FileText className="w-7 h-7 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{supplier.name}</h3>
                    <p className="text-sm text-gray-500 font-medium italic">{supplier.category}</p>
                  </div>
                </div>
                <span className={`
                  px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase
                  ${supplier.status === 'ACTIVE' ? 'bg-green-600/10 text-green-500 border border-green-600/20' : 'bg-red-600/10 text-red-500 border border-red-600/20'}
                `}>
                  {supplier.status === 'ACTIVE' ? '협력 중' : '중단됨'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 text-gray-400 group/item cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#2C2C2E] flex items-center justify-center flex-shrink-0 group-hover/item:bg-white/10 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold font-mono tracking-tight group-hover/item:text-white transition-colors">{supplier.contact}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-400 group/item cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#2C2C2E] flex items-center justify-center flex-shrink-0 group-hover/item:bg-white/10 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold font-mono tracking-tight group-hover/item:text-white transition-colors">{supplier.email}</span>
                </div>
                <a 
                  href={supplier.website} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-gray-400 group/item"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#2C2C2E] flex items-center justify-center flex-shrink-0 group-hover/item:bg-white/10 transition-colors">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold font-mono tracking-tight group-hover/item:text-white transition-colors truncate">홈페이지 바로가기</span>
                </a>
                <div className="flex items-center gap-3 text-gray-400 group/item cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#2C2C2E] flex items-center justify-center flex-shrink-0 group-hover/item:bg-white/10 transition-colors">
                    <Settings2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold font-mono tracking-tight group-hover/item:text-white transition-colors">발주 방식: <span className="text-blue-500 font-black italic">{supplier.apiType}</span></span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-800">
              <p className="text-xs text-gray-500 font-black uppercase tracking-widest italic">
                현재 매핑된 품목 <span className="text-white ml-1">{supplier.itemCount}</span>건
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditModal(supplier)}
                  className="p-3 bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-all border border-gray-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteSupplier(supplier.id)}
                  className="p-3 bg-white/5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-gray-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={openAddModal}
          className="bg-transparent border-2 border-dashed border-gray-800 rounded-3xl p-12 flex flex-col items-center justify-center group hover:border-gray-600 transition-all min-h-[300px]"
        >
          <div className="w-16 h-16 bg-[#1C1C1E] border border-gray-800 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="w-8 h-8 text-gray-700 group-hover:text-blue-600" />
          </div>
          <p className="text-lg font-black text-gray-700 group-hover:text-gray-400 italic">새로운 도매처 추가하기</p>
        </button>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-xl bg-[#1C1C1E] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-800 flex items-center justify-between bg-[#1C1C1E]">
              <h3 className="text-2xl font-black text-white italic tracking-tight">{editingSupplier ? '도매처 정보 수정' : '신규 도매처 등록'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white transition-colors">
                <Trash2 className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <div className="p-8 grid grid-cols-2 gap-6 bg-[#161617]">
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">상호명</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#2C2C2E] border-none text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-700 font-bold"
                  placeholder="예: (주)한솔푸드"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">카테고리</label>
                <input 
                  type="text" 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full bg-[#2C2C2E] border-none text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-700 font-bold"
                  placeholder="예: 농산물"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">발주 방식</label>
                <select 
                  value={formData.apiType}
                  onChange={(e) => setFormData({...formData, apiType: e.target.value as 'EXCEL' | 'API'})}
                  className="w-full bg-[#2C2C2E] border-none text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold cursor-pointer"
                >
                  <option value="EXCEL">엑셀 발주 (자동 생성)</option>
                  <option value="API">실시간 API 연동</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">대표 연락처</label>
                <input 
                  type="text" 
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  className="w-full bg-[#2C2C2E] border-none text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-700 font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">발주용 이메일</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#2C2C2E] border-none text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-700 font-bold"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">홈페이지 (도매 몰)</label>
                <input 
                  type="text" 
                  value={formData.website}
                  onChange={(e) => setFormData({...formData, website: e.target.value})}
                  className="w-full bg-[#2C2C2E] border-none text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all placeholder:text-gray-700 font-bold"
                />
              </div>
            </div>

            <div className="p-8 bg-[#1C1C1E] flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 bg-gray-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-700 transition-all italic"
              >
                닫기
              </button>
              <button 
                onClick={handleSave}
                className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all italic"
              >
                {editingSupplier ? '정보 업데이트 완료' : '도매처 등록 완료'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Clock(props: any) {
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
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}
