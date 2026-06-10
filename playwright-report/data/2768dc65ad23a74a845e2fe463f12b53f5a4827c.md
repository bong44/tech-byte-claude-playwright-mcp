# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login.spec.js >> 로그인 화면 >> TC-LOGIN-003 | 아이디만 입력 후 제출 시 비밀번호 오류
- Location: tests\login.spec.js:34:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=비밀번호를 입력하세요')
Expected: visible
Error: strict mode violation: locator('text=비밀번호를 입력하세요') resolved to 2 elements:
    1) <p data-v-45f5edd7="">아이디와 비밀번호를 입력하세요</p> aka getByText('아이디와 비밀번호를 입력하세요')
    2) <span data-v-45f5edd7="" class="field-error">비밀번호를 입력하세요.</span> aka getByTestId('login-form').getByText('비밀번호를 입력하세요')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=비밀번호를 입력하세요')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e5]:
    - generic [ref=e6]:
      - generic [ref=e7]:
        - img [ref=e8]
        - generic [ref=e12]: TechByte
      - paragraph [ref=e13]: 대학 학사 행정 시스템
    - generic [ref=e14]:
      - generic [ref=e15]:
        - generic [ref=e16]: 📋
        - generic [ref=e17]: 공통코드 관리
      - generic [ref=e18]:
        - generic [ref=e19]: 👥
        - generic [ref=e20]: 사용자 관리
      - generic [ref=e21]:
        - generic [ref=e22]: 🏫
        - generic [ref=e23]: 학사 관리
    - paragraph [ref=e24]:
      - text: 안전하고 효율적인 학사 행정을 위한
      - text: 통합 관리 플랫폼입니다.
  - generic [ref=e26]:
    - generic [ref=e27]:
      - heading "로그인" [level=1] [ref=e28]
      - paragraph [ref=e29]: 아이디와 비밀번호를 입력하세요
    - generic [ref=e30]:
      - generic [ref=e31]:
        - generic [ref=e32]: 아이디
        - generic [ref=e33]:
          - img [ref=e35]
          - textbox "아이디" [ref=e37]:
            - /placeholder: 아이디를 입력하세요
            - text: admin
      - generic [ref=e38]:
        - generic [ref=e39]: 비밀번호
        - generic [ref=e40]:
          - img [ref=e42]
          - textbox "비밀번호" [ref=e44]:
            - /placeholder: 비밀번호를 입력하세요
          - button "👁️" [ref=e45] [cursor=pointer]
        - generic [ref=e46]: 비밀번호를 입력하세요.
      - generic [ref=e48] [cursor=pointer]:
        - checkbox "아이디 저장" [ref=e49]
        - generic [ref=e50]: 아이디 저장
      - button "로그인" [active] [ref=e51] [cursor=pointer]:
        - generic [ref=e52]: 로그인
    - generic [ref=e53]:
      - paragraph [ref=e54]: 테스트 계정 안내
      - generic [ref=e55]:
        - generic [ref=e56] [cursor=pointer]:
          - generic [ref=e57]: ADMIN
          - generic [ref=e58]: admin
          - generic [ref=e59]: / admin123
        - generic [ref=e60] [cursor=pointer]:
          - generic [ref=e61]: USER
          - generic [ref=e62]: user01
          - generic [ref=e63]: / user1234
        - generic [ref=e64] [cursor=pointer]:
          - generic [ref=e65]: USER
          - generic [ref=e66]: test
          - generic [ref=e67]: / test1234
