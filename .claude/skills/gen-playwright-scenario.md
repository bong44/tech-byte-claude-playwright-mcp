---
name: gen-playwright-scenario
description: 메뉴(화면) 정보를 입력받아 Playwright E2E 테스트 시나리오 파일을 자동 생성합니다.
---

# gen-playwright-scenario Skill

사용자가 **메뉴 이름**과 **화면 정보(라우트, 주요 기능, data-testid 목록 등)** 를 제공하면,
표준 포맷의 Playwright `.spec.js` 테스트 파일을 `tests/` 디렉터리에 생성합니다.

## 트리거 예시
- `/gen-playwright-scenario`
- `공통코드 관리 화면에 대한 playwright 시나리오 만들어줘`
- `로그인 화면 테스트 시나리오 생성`

## 실행 절차

### 1. 화면 정보 수집
다음 정보를 수집합니다 (사용자가 제공하거나 소스 파일에서 직접 파악):
- **메뉴 이름** (예: `공통코드 관리`)
- **화면 ID** (예: `sscm0100`)
- **라우트** (예: `/sscm0100`)
- **뷰 파일** (예: `src/views/Sscm0100View.vue`)
- **주요 기능 목록** (조회/추가/삭제/저장/엑셀 등)
- **`data-testid` 속성 목록** (소스에서 grep)

### 2. 소스 분석
```bash
# data-testid 목록 추출
grep -n 'data-testid' src/views/<ViewFile>.vue
```
추출된 testid를 기반으로 시나리오의 selector를 결정합니다.

### 3. 시나리오 파일 생성 규칙

#### 파일명
```
tests/<화면ID>.spec.js
```
이미 존재하는 경우, 사용자에게 덮어쓸지 확인합니다.

#### TC 넘버링 체계
```
TC-{화면ID_대문자}-{순번3자리}
예: TC-SSCM0100-001, TC-LOGIN-001
```

#### 필수 포함 시나리오 카테고리
| 카테고리 | 내용 |
|----------|------|
| 렌더링   | 화면 진입 시 주요 컴포넌트 표시 여부 |
| 조회     | 기본 조회, 조건 필터, 엔터키 조회 |
| 유효성   | 필수값 미입력 시 오류 메시지 |
| CRUD     | 추가/수정/저장 성공, 삭제 확인 다이얼로그 |
| 예외     | 빈 결과, 중복, 서버 오류 시뮬레이션 |
| 인증     | 비로그인 상태 접근 시 로그인 리다이렉트 |

#### 파일 템플릿
```javascript
/**
 * {메뉴명} ({화면ID}) Playwright 시나리오
 * 메뉴: {메뉴경로}
 * 생성일: {YYYY-MM-DD}
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth.js'

test.describe('{메뉴명} ({화면ID})', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('{라우트}')
    await page.waitForSelector('[data-testid="page-{화면ID}"]')
  })

  // TC-{ID}-001: 화면 기본 렌더링
  test('TC-{ID}-001 | {메뉴명} 화면 기본 렌더링', async ({ page }) => {
    // 주요 영역 표시 확인
    await expect(page.getByTestId('search-area')).toBeVisible()
    // ...
  })

  // TC-{ID}-002: 조회
  test('TC-{ID}-002 | 기본 조회', async ({ page }) => {
    await page.getByTestId('btn-search').click()
    await page.waitForSelector('[data-testid="row-0"]')
    // ...
  })

  // 추가 시나리오...
})
```

### 4. helpers/auth.js 확인
`tests/helpers/auth.js` 파일이 없으면 함께 생성합니다.

### 5. 생성 후 안내
생성된 파일 경로와 포함된 TC 목록을 사용자에게 표시하고,
실행 명령어를 안내합니다:
```bash
# 특정 화면만 실행
npx playwright test tests/{화면ID}.spec.js

# UI 모드로 실행
npx playwright test --ui

# 전체 실행
npx playwright test
```

## 생성 품질 기준
- 모든 TC에는 한국어 설명 포함
- `data-testid` selector 우선 사용 (`page.getByTestId(...)`)
- 비동기 대기는 `waitForSelector` / `waitForURL` 사용 (고정 sleep 지양)
- 각 TC는 독립적으로 실행 가능 (beforeEach로 상태 초기화)
- 실패 시 명확한 assertion 메시지 제공
