import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, Download, Calendar, ExternalLink, RefreshCcw, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';

const getKSTDate = (offsetDays = 0) => {
  const date = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

interface Order {
  id: string;
  market: 'COUPANG' | 'SMART_STORE';
  orderDate: string;
  productName: string;
  optionName: string;
  quantity: number;
  customerName: string;
  recipientName: string;
  status: 'PENDING' | 'ORDERED' | 'SHIPPED' | 'CANCELLED';
  totalPrice: number;
}

export default function OrdersView() {
  const [orders, setOrders] = useState<Order[]>([
    { id: '20240417-1011', market: 'COUPANG', orderDate: `${getKSTDate(0)} 10:30`, productName: '[무료배송] 노르웨이 생연어 1kg 필렛', optionName: '대형 / 횟감용', quantity: 2, customerName: '김철수', recipientName: '김철수', status: 'ORDERED', totalPrice: 59800 },
    { id: 'SS-99283-01', market: 'SMART_STORE', orderDate: `${getKSTDate(0)} 11:15`, productName: '최고급 프리미엄 전복 10미', optionName: '1kg내외', quantity: 1, customerName: '이영희', recipientName: '이영희', status: 'PENDING', totalPrice: 45000 },
    { id: '20240417-1012', market: 'COUPANG', orderDate: `${getKSTDate(-1)} 12:05`, productName: '자연산 대하 2kg (냉동)', optionName: 'L사이즈', quantity: 1, customerName: '박지민', recipientName: '박지민', status: 'PENDING', totalPrice: 32000 },
    { id: 'SS-99283-02', market: 'SMART_STORE', orderDate: `${getKSTDate(-1)} 14:20`, productName: '명품 영광 굴비 세트', optionName: '10미 / 1.2kg', quantity: 3, customerName: '정우성', recipientName: '정우성', status: 'SHIPPED', totalPrice: 156000 },
    { id: '20240417-1015', market: 'COUPANG', orderDate: `${getKSTDate(-2)} 15:45`, productName: '고당도 스테비아 토마토 2kg', optionName: '특작 / 팩포장', quantity: 1, customerName: '이지혜', recipientName: '김하늘', status: 'ORDERED', totalPrice: 18900 },
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    productName: '',
    optionName: '',
    quantity: 1,
    status: 'PENDING' as Order['status']
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  
  // Date Picker State
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [dateRange, setDateRange] = useState({ 
    start: getKSTDate(-7), // Default to last 7 days from today
    end: getKSTDate(0)     // Today in KST
  });

  // Filter State
  const [marketFilter, setMarketFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Refresh & Stats State
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date().toLocaleTimeString('ko-KR'));

  // Auto Refresh Setup (15 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh();
    }, 15 * 60 * 1000); // 15 minutes
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API fetch delay
    setTimeout(() => {
      setLastRefreshed(new Date().toLocaleTimeString('ko-KR'));
      setIsRefreshing(false);
      // In a real app, we would fetch fresh data from the server here
      console.log('Orders synced with markets at:', new Date().toISOString());
    }, 1500);
  };

  const handleDownloadExcel = () => {
    if (filteredOrders.length === 0) {
      alert('다운로드할 데이터가 없습니다.');
      return;
    }

    // Transform data for Excel
    const dataToExport = filteredOrders.map(order => ({
      '주문일시': order.orderDate,
      '마켓': order.market === 'COUPANG' ? '쿠팡' : '스마트스토어',
      '주문번호': order.id,
      '상품명': order.productName,
      '옵션명': order.optionName,
      '수량': order.quantity,
      '주문자': order.customerName,
      '수취인': order.recipientName,
      '총금액': order.totalPrice,
      '상태': getStatusLabel(order.status)
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
    XLSX.writeFile(workbook, `orders_export_${getKSTDate(0).replace(/\./g, '')}.xlsx`);
  };

  const openEditModal = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      productName: order.productName,
      optionName: order.optionName,
      quantity: order.quantity,
      status: order.status
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!editingOrder) return;
    setOrders(orders.map(o => o.id === editingOrder.id ? { ...o, ...formData } : o));
    setIsModalOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      case 'ORDERED': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'SHIPPED': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'CANCELLED': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return '수합완료';
      case 'ORDERED': return '발주완료';
      case 'SHIPPED': return '배송중';
      case 'CANCELLED': return '취소완료';
      default: return status;
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = (
        order.id.toLowerCase().includes(q) ||
        order.productName.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.recipientName.toLowerCase().includes(q)
      );

      const orderDateOnly = order.orderDate.split(' ')[0]; // YYYY.MM.DD
      const matchesDate = orderDateOnly >= dateRange.start && orderDateOnly <= dateRange.end;

      const matchesMarket = marketFilter === 'ALL' || order.market === marketFilter;
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;

      return matchesSearch && matchesDate && matchesMarket && matchesStatus;
    });
  }, [orders, searchQuery, dateRange, marketFilter, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">주문 내역</h1>
          <p className="text-gray-400 font-medium">연동된 모든 마켓의 실시간 주문 데이터를 통합 관리합니다.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest italic">마지막 동기화: {lastRefreshed}</span>
            <div className="flex gap-2">
              <button 
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#1C1C1E] border border-gray-800 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:border-gray-600 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" />
                엑셀 다운로드
              </button>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`
                  flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all
                  ${isRefreshing ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                {isRefreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                {isRefreshing ? '동기화 중...' : '주문 새로고침'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#1C1C1E] p-6 rounded-2xl border border-gray-800 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="주문번호, 고객명, 상품명 검색..."
            className="w-full bg-[#2C2C2E] border-none text-sm text-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>
        <button 
          onClick={() => setIsDatePickerOpen(true)}
          className="flex items-center gap-2 bg-[#2C2C2E] px-4 py-2.5 rounded-xl border border-gray-800 hover:bg-white/5 transition-all text-left"
        >
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-300 font-medium">{dateRange.start} - {dateRange.end}</span>
        </button>
        <div className="flex items-center gap-2">
          <select 
            value={marketFilter}
            onChange={(e) => setMarketFilter(e.target.value)}
            className="bg-[#2C2C2E] border-none text-sm text-white px-4 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
          >
            <option value="ALL">모든 마켓</option>
            <option value="COUPANG">쿠팡</option>
            <option value="SMART_STORE">스마트스토어</option>
          </select>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#2C2C2E] border-none text-sm text-white px-4 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
          >
            <option value="ALL">모든 상태</option>
            <option value="PENDING">수합완료</option>
            <option value="ORDERED">발주완료</option>
            <option value="SHIPPED">배송중</option>
            <option value="CANCELLED">취소완료</option>
          </select>
        </div>
        <button className="p-2.5 bg-blue-600/10 text-blue-500 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      {/* Order Table */}
      <div className="bg-[#1C1C1E] rounded-2xl border border-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800 bg-[#1C1C1E]">
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic">주문일시</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic">마켓/주문번호</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic">상품/옵션</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic text-right">수량/금액</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic">주문자</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic">수취인</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic text-center">상태</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] italic text-center">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                    <td className="px-6 py-5 text-xs text-gray-400 font-medium">{order.orderDate}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black text-white ${order.market === 'COUPANG' ? 'bg-red-500' : 'bg-green-600'}`}>
                          {order.market === 'COUPANG' ? 'CP' : 'SS'}
                        </span>
                        <span className="text-xs font-mono text-gray-400 group-hover:text-blue-400 transition-colors uppercase">#{order.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-xs">
                      <p className="text-sm font-bold text-gray-200 truncate mb-1">{order.productName}</p>
                      <p className="text-xs text-gray-500 font-medium italic">옵션: {order.optionName}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <p className="text-sm font-black text-white mb-1">{order.quantity}개</p>
                      <p className="text-xs text-gray-500 font-mono tracking-tighter">{order.totalPrice.toLocaleString()}원</p>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-400">{order.customerName}</td>
                    <td className="px-6 py-5 text-sm font-medium text-gray-400">{order.recipientName}</td>
                    <td className="px-6 py-5 text-center">
                      <span className={`
                        px-2.5 py-1 rounded-full text-[10px] font-black border
                        ${getStatusColor(order.status)}
                      `}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button 
                        onClick={() => openEditModal(order)}
                        className="p-2 bg-[#2C2C2E] text-gray-500 hover:text-white rounded-lg transition-colors border border-gray-800"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 font-bold italic">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-6 border-t border-gray-800 flex items-center justify-between bg-[#1C1C1E]">
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest italic">Showing {filteredOrders.length} results</p>
          <div className="flex gap-2">
            {[1, 2, 3, '...', 12].map((page, i) => (
              <button 
                key={i} 
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${page === 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-gray-500 hover:bg-white/5'}`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Order Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-[#1C1C1E] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-800 flex items-center justify-between bg-[#1C1C1E]">
              <h3 className="text-xl font-black text-white italic tracking-tight uppercase">주문 상세 수정</h3>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">ID: {editingOrder?.id}</p>
            </div>
            
            <div className="p-8 space-y-6 bg-[#161617]">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">상품명</label>
                <input 
                  type="text" 
                  value={formData.productName}
                  onChange={(e) => setFormData({...formData, productName: e.target.value})}
                  className="w-full bg-[#2C2C2E] border-none text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">옵션명</label>
                <input 
                  type="text" 
                  value={formData.optionName}
                  onChange={(e) => setFormData({...formData, optionName: e.target.value})}
                  className="w-full bg-[#2C2C2E] border-none text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">수량</label>
                  <input 
                    type="number" 
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                    className="w-full bg-[#2C2C2E] border-none text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">진행 상태</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as Order['status']})}
                    className="w-full bg-[#2C2C2E] border-none text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-all font-bold cursor-pointer"
                  >
                    <option value="PENDING">수합완료</option>
                    <option value="ORDERED">발주완료</option>
                    <option value="SHIPPED">배송중</option>
                    <option value="CANCELLED">취소완료</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-8 bg-[#1C1C1E] flex gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-4 bg-gray-800 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-700 transition-all italic"
              >
                취소
              </button>
              <button 
                onClick={handleSave}
                className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all italic"
              >
                수정 완료
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Date Picker Modal */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsDatePickerOpen(false)}></div>
          <div className="relative w-full max-w-sm bg-[#1C1C1E] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-gray-800 bg-[#1C1C1E]">
              <h3 className="text-xl font-black text-white italic tracking-tight uppercase">조회 기간 선택</h3>
            </div>
            <div className="p-8 space-y-8 bg-[#161617]">
              {/* Quick Selection */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 italic">빠른 기간 선택</label>
                <div className="grid grid-cols-2 gap-2">
                  {['오늘', '어제', '지난 7일', '이번 달', '지난 달', '지난 30일'].map((label) => (
                    <button 
                      key={label}
                      onClick={() => {
                        if (label === '오늘') setDateRange({ start: getKSTDate(0), end: getKSTDate(0) });
                        if (label === '어제') setDateRange({ start: getKSTDate(-1), end: getKSTDate(-1) });
                        if (label === '지난 7일') setDateRange({ start: getKSTDate(-7), end: getKSTDate(0) });
                        if (label === '지난 30일') setDateRange({ start: getKSTDate(-30), end: getKSTDate(0) });
                        if (label === '이번 달') {
                          const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
                          const start = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.01`;
                          setDateRange({ start, end: getKSTDate(0) });
                        }
                        if (label === '지난 달') {
                          const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
                          now.setMonth(now.getMonth() - 1);
                          const year = now.getFullYear();
                          const month = String(now.getMonth() + 1).padStart(2, '0');
                          const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
                          setDateRange({ 
                            start: `${year}.${month}.01`, 
                            end: `${year}.${month}.${String(lastDay).padStart(2, '0')}` 
                          });
                        }
                      }}
                      className={`
                        py-3 px-4 rounded-xl text-xs font-bold transition-all border
                        ${(label === '오늘' && dateRange.start === getKSTDate(0) && dateRange.end === getKSTDate(0)) ||
                          (label === '지난 7일' && dateRange.start === getKSTDate(-7) && dateRange.end === getKSTDate(0))
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                          : 'bg-[#2C2C2E] border-gray-800 text-gray-400 hover:text-white hover:border-gray-600'}
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Calendar Range */}
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 italic">기간 직접 설정 (달력)</label>
                <div className="flex items-center gap-3 bg-[#1C1C1E] p-4 rounded-2xl border border-gray-800">
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-gray-600 uppercase mb-1 ml-1">START</p>
                    <input 
                      type="date" 
                      value={dateRange.start.replace(/\./g, '-')}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value.replace(/-/g, '.')})}
                      className="w-full bg-transparent border-none text-white p-0 text-sm focus:ring-0 outline-none font-bold"
                    />
                  </div>
                  <div className="w-px h-8 bg-gray-800"></div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-gray-600 uppercase mb-1 ml-1">END</p>
                    <input 
                      type="date" 
                      value={dateRange.end.replace(/\./g, '-')}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value.replace(/-/g, '.')})}
                      className="w-full bg-transparent border-none text-white p-0 text-sm focus:ring-0 outline-none font-bold"
                    />
                  </div>
                  <Calendar className="w-5 h-5 text-blue-500 ml-2" />
                </div>
              </div>
            </div>
            <div className="p-8 bg-[#1C1C1E]">
              <button 
                onClick={() => setIsDatePickerOpen(false)}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all italic"
              >
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
