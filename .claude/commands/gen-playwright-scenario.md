---
description: 메뉴(화면) ID를 입력받아 Playwright E2E 테스트 시나리오를 자동 생성합니다. 예시: /gen-playwright-scenario sscm0100
argument-hint: <화면ID> [--menu "메뉴명"] [--route /경로]
---

# Playwright 시나리오 자동 생성

## 실행 방법
```
/gen-playwright-scenario <화면ID>
/gen-playwright-scenario <화면ID> --menu "메뉴명" --route "/경로"
```

## 처리 절차

주어진 화면ID (`$ARGUMENTS`)를 기반으로 아래 단계를 수행하세요:

### 1단계: 뷰 파일 탐색
`src/views/` 디렉터리에서 화면ID에 해당하는 `.vue` 파일을 찾습니다.
파일명 패턴: `{화면ID}View.vue` (대소문자 변환 포함)

### 2단계: data-testid 추출
찾은 `.vue` 파일에서 `data-testid` 속성을 모두 추출합니다.
추출한 testid 목록을 기반으로 selector를 구성합니다.

### 3단계: 시나리오 설계
추출된 testid와 화면 기능을 분석하여 다음 카테고리의 TC를 설계합니다:

| 카테고리 | TC 수 |
|----------|-------|
| 렌더링 확인 | 1~2개 |
| 조회 기능 | 2~4개 (기본조회, 조건필터, Enter키) |
| CRUD 기능 | 3~6개 (추가, 저장성공, 저장실패, 삭제확인) |
| 예외 처리 | 1~2개 (빈결과, 미선택 삭제 등) |
| 인증/권한 | 1개 (비로그인 접근) |

### 4단계: 파일 생성

출력 파일: `tests/{화면ID}.spec.js`

파일 구조:
```javascript
/**
 * {메뉴명} ({화면ID}) Playwright 시나리오
 * 생성일: {오늘날짜}
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth.js'

test.describe('{메뉴명}', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('{라우트}')
    await page.waitForSelector('[data-testid="page-{화면ID}"]')
  })

  // 설계된 TC들 생성...
})
```

### 5단계: 완료 안내

생성된 파일 경로와 TC 목록을 정리하여 표시하고,
아래 실행 명령어를 안내합니다:

```bash
# 해당 화면만 실행
npx playwright test tests/{화면ID}.spec.js --headed

# UI 모드로 실행 (시각적 디버깅)
npx playwright test --ui

# 전체 리포트 확인
npx playwright show-report
```

## 주의사항
- `tests/{화면ID}.spec.js` 파일이 이미 존재하면 덮어쓰기 전에 확인합니다
- `tests/helpers/auth.js`가 없으면 함께 생성합니다
- TC 넘버링: `TC-{화면ID_대문자}-{001~}`
- selector 우선순위: `data-testid` > `text` > CSS selector
