import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Link, 
  FileText, 
  Truck, 
  MessageSquare, 
  Settings,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  Key
} from 'lucide-react';

interface GuideSection {
  id: string;
  category: 'GENERAL' | 'API';
  title: string;
  icon: any;
  content: {
    purpose: string;
    steps: string[];
    tips: string[];
  };
}

export default function GuideView() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const guideSections: GuideSection[] = [
    {
      id: 'dashboard',
      category: 'GENERAL',
      title: '대시보드 운영 가이드',
      icon: LayoutDashboard,
      content: {
        purpose: '오늘의 핵심 워크플로우를 한눈에 파악하고 실시간 주문 현황을 모니터링합니다.',
        steps: [
          '주문수합: 마켓 API를 통해 신규 주문을 실시간으로 가져옵니다.',
          '발주 엑셀 생성: 수합된 주문을 기반으로 도매처별 전용 양식을 자동 생성합니다.',
          '공급사 발주: 생성된 엑셀을 다운로드하여 도매처에 전달합니다.',
          '송장 등록: 도매처로부터 받은 송장 번호를 마켓에 일괄 등록합니다.'
        ],
        tips: [
          '대시보드 상단의 실시간 숫자 카드는 10분 주기로 리프레시됩니다.',
          '워크플로우의 각 단계를 클릭하면 해당 상세 화면으로 즉시 이동합니다.'
        ]
      }
    },
    {
      id: 'orders',
      category: 'GENERAL',
      title: '주문 내역 가이드',
      icon: ShoppingCart,
      content: {
        purpose: '수합된 모든 주문 데이터를 통합 관리하고 검색합니다.',
        steps: [
          '주문 검색: 주문번호, 수취인, 상품명 등 다양한 조건으로 주문을 찾습니다.',
          '주문 상태 확인: 결제완료, 발주대기, 배송중 등 현재 진행 단계를 체크합니다.',
          '수동 주문 생성: API 연동 외에 별도 오프라인 주문을 직접 입력할 수 있습니다.'
        ],
        tips: [
          '주문 내역 엑셀 다운로드를 통해 월간 매출 정산 자료로 활용하세요.',
          '주문 취소 요청이 들어온 건은 리스트에서 즉시 확인이 가능합니다.'
        ]
      }
    },
    {
      id: 'mapping',
      category: 'GENERAL',
      title: '상품 매핑 가이드',
      icon: Link,
      content: {
        purpose: '마켓 판매 상품과 실제 도매처 공급 상품을 1:1로 연결하여 자동 발주를 가능하게 합니다.',
        steps: [
          '마켓 상품 불러오기: 연동된 쿠팡/스토어의 상품 리스트를 동기화합니다.',
          '도매처 상품 전송: 실제 공급받는 도매처와 해당 상품 옵션을 선택합니다.',
          '매핑 저장: 연결 정보를 저장하면 이후 들어오는 모든 주문이 자동 분류됩니다.'
        ],
        tips: [
          '옵션명이 복잡할 경우 "키워드 매핑" 기능을 사용해 보세요.',
          '매핑이 되지 않은 주문은 "송장 미등록" 리스트에 빨간색으로 표시됩니다.'
        ]
      }
    },
    {
      id: 'suppliers',
      category: 'GENERAL',
      title: '도매처 관리 가이드',
      icon: FileText,
      content: {
        purpose: '거래 중인 모든 위탁/도매 공급처 정보를 상세히 관리합니다.',
        steps: [
          '도매처 등록: 상호명, 담당자 연락처, 발주용 이메일/ID 등을 기록합니다.',
          '발주 양식 설정: 도매처마다 다른 엑셀 양식을 시스템에 맞게 매칭합니다.',
          '매입가 관리: 매 상품마다 변동되는 매입 단가를 기록하여 수익을 계산합니다.'
        ],
        tips: [
          '도매처별 CS 연락처를 메모해 두면 배송 지연 시 빠르게 대응할 수 있습니다.',
          '특정 도매처의 휴무일을 설정하여 발주 사고를 방지하세요.'
        ]
      }
    },
    {
      id: 'invoice',
      category: 'GENERAL',
      title: '송장 관리 가이드',
      icon: Truck,
      content: {
        purpose: '도매처에서 제공하는 배송 정보를 마켓에 효율적으로 등록합니다.',
        steps: [
          '도매처 엑셀 업로드: 도매처에서 받은 송장 결과 엑셀을 드래그하여 업로드합니다.',
          '플랫폼 선택: 송장을 등록할 마켓(쿠팡, 스마트스토어 등)을 선택합니다.',
          '일괄 등록 실행: 등록 버튼을 누르면 API를 통해 실시간으로 배송 처리가 완료됩니다.'
        ],
        tips: [
          '사용 중인 도매처의 엑셀 양식이 다를 경우 설정에서 양식을 커스터마이징 하세요.',
          '등록 실패 건은 상세 사유가 로그로 남으므로 즉시 수정이 가능합니다.'
        ]
      }
    },
    {
      id: 'cs',
      category: 'GENERAL',
      title: 'CS 관리 가이드',
      icon: MessageSquare,
      content: {
        purpose: '여러 마켓의 고객 문의를 한곳에서 통합 관리하고 답변합니다.',
        steps: [
          '실시간 문의 확인: 좌측 리스트에서 마켓별 신규 문의를 확인합니다.',
          '답변 템플릿 활용: 자주 오가는 질문은 미리 저장된 템플릿 버튼을 사용해 대폭 단축합니다.',
          '답변 전송: 입력창에 답변을 적고 전송하면 실제 마켓 고객센터로 동기화됩니다.'
        ],
        tips: [
          '템플릿 관리 팝업에서 업무 시간 안내, 교환 정책 등을 미리 등록해 두세요.',
          '긴급한 취소/교환 문의는 상단에 강조 표시되므로 우선 처리하시기 바랍니다.'
        ]
      }
    },
    {
      id: 'settings',
      category: 'GENERAL',
      title: '시스템 설정 가이드',
      icon: Settings,
      content: {
        purpose: '시스템 운영을 위한 API 연동 및 기본 정보를 관리합니다.',
        steps: [
          '마켓 연동 설정: 쿠팡 Wing, 스마트스토어 센터의 API Key를 정확히 입력합니다.',
          '배송사 설정: 주로 이용하는 기본 택배사 코드를 설정합니다.',
          '알림 설정: 신규 주문이나 긴급 CS 발생 시 알림 받을 채널을 선택합니다.'
        ],
        tips: [
          'API Key가 유효하지 않으면 데이터 수합이 되지 않으니 유효성을 주기적으로 확인하세요.',
          '관리자 계정은 보안을 위해 2단계 인증 사용을 권장합니다.'
        ]
      }
    },
    {
      id: 'coupang-api',
      category: 'API',
      title: '쿠팡 API 연동 가이드',
      icon: Zap,
      content: {
        purpose: '쿠팡 Wing의 주문 및 배송 정보를 실시간으로 연동하기 위한 API 설정 방법입니다.',
        steps: [
          '쿠팡 Wing 로그인: 쿠팡 판매자 센터(Wing)에 로그인합니다.',
          'API Key 발급: 상단 [판매자 정보] -> [추가판매 정보] 하단의 오픈 API 키 발급을 선택합니다.',
          '업체코드 확인: 발급 화면 상단에서 내 업체코드(A00xxxx)를 확인합니다.',
          'Key 저장: Access Key와 Secret Key를 복사하여 시스템 설정에 입력합니다.'
        ],
        tips: [
          'Key 발급 시 권한은 "주문/배송/상품" 모두 선택해야 완벽한 연동이 가능합니다.',
          'IP 제한 설정이 필요한 경우, 시스템 설정의 "서버 IP 주소"를 쿠팡 Wing에 등록하세요.'
        ]
      }
    },
    {
      id: 'smartstore-api',
      category: 'API',
      title: '네이버 스마트스토어 API 가이드',
      icon: ShieldCheck,
      content: {
        purpose: '네이버 스마트스토어의 주문 데이터를 안전하게 가져오기 위한 API 연동 프로세스입니다.',
        steps: [
          '스마트스토어 센터 접속: [노출 관리] -> [노출 서비스 설정] 메뉴로 이동합니다.',
          '커머스 API 설정: 하단의 [API 설정] 탭에서 [API 사용 설정]을 "사용함"으로 변경합니다.',
          '애플리케이션 등록: [애플리케이션 추가]를 눌러 "NexCommerce"용 API ID와 Secret을 생성합니다.',
          '연동 완료: 발급된 Application ID와 Secret Key를 본 시스템의 설정 메뉴에 등록합니다.'
        ],
        tips: [
          '스마트스토어 API는 보안상 Secret Key가 단 한 번만 노출되니 반드시 메모해 두세요.',
          '주문 수합이 안 될 경우, 판매자 등급이나 API 사용 권한이 일시 정지되지 않았는지 확인하세요.'
        ]
      }
    },
    {
      id: 'toss-api',
      category: 'API',
      title: '토스쇼핑 API 연동 가이드',
      icon: Key,
      content: {
        purpose: '토스쇼핑(토스플레이스)의 주문 정보를 실시간으로 수합하기 위한 전용 API 가이드입니다.',
        steps: [
          '토스 비즈니스 로그인: 토스플레이스 파트너 센터에 접속하여 로그인합니다.',
          '개발자 센터 이동: 설정 메뉴의 [개발자 도구] 또는 [API 연동] 탭을 클릭합니다.',
          '클라이언트 키 생성: [새 서비스 등록]을 통해 클라이언트 ID와 시크릿 키를 발급받습니다.',
          '정보 입력: 발급된 인증 정보와 업체 식별 정보를 NexCommerce 설정에 등록합니다.'
        ],
        tips: [
          '토스 API는 실시간 웹훅(Webhook) 설정을 지원하므로 주문 발생 즉시 알림이 가능합니다.',
          '테스트 결제 연동 시에는 실제 매출에 반영되지 않도록 주의하세요.'
        ]
      }
    }
  ];

  const current = guideSections.find(s => s.id === activeSection) || guideSections[0];

  return (
    <div className="flex gap-8 animate-in fade-in duration-500">
      {/* Sidebar Guide Nav */}
      <div className="w-72 flex-shrink-0 space-y-8">
        <div>
          <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 px-4 flex items-center justify-between">
            기본 운영 가이드
            <CheckCircle2 className="w-3 h-3" />
          </h2>
          <div className="space-y-1">
            {guideSections.filter(s => s.category === 'GENERAL').map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all
                    ${activeSection === section.id 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'text-gray-400 hover:bg-[#1C1C1E] hover:text-white'}
                  `}
                >
                  <Icon className={`w-4 h-4 ${activeSection === section.id ? 'text-white' : 'text-gray-500'}`} />
                  {section.title.split(' ')[0]} 가이드
                </button>
              );
            })}
            
            <button
              onClick={() => setActiveSection('coupang-api')}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-bold transition-all
                ${activeSection.includes('-api') 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-gray-400 hover:bg-[#1C1C1E] hover:text-white'}
              `}
            >
              <Key className={`w-4 h-4 ${activeSection.includes('-api') ? 'text-white' : 'text-gray-500'}`} />
              API 연동 가이드
            </button>
          </div>
        </div>
      </div>

      {/* Main Guide Content */}
      <div className="flex-1 space-y-8">
        <header className="bg-[#1C1C1E] rounded-3xl p-10 border border-gray-800 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <current.icon className="w-48 h-48" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600/10 rounded-2xl">
                  <current.icon className="w-8 h-8 text-blue-500" />
                </div>
                <h1 className="text-3xl font-black text-white">{current.title}</h1>
              </div>

              {/* API Market Tabs */}
              {current.category === 'API' && (
                <div className="flex bg-[#2C2C2E] p-1.5 rounded-2xl border border-gray-800">
                  {guideSections.filter(s => s.category === 'API').map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSection(s.id)}
                      className={`
                        px-6 py-2.5 rounded-xl text-[13px] font-bold transition-all
                        ${activeSection === s.id 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 scale-105' 
                          : 'text-gray-400 hover:text-white'}
                      `}
                    >
                      {s.title.replace(' API', '').split(' ')[0]} 연동
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xl text-gray-400 leading-relaxed font-medium max-w-2xl italic border-l-4 border-blue-600/30 pl-6 py-2">
              "{current.content.purpose}"
            </p>
          </div>
        </header>

        <div className="grid grid-cols-2 gap-8">
          {/* Step by Step */}
          <section className="bg-[#1C1C1E] rounded-3xl p-10 border border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold text-white">표준 운영 프로세스</h2>
            </div>
            <div className="space-y-6">
              {current.content.steps.map((step, i) => (
                <div key={i} className="flex gap-4 group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2C2C2E] text-gray-400 flex items-center justify-center text-sm font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {i + 1}
                  </span>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-200 font-bold leading-relaxed">{step}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Expert Tips */}
          <section className="bg-[#1C1C1E] rounded-3xl p-10 border border-gray-800 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <Lightbulb className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold text-white">전문가 운영 팁</h2>
            </div>
            <div className="space-y-6">
              {current.content.tips.map((tip, i) => (
                <div key={i} className="bg-[#2C2C2E] p-6 rounded-2xl border border-gray-800 hover:border-orange-500/20 transition-all">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded">PRO TIP</span>
                  </div>
                  <p className="text-gray-300 font-medium leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer Banner */}
        <footer className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 flex items-center justify-between shadow-xl shadow-blue-600/10">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">문의가 더 필요하신가요?</h3>
            <p className="text-blue-100/70 text-sm font-medium">관리자 1:1 채팅 혹은 고객센터를 이용해 주세요.</p>
          </div>
          <button className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wide hover:bg-blue-50 transition-all">
            고객센터 바로가기
            <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      </div>
    </div>
  );
}
