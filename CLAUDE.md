# tech-byte-playwright

Vue 3 + Playwright E2E 테스트 데모 프로젝트

## 프로젝트 구조

```
tech-byte-playwright/
├── src/
│   ├── assets/main.css       # 전역 CSS (디자인 시스템)
│   ├── layouts/
│   │   └── MainLayout.vue    # 헤더 + 사이드바 레이아웃
│   ├── views/
│   │   ├── LoginView.vue     # 자체 로그인 화면
│   │   └── Sscm0100View.vue  # 공통코드 관리 (좌우 그리드)
│   ├── stores/
│   │   ├── auth.js           # 인증 상태 (Pinia)
│   │   └── toast.js          # Toast 알림 (Pinia)
│   ├── services/
│   │   └── mockApi.js        # Mock API (인메모리 데이터)
│   └── router/index.js       # Vue Router (인증 가드 포함)
├── tests/
│   ├── helpers/auth.js       # 로그인 헬퍼
│   ├── login.spec.js         # 로그인 화면 시나리오 (TC-LOGIN-001~009)
│   └── sscm0100.spec.js      # 공통코드 관리 시나리오 (TC-SSCM0100-001~015)
├── .claude/
│   ├── mcp.json              # Playwright MCP 설정
│   ├── commands/
│   │   └── gen-playwright-scenario.md  # /gen-playwright-scenario 커맨드
│   └── skills/
│       └── gen-playwright-scenario.md  # 스킬 상세 가이드
├── playwright.config.js      # Playwright 설정 (webServer 자동시작)
└── vite.config.js
```

## 개발 서버 실행

```bash
npm run dev
# http://localhost:5173
```

## 테스트 계정

| ID | 비밀번호 | 역할 |
|---|---|---|
| admin | admin123 | 관리자 |
| user01 | user1234 | 사용자 |
| test | test1234 | 사용자 |

## Playwright 테스트 실행

```bash
# 전체 테스트 (webServer 자동 시작)
npm test

# 헤드 모드 (브라우저 표시)
npm run test:headed

# UI 모드 (시각적 디버깅)
npm run test:ui

# 특정 화면만
npm run test:login
npm run test:sscm0100

# 리포트 확인
npm run test:report
```

## 새 화면 시나리오 생성 (Claude Code)

```bash
/gen-playwright-scenario <화면ID>
# 예: /gen-playwright-scenario sscm0200
```

## 커스텀 슬래시 커맨드

| 커맨드 | 설명 |
|--------|------|
| `/gen-playwright-scenario <화면ID>` | 화면 소스를 분석하여 Playwright 시나리오 자동 생성 |

## data-testid 작성 규칙

| 패턴 | 예시 |
|------|------|
| `page-{화면ID}` | `page-sscm0100` |
| `search-area` | 조회 영역 래퍼 |
| `btn-{동작}` | `btn-search`, `btn-add-010`, `btn-save-011` |
| `grid-{ID}-wrap` | `grid-csys010-wrap` |
| `row-{그리드}-{인덱스}` | `row-010-0` |
| `cell-{그리드}-{컬럼}-{인덱스}` | `cell-010-cmmnCd-0` |
| `input-{필드}` | `input-login-id` |
| `sel-{필드}` | `sel-use-yn` |
| `chk-{그리드}-{인덱스}` | `chk-010-0` |
| `modal-confirm` | 확인 다이얼로그 |
| `btn-confirm-ok` / `btn-confirm-cancel` | 다이얼로그 버튼 |
