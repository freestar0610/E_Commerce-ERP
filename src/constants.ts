import { 
  LayoutDashboard, 
  HelpCircle, 
  ShoppingCart, 
  Link, 
  Truck, 
  FileText, 
  MessageSquare, 
  Settings,
  ArrowRight
} from 'lucide-react';

export const SIDEBAR_ITEMS = [
  { id: 'dashboard', label: '대시보드', icon: LayoutDashboard },
  { id: 'guide', label: '이용가이드', icon: HelpCircle },
  { id: 'orders', label: '주문내역', icon: ShoppingCart },
  { id: 'mapping', label: '상품매핑', icon: Link },
  { id: 'suppliers', label: '도매처관리', icon: FileText },
  { id: 'invoice', label: '송장관리', icon: Truck },
  { id: 'cs', label: 'CS관리', icon: MessageSquare },
  { id: 'settings', label: '설정', icon: Settings },
];

export const ADMIN_ITEMS = [
  { id: 'admin', label: '관리자', icon: Settings },
];

export const WORKFLOW_STEPS = [
  { id: 1, label: '주문수합', description: '쿠팡/스토어 주문 가져오기' },
  { id: 2, label: '발주 엑셀 생성', description: '도매처별 발주 양식 생성' },
  { id: 3, label: '도매처 발주', description: '공급사 주문 전달 완료' },
  { id: 4, label: '송장 등록', description: '마켓 송장 번호 일괄 업로드' },
];

export const MARKET_TYPES = {
  COUPANG: { label: '쿠팡', color: 'bg-red-500' },
  SMART_STORE: { label: '스마트스토어', color: 'bg-green-600' },
};
