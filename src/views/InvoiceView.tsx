import React, { useState } from 'react';
import { Upload, FileDown, CheckCircle, AlertCircle, Search, Filter, FolderOpen, Loader2 } from 'lucide-react';

export default function InvoiceView() {
  const [selectedSupplier, setSelectedSupplier] = useState('한솔농산');
  const [selectedPlatform, setSelectedPlatform] = useState('쿠팡');
  const [isDragging, setIsDragging] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const platforms = ['쿠팡', '스마트스토어', '토스'];

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/invoices/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setParsedData(result.data);
        alert(`성공적으로 ${result.count}건의 송장 데이터를 파싱했습니다.`);
      } else {
        alert('파싱 실패: ' + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('서버 통신 오류가 발생했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMarketRegister = async (file?: File) => {
    if (parsedData.length === 0 && !file) {
      alert('등록할 송장 데이터가 없거나 업로드된 파일이 없습니다.');
      return;
    }

    setIsUploading(true);
    // In a real app, if a file is provided here, we'd parse it first.
    // For this demo, we'll simulate a 2-second registration process.
    try {
      setTimeout(() => {
        alert(`${selectedPlatform}에 ${file ? '첨부된 파일의' : ''} 송장 등록 처리가 완료되었습니다.`);
        setIsUploading(false);
      }, 2000);
    } catch (error) {
      alert(`${selectedPlatform} 등록 중 오류가 발생했습니다.`);
      setIsUploading(false);
    }
  };

  const suppliers = ['한솔농산', '산지직송농원', '바다수산', '정육대통령'];

  const pendingOrders = [
    { id: '20240417-1012', product: '자연산 대하 2kg (냉동)', supplier: '바다수산', receiver: '박지민', status: '송장대기' },
    { id: '20240417-1015', product: '명품 영광 굴비 세트', supplier: '한솔농산', receiver: '김두석', status: '송장대기' },
    { id: '20240417-1018', product: '고당도 스테비아 토마토 2kg', supplier: '한솔농산', receiver: '이지혜', status: '송장대기' },
    { id: '20240417-1022', product: '한우 1++ 등채 스테이크', supplier: '정육대통령', receiver: '최민수', status: '송장대기' },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">송장 관리</h1>
        <p className="text-gray-400 font-medium">도매처 송장을 업로드하고 쿠팡에 자동 등록합니다.</p>
      </div>

      <div className="grid gap-6">
        {/* Step 1: Excel Upload */}
        <section className="bg-[#1C1C1E] rounded-2xl border border-gray-800 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">1</span>
            <h2 className="text-xl font-bold text-white">1단계: 도매처 송장 엑셀 업로드</h2>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-500 mb-2">도매처 선택</label>
            <select 
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full max-w-sm bg-[#2C2C2E] border-none text-white rounded-xl py-3 px-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all cursor-pointer"
            >
              {suppliers.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div 
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { 
              e.preventDefault(); 
              setIsDragging(false); 
              const file = e.dataTransfer.files[0];
              if (file) handleFileUpload(file);
            }}
            className={`
              relative group flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer
              ${isDragging ? 'bg-blue-600/10 border-blue-600' : 'bg-[#2C2C2E] border-gray-700 hover:border-gray-500'}
              ${isUploading ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <div className={`p-4 rounded-2xl mb-4 transition-transform group-hover:scale-110 ${isDragging ? 'bg-blue-600' : 'bg-[#3A3A3C]'}`}>
              {isUploading ? <Loader2 className="w-10 h-10 text-blue-500 animate-spin" /> : <FolderOpen className={`w-10 h-10 ${isDragging ? 'text-white' : 'text-gray-400'}`} />}
            </div>
            <p className="text-lg font-bold text-white mb-1">
              {isUploading ? '처리 중...' : '송장 엑셀 파일을 드래그하거나 클릭하세요'}
            </p>
            <p className="text-gray-500 text-sm font-medium">xlsx 파일</p>
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              accept=".xlsx" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileUpload(file);
              }}
            />
          </div>
        </section>

        {/* Step 2: Market Registration */}
        <section className="bg-[#1C1C1E] rounded-2xl border border-gray-800 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold">2</span>
            <h2 className="text-xl font-bold text-white">2단계: 송장 등록</h2>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-500 mb-2">플랫폼 선택</label>
            <div className="flex gap-2">
              {platforms.map(platform => (
                <button
                  key={platform}
                  onClick={() => setSelectedPlatform(platform)}
                  className={`
                    px-6 py-2.5 rounded-xl text-sm font-bold transition-all
                    ${selectedPlatform === platform 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-[#2C2C2E] text-gray-400 hover:text-gray-200'}
                  `}
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>

          <p className="text-gray-400 mb-6 font-medium">
            매칭된 송장을 {selectedPlatform}에 일괄 등록합니다.
          </p>
          
          <div className="relative inline-block overflow-hidden">
            <button 
              disabled={isUploading}
              className={`
                flex items-center gap-2 px-8 py-3.5 bg-[#4CD964] text-black font-black rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-sm uppercase tracking-wide shadow-lg shadow-green-500/20
                ${isUploading ? 'opacity-50 grayscale cursor-not-allowed' : ''}
              `}
            >
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isUploading ? '등록 처리 중...' : `${selectedPlatform} 송장 파일 업로드 및 일괄 등록`}
            </button>
            <input 
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              accept=".xlsx, .xls, .csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleMarketRegister(file);
              }}
            />
          </div>
        </section>

        {/* Unregistered Orders List */}
        <section className="bg-[#1C1C1E] rounded-2xl border border-gray-800 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-gray-800 flex items-center justify-between bg-[#1C1C1E]">
            <div className="flex items-baseline gap-2">
              <h3 className="text-xl font-bold text-white">송장 미등록 주문</h3>
              <span className="text-gray-500 font-bold text-lg">(98건)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="미등록 주문 검색..." 
                  className="bg-[#2C2C2E] border-none text-xs text-white pl-9 pr-4 py-2 rounded-lg w-64 outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
              <button className="p-2 bg-[#2C2C2E] text-gray-400 rounded-lg hover:text-white transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800 bg-[#1C1C1E]">
                  <th className="px-8 py-4 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] italic">주문번호</th>
                  <th className="px-8 py-4 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] italic">상품명</th>
                  <th className="px-8 py-4 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] italic">도매처</th>
                  <th className="px-8 py-4 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] italic">수취인</th>
                  <th className="px-8 py-4 text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] italic">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {pendingOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors cursor-pointer group">
                    <td className="px-8 py-5 font-mono text-xs text-gray-400">{order.id}</td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors capitalize">{order.product}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-gray-400 bg-gray-800/50 px-2.5 py-1 rounded-md">{order.supplier}</span>
                    </td>
                    <td className="px-8 py-5 text-sm font-medium text-gray-400">{order.receiver}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-xs font-bold text-orange-500">{order.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