```

# Test source

```ts
  1   | /**
  2   |  * 로그인 화면 (자체로그인) Playwright 시나리오
  3   |  * 메뉴: 로그인
  4   |  */
  5   | import { test, expect } from '@playwright/test'
  6   | 
  7   | test.describe('로그인 화면', () => {
  8   | 
  9   |   test.beforeEach(async ({ page }) => {
  10  |     // sessionStorage 초기화
  11  |     await page.goto('/login')
  12  |   })
  13  | 
  14  |   // ──────────────────────────────────────────
  15  |   // TC-LOGIN-001: 로그인 페이지 기본 렌더링
  16  |   // ──────────────────────────────────────────
  17  |   test('TC-LOGIN-001 | 로그인 페이지 기본 렌더링', async ({ page }) => {
  18  |     await expect(page).toHaveTitle(/TechByte/)
  19  |     await expect(page.getByTestId('login-form')).toBeVisible()
  20  |     await expect(page.getByTestId('input-login-id')).toBeVisible()
  21  |     await expect(page.getByTestId('input-login-pw')).toBeVisible()
  22  |     await expect(page.getByTestId('btn-login')).toBeVisible()
  23  |     await expect(page.getByTestId('btn-login')).toContainText('로그인')
  24  |   })
  25  | 
  26  |   // ──────────────────────────────────────────
  27  |   // TC-LOGIN-002: 빈 값 제출 시 유효성 검사
  28  |   // ──────────────────────────────────────────
  29  |   test('TC-LOGIN-002 | 빈 아이디/비밀번호 제출 시 오류 메시지', async ({ page }) => {
  30  |     await page.getByTestId('btn-login').click()
  31  |     await expect(page.locator('text=아이디를 입력하세요')).toBeVisible()
  32  |   })
  33  | 
  34  |   test('TC-LOGIN-003 | 아이디만 입력 후 제출 시 비밀번호 오류', async ({ page }) => {
  35  |     await page.getByTestId('input-login-id').fill('admin')
  36  |     await page.getByTestId('btn-login').click()
> 37  |     await expect(page.locator('text=비밀번호를 입력하세요')).toBeVisible()
      |                                                    ^ Error: expect(locator).toBeVisible() failed
  38  |   })
  39  | 
  40  |   // ──────────────────────────────────────────
  41  |   // TC-LOGIN-004: 잘못된 자격증명
  42  |   // ──────────────────────────────────────────
  43  |   test('TC-LOGIN-004 | 잘못된 아이디/비밀번호로 로그인 실패', async ({ page }) => {
  44  |     await page.getByTestId('input-login-id').fill('wronguser')
  45  |     await page.getByTestId('input-login-pw').fill('wrongpw')
  46  |     await page.getByTestId('btn-login').click()
  47  |     await expect(page.getByTestId('login-error')).toBeVisible()
  48  |     await expect(page.getByTestId('login-error')).toContainText('일치하지 않습니다')
  49  |   })
  50  | 
  51  |   // ──────────────────────────────────────────
  52  |   // TC-LOGIN-005: 관리자 로그인 성공
  53  |   // ──────────────────────────────────────────
  54  |   test('TC-LOGIN-005 | admin 계정으로 로그인 성공 후 메인 화면 이동', async ({ page }) => {
  55  |     await page.getByTestId('input-login-id').fill('admin')
  56  |     await page.getByTestId('input-login-pw').fill('admin123')
  57  |     await page.getByTestId('btn-login').click()
  58  | 
  59  |     // 로그인 버튼 로딩 스피너 확인
  60  |     // await expect(page.getByTestId('btn-login')).toContainText('') // spinner
  61  | 
  62  |     // 메인 화면 이동
  63  |     await page.waitForURL(/\/sscm0100/)
  64  |     await expect(page.getByTestId('app-header')).toBeVisible()
  65  |     await expect(page.getByTestId('app-sidebar')).toBeVisible()
  66  |     // 환영 토스트
  67  |     await expect(page.locator('.toast')).toContainText('환영합니다')
  68  |   })
  69  | 
  70  |   // ──────────────────────────────────────────
  71  |   // TC-LOGIN-006: 힌트 계정 클릭 자동완성
  72  |   // ──────────────────────────────────────────
  73  |   test('TC-LOGIN-006 | 힌트 계정 클릭 시 아이디/비밀번호 자동 입력', async ({ page }) => {
  74  |     // 힌트 영역의 첫 번째 계정 클릭
  75  |     await page.locator('.hint-row').first().click()
  76  |     const idVal = await page.getByTestId('input-login-id').inputValue()
  77  |     const pwVal = await page.getByTestId('input-login-pw').inputValue()
  78  |     expect(idVal).toBeTruthy()
  79  |     expect(pwVal).toBeTruthy()
  80  |   })
  81  | 
  82  |   // ──────────────────────────────────────────
  83  |   // TC-LOGIN-007: 비밀번호 표시/숨기기
  84  |   // ──────────────────────────────────────────
  85  |   test('TC-LOGIN-007 | 비밀번호 표시/숨기기 토글', async ({ page }) => {
  86  |     const pwInput = page.getByTestId('input-login-pw')
  87  |     await pwInput.fill('admin123')
  88  |     // 기본: password
  89  |     await expect(pwInput).toHaveAttribute('type', 'password')
  90  |     // 눈 아이콘 클릭
  91  |     await page.locator('.pw-toggle').click()
  92  |     await expect(pwInput).toHaveAttribute('type', 'text')
  93  |     // 다시 클릭
  94  |     await page.locator('.pw-toggle').click()
  95  |     await expect(pwInput).toHaveAttribute('type', 'password')
  96  |   })
  97  | 
  98  |   // ──────────────────────────────────────────
  99  |   // TC-LOGIN-008: 이미 로그인된 상태에서 /login 접근 시 리다이렉트
  100 |   // ──────────────────────────────────────────
  101 |   test('TC-LOGIN-008 | 로그인 상태에서 /login 재접근 시 홈으로 이동', async ({ page }) => {
  102 |     // 먼저 로그인
  103 |     await page.getByTestId('input-login-id').fill('admin')
  104 |     await page.getByTestId('input-login-pw').fill('admin123')
  105 |     await page.getByTestId('btn-login').click()
  106 |     await page.waitForURL(/\/sscm0100/)
  107 | 
  108 |     // /login 재접근
  109 |     await page.goto('/login')
  110 |     await expect(page).not.toHaveURL('/login')
  111 |   })
  112 | 
  113 |   // ──────────────────────────────────────────
  114 |   // TC-LOGIN-009: Enter 키로 로그인
  115 |   // ──────────────────────────────────────────
  116 |   test('TC-LOGIN-009 | 비밀번호 입력 후 Enter 키로 로그인', async ({ page }) => {
  117 |     await page.getByTestId('input-login-id').fill('test')
  118 |     await page.getByTestId('input-login-pw').fill('test1234')
  119 |     await page.getByTestId('input-login-pw').press('Enter')
  120 |     await page.waitForURL(/\/(sscm0100)?$/)
  121 |     await expect(page.getByTestId('app-header')).toBeVisible()
  122 |   })
  123 | })
  124 | 
```