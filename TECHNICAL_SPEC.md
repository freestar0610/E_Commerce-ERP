# NexCommerce ERP/OMS 시스템 상세 설계서 (Technical Specification)

## 1. 시스템 개요 (System Overview)
NexCommerce ERP는 쿠팡(Coupang Wing)과 스마트스토어(Smart Store)의 분산된 주문 데이터를 실시간으로 통합하고, 도매처(공급사)별 최적화된 발주 프로세스를 자동화하여 운영 효율을 극대화하는 **통합 이커머스 운영 플랫폼**입니다.

### 핵심 목표
- **운영 자동화**: 주문수합 및 발주서 생성 시간 90% 단축
- **정확성 향상**: 상품 매핑(Mapping)을 통한 발주 실수 방지
- **통합 관리**: 채널별 CS 및 송장 처리를 단일 화면에서 수행

---

## 2. 데이터베이스 스키마 (DB Schema)
ERD 설계를 기반으로 한 주요 테이블 구조입니다. (PostgreSQL 기준)

### 2.1. `accounts` (마켓 계정 정보)
- `id`: UUID (PK)
- `market_type`: ENUM ('COUPANG', 'SS')
- `access_key`: TEXT
- `secret_key`: TEXT
- `status`: ENUM ('CONNECTED', 'DISCONNECTED')

### 2.2. `products` (기준 상품 및 매핑)
- `id`: UUID (PK)
- `internal_code`: VARCHAR(50) (Unique) - 내부 관리 코드
- `market_sku`: VARCHAR(100) - 마켓별 판매자 SKU
- `supplier_id`: UUID (FK)
- `cost_price`: DECIMAL(12, 2)
- `mapping_data`: JSONB - 마켓별 상품번호/옵션번호 일치 정보

### 2.3. `orders` (통합 주문 내역)
- `id`: UUID (PK)
- `order_no`: VARCHAR(100) (Market Original No)
- `buyer_info`: JSONB (명/연락처/주소)
- `status`: ENUM ('COLLECTED', 'ORDERED', 'SHIPPING', 'COMPLETED')
- `internal_product_id`: UUID (FK)
- `supplier_id`: UUID (FK)
- `invoice_no`: VARCHAR(50)

---

## 3. API 연동 전략 (API Integration Strategy)

### 3.1. 마켓 주문 수합 (Order Inbound)
- **쿠팡 Wing API**: `GET /v2/providers/openapi/apis/api/v4/vendors/{vendorId}/ordersheets` 호출을 통해 결제 완료 상태의 주문을 Fetch.
- **스마트스토어 API**: Commerce API를 사용하여 `SearchOrder` 요청.
- **Data Normalization**: 수집된 다양한 포맷의 주문 데이터를 내부 `orders` 테이블 스키마로 정규화하여 저장.

### 3.2. 상품 매핑 로직 (Mapping Engine)
- 주문 데이터의 `Market SKU`와 `Option ID`를 기반으로 `products` 테이블의 `internal_code`를 탐색.
- 매핑되지 않은 신규 상품 발생 시 '매핑 대기' 상태로 분류 후 관리자 알림 송출.

### 3.3. 송장 역전송 (Inbound Tracking)
- 도매처로부터 수신된 송장 번호(Excel/API)를 각 마켓 API의 `Ship` 엔드포인트에 일괄 Patch 처리.

---

## 4. UI 컴포넌트 구조 (Frontend Architecture)

### 4.1. Layout System
- `Sidebar`: LNB (대시보드, 주문, 상품, 도매처 등)
- `GlobalHeader`: 실시간 마켓 연동 상태 및 알림 센터
- `MainCanvas`: 뷰별 데이터 그리드 및 대시보드 위젯

### 4.2. 핵심 UI 모듈
- **Workflow Stepper**: 주문 수집 단계부터 송장 전송까지의 실시간 프로세스 시각화.
- **Technical Grid**: 수만 건의 주문 내역을 고성능으로 렌더링하기 위한 가상 스크롤(Virtual scroll) 지원 헤비 그리드.
- **CS Helper**: 마켓 API를 통해 수합된 Q&A를 채팅 UI 형태로 변환하여 일괄 답변 기능 제공.

---

## 5. 자동화 및 안정성 (Automation & Reliability)
- **Scheduler**: Redis/BullMQ 기반의 분산 스케줄러를 사용하여 5분 간격 주문 수합 및 1시간 간격 CS 체크.
- **Error Handling**: 마켓 API Rate Limit 발생 시 지수 백오프(Exponential Backoff) 전략 적용.
- **Security**: 모든 마켓 API Key는 AWS KMS(Key Management Service)로 암호화하여 DB 저장.
