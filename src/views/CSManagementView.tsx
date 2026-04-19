import React, { useState } from 'react';
import { Search, Filter, MessageSquare, User, Clock, CheckCircle2, AlertCircle, Send, MoreHorizontal, BookTemplate, Plus, X, Edit2, Check } from 'lucide-react';

interface CSMessage {
  id: string;
  market: 'COUPANG' | 'SMART_STORE';
  orderId: string;
  customerName: string;
  type: '배송' | '취소' | '교환' | '기타';
  content: string;
  time: string;
  status: 'WAITING' | 'REPLIED';
}

interface CSTemplate {
  id: string;
  title: string;
  content: string;
}

export default function CSManagementView() {
  const [messages] = useState<CSMessage[]>([
    { id: '1', market: 'COUPANG', orderId: '20240417-1011', customerName: '김철수', type: '배송', content: '아직 상품이 도착하지 않았어요. 언제쯤 받을 수 있을까요?', time: '10분 전', status: 'WAITING' },
    { id: '2', market: 'SMART_STORE', orderId: 'SS-99283-01', customerName: '이영희', type: '취소', content: '사이즈 오기재로 취소하고 싶습니다.', time: '25분 전', status: 'WAITING' },
    { id: '3', market: 'COUPANG', orderId: '20240417-1015', customerName: '박지민', type: '기타', content: '대량 주문 시 할인 혜택이 있나요?', time: '1시간 전', status: 'REPLIED' },
    { id: '4', market: 'SMART_STORE', orderId: 'SS-99283-05', customerName: '최민수', type: '교환', content: '제품에 흠집이 있습니다. 교환 요청합니다.', time: '2시간 전', status: 'WAITING' },
  ]);

  const [templates, setTemplates] = useState<CSTemplate[]>([
    { id: '1', title: '배송 지연 안내', content: '고객님, 안녕하세요! 마켓 사정으로 인해 배송이 다소 지연되고 있습니다. 최대한 빠르게 상품을 받으실 수 있도록 노력하겠습니다. 죄송합니다.' },
    { id: '2', title: '품절 취소 안내', content: '고객님, 안타깝게도 상품이 현재 품절되어 발송이 어렵게 되었습니다. 주문 취소 절차를 도와드려도 괜찮을까요?' },
    { id: '3', title: '반품 접수 완료', content: '고객님, 반품 접수가 완료되었습니다. 택배 기사님이 2~3일 내로 방문할 예정이니 상품을 포장하여 준비해 주세요.' },
  ]);

  const [selectedMsg, setSelectedMsg] = useState<CSMessage | null>(messages[0]);
  const [replyText, setReplyText] = useState('');
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  
  // Modal states for Template Create/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CSTemplate | null>(null);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');

  const openAddModal = () => {
    setEditingTemplate(null);
    setModalTitle('');
    setModalContent('');
    setIsModalOpen(true);
  };

  const openEditModal = (temp: CSTemplate) => {
    setEditingTemplate(temp);
    setModalTitle(temp.title);
    setModalContent(temp.content);
    setIsModalOpen(true);
  };

  const handleSaveTemplate = () => {
    if (!modalTitle || !modalContent) return;

    if (editingTemplate) {
      // Edit mode
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id ? { ...t, title: modalTitle, content: modalContent } : t
      ));
    } else {
      // Add mode
      setTemplates([...templates, { 
        id: Date.now().toString(), 
        title: modalTitle, 
        content: modalContent 
      }]);
    }
    setIsModalOpen(false);
  };

  const removeTemplate = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent using template when clicking delete
    setTemplates(templates.filter(t => t.id !== id));
  };

  const useTemplate = (content: string) => {
    setReplyText(content);
    setIsTemplateMode(false);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6 animate-in fade-in duration-500">
      {/* Left List */}
      <div className="w-[400px] flex flex-col bg-[#1C1C1E] border border-gray-800 rounded-2xl overflow-hidden shadow-sm flex-shrink-0">
        <div className="p-6 border-b border-gray-800 bg-[#1C1C1E]">
          <h2 className="text-xl font-bold text-white mb-4">CS 문의 관리</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="주문번호, 고객명 검색..."
              className="w-full bg-[#2C2C2E] border-none text-sm text-white pl-10 pr-4 py-2.5 rounded-xl outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-800 custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              onClick={() => setSelectedMsg(msg)}
              className={`p-5 cursor-pointer transition-colors ${selectedMsg?.id === msg.id ? 'bg-blue-600/10 border-l-2 border-blue-600' : 'hover:bg-white/5'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black text-white ${msg.market === 'COUPANG' ? 'bg-red-500' : 'bg-green-600'}`}>
                  {msg.market === 'COUPANG' ? 'CP' : 'SS'}
                </span>
                <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {msg.time}
                </span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <p className="text-sm font-bold text-white">{msg.customerName}</p>
                <span className={`text-[10px] font-bold ${msg.status === 'WAITING' ? 'text-orange-500' : 'text-blue-500'}`}>
                  {msg.status === 'WAITING' ? '답변대기' : '답변완료'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2 font-mono">#{msg.orderId}</p>
              <p className="text-sm text-gray-300 line-clamp-2 leading-relaxed font-medium">{msg.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Detail / Chat */}
      <div className="flex-1 flex flex-col bg-[#1C1C1E] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        {selectedMsg ? (
          <>
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <User className="text-gray-400 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedMsg.customerName}</h3>
                  <p className="text-xs text-gray-500 font-mono">주문번호: {selectedMsg.orderId}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsTemplateMode(!isTemplateMode)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isTemplateMode ? 'bg-blue-600 text-white' : 'bg-[#2C2C2E] text-gray-400 hover:text-white'}`}
                >
                  <BookTemplate className="w-4 h-4" />
                  답변 템플릿
                </button>
                <button className="p-2 hover:bg-white/5 rounded-lg text-gray-400"><MoreHorizontal className="w-5 h-5" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
              {/* Template Management Overlay (List) */}
              {isTemplateMode && (
                <div className="absolute inset-0 bg-[#1C1C1E]/95 backdrop-blur-sm z-10 p-6 flex flex-col animate-in slide-in-from-right duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <BookTemplate className="w-5 h-5 text-blue-500" />
                        탬플릿 보관함
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">자주 쓰는 답변을 클릭하여 즉시 적용하세요.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        신규 추가
                      </button>
                      <button onClick={() => setIsTemplateMode(false)} className="text-gray-500 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {templates.map(temp => (
                      <div 
                        key={temp.id} 
                        onClick={() => useTemplate(temp.content)}
                        className="bg-[#2C2C2E] p-5 rounded-2xl border border-gray-800 group relative hover:border-blue-600/50 hover:bg-[#343436] transition-all cursor-pointer"
                      >
                        <div className="flex justify-between mb-3">
                          <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{temp.title}</h4>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button 
                              onClick={(e) => { e.stopPropagation(); openEditModal(temp); }} 
                              className="p-1.5 bg-gray-800 text-gray-400 hover:text-white rounded-md transition-colors border border-gray-700"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={(e) => removeTemplate(temp.id, e)} 
                              className="p-1.5 bg-gray-800 text-gray-400 hover:text-red-500 rounded-md transition-colors border border-gray-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{temp.content}</p>
                      </div>
                    ))}

                    {templates.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                        <BookTemplate className="w-12 h-12 mb-4 opacity-10" />
                        <p className="text-sm">등록된 템플릿이 없습니다.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Add/Edit Modal Window */}
              {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)}></div>
                  <div className="relative w-full max-w-lg bg-[#1C1C1E] border border-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                    <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <div className="p-2 bg-blue-600/10 rounded-xl">
                          <BookTemplate className="w-5 h-5 text-blue-500" />
                        </div>
                        {editingTemplate ? '템플릿 수정' : '신규 템플릿 등록'}
                      </h3>
                      <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full text-gray-500 transition-colors">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">템플릿 제목</label>
                        <input 
                          type="text" 
                          placeholder="예: 배송지연 안내, 교환방법 안내 등"
                          value={modalTitle}
                          onChange={(e) => setModalTitle(e.target.value)}
                          className="w-full bg-[#2C2C2E] border border-gray-800 text-sm text-white px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all placeholder:text-gray-600"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">답변 내용</label>
                        <textarea 
                          placeholder="고객에게 전달될 답변 내용을 입력하세요."
                          value={modalContent}
                          onChange={(e) => setModalContent(e.target.value)}
                          className="w-full bg-[#2C2C2E] border border-gray-800 text-sm text-white px-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none h-48 resize-none transition-all placeholder:text-gray-600 leading-relaxed"
                        />
                      </div>
                    </div>

                    <div className="p-6 bg-[#161617] flex gap-3">
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="flex-1 py-3.5 bg-gray-800 text-white rounded-xl font-bold text-sm hover:bg-gray-700 transition-all"
                      >
                        취소
                      </button>
                      <button 
                        onClick={handleSaveTemplate}
                        disabled={!modalTitle || !modalContent}
                        className="flex-[2] py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                      >
                        {editingTemplate ? '수정 내용 저장' : '템플릿 등록 완료'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Message */}
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gray-800 flex-shrink-0 flex items-center justify-center self-start border border-gray-700">
                  <User className="text-gray-500 w-4 h-4" />
                </div>
                <div className="max-w-[80%]">
                  <div className="bg-[#2C2C2E] p-4 rounded-2xl rounded-tl-none text-white text-sm leading-relaxed shadow-sm border border-gray-800">
                    {selectedMsg.content}
                  </div>
                  <p className="text-[10px] text-gray-500 mt-2 font-bold px-1 uppercase tracking-widest">{selectedMsg.time}</p>
                </div>
              </div>

              {selectedMsg.status === 'REPLIED' && (
                <div className="flex gap-4 flex-row-reverse animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center self-start shadow-xl shadow-blue-600/30 text-white font-bold text-[10px]">
                    N
                  </div>
                  <div className="max-w-[80%] text-right">
                    <div className="bg-blue-600 p-4 rounded-2xl rounded-tr-none text-white text-sm leading-relaxed shadow-lg shadow-blue-600/10">
                      고객님, 안녕하세요! NexCommerce 상담 센터입니다. 대량 주문 할인의 경우 수량에 따라 차등 적용되오니 톡톡이나 고객센터로 연락주시면 상세 안내 도와드리겠습니다. 감사합니다!
                    </div>
                    <p className="text-[10px] text-gray-500 mt-2 font-bold px-1 uppercase tracking-widest">마켓 전송 완료</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-[#161617] border-t border-gray-800">
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest pr-2 whitespace-nowrap italic">빠른 답변:</p>
                {templates.slice(0, 3).map(temp => (
                  <button 
                    key={temp.id}
                    onClick={() => useTemplate(temp.content)}
                    className="flex-shrink-0 px-3 py-1.5 bg-[#2C2C2E] border border-gray-700 rounded-lg text-xs font-bold text-gray-300 hover:text-white hover:bg-gray-700 transition-all"
                  >
                    {temp.title}
                  </button>
                ))}
                <button 
                  onClick={() => setIsTemplateMode(true)}
                  className="flex-shrink-0 px-3 py-1.5 text-blue-500 hover:text-blue-400 text-xs font-bold"
                >
                  더 보기
                </button>
              </div>

              <div className="flex gap-3">
                <textarea 
                  placeholder="답변 내용을 입력하세요..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-[#2C2C2E] border border-gray-800 text-sm text-white p-4 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none h-24 transition-all"
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <button className="text-gray-500 hover:text-gray-300 p-2"><AlertCircle className="w-5 h-5" /></button>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setReplyText('')}
                    className="px-6 py-2.5 bg-white/5 text-gray-400 rounded-xl font-bold text-sm hover:bg-white/10 transition-all"
                  >
                    초기화
                  </button>
                  <button className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all">
                    <Send className="w-4 h-4" />
                    답변 전송
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare className="w-16 h-16 mb-4 opacity-10" />
            <p className="text-lg font-bold">문의를 선택해 주세요</p>
          </div>
        )}
      </div>
    </div>
  );
}

