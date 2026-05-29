/**
 * 로그인 화면 (자체로그인) Playwright 시나리오
 * 메뉴: 로그인
 */
import { test, expect } from '@playwright/test'

test.describe('로그인 화면', () => {

  test.beforeEach(async ({ page }) => {
    // sessionStorage 초기화
    await page.goto('/login')
  })

  // ──────────────────────────────────────────
  // TC-LOGIN-001: 로그인 페이지 기본 렌더링
  // ──────────────────────────────────────────
  test('TC-LOGIN-001 | 로그인 페이지 기본 렌더링', async ({ page }) => {
    await expect(page).toHaveTitle(/TechByte/)
    await expect(page.getByTestId('login-form')).toBeVisible()
    await expect(page.getByTestId('input-login-id')).toBeVisible()
    await expect(page.getByTestId('input-login-pw')).toBeVisible()
    await expect(page.getByTestId('btn-login')).toBeVisible()
    await expect(page.getByTestId('btn-login')).toContainText('로그인')
  })

  // ──────────────────────────────────────────
  // TC-LOGIN-002: 빈 값 제출 시 유효성 검사
  // ──────────────────────────────────────────
  test('TC-LOGIN-002 | 빈 아이디/비밀번호 제출 시 오류 메시지', async ({ page }) => {
    await page.getByTestId('btn-login').click()
    await expect(page.locator('text=아이디를 입력하세요')).toBeVisible()
  })

  test('TC-LOGIN-003 | 아이디만 입력 후 제출 시 비밀번호 오류', async ({ page }) => {
    await page.getByTestId('input-login-id').fill('admin')
    await page.getByTestId('btn-login').click()
    await expect(page.locator('text=비밀번호를 입력하세요')).toBeVisible()
  })

  // ──────────────────────────────────────────
  // TC-LOGIN-004: 잘못된 자격증명
  // ──────────────────────────────────────────
  test('TC-LOGIN-004 | 잘못된 아이디/비밀번호로 로그인 실패', async ({ page }) => {
    await page.getByTestId('input-login-id').fill('wronguser')
    await page.getByTestId('input-login-pw').fill('wrongpw')
    await page.getByTestId('btn-login').click()
    await expect(page.getByTestId('login-error')).toBeVisible()
    await expect(page.getByTestId('login-error')).toContainText('일치하지 않습니다')
  })

  // ──────────────────────────────────────────
  // TC-LOGIN-005: 관리자 로그인 성공
  // ──────────────────────────────────────────
  test('TC-LOGIN-005 | admin 계정으로 로그인 성공 후 메인 화면 이동', async ({ page }) => {
    await page.getByTestId('input-login-id').fill('admin')
    await page.getByTestId('input-login-pw').fill('admin123')
    await page.getByTestId('btn-login').click()

    // 로그인 버튼 로딩 스피너 확인
    // await expect(page.getByTestId('btn-login')).toContainText('') // spinner

    // 메인 화면 이동
    await page.waitForURL(/\/sscm0100/)
    await expect(page.getByTestId('app-header')).toBeVisible()
    await expect(page.getByTestId('app-sidebar')).toBeVisible()
    // 환영 토스트
    await expect(page.locator('.toast')).toContainText('환영합니다')
  })

  // ──────────────────────────────────────────
  // TC-LOGIN-006: 힌트 계정 클릭 자동완성
  // ──────────────────────────────────────────
  test('TC-LOGIN-006 | 힌트 계정 클릭 시 아이디/비밀번호 자동 입력', async ({ page }) => {
    // 힌트 영역의 첫 번째 계정 클릭
    await page.locator('.hint-row').first().click()
    const idVal = await page.getByTestId('input-login-id').inputValue()
    const pwVal = await page.getByTestId('input-login-pw').inputValue()
    expect(idVal).toBeTruthy()
    expect(pwVal).toBeTruthy()
  })

  // ──────────────────────────────────────────
  // TC-LOGIN-007: 비밀번호 표시/숨기기
  // ──────────────────────────────────────────
  test('TC-LOGIN-007 | 비밀번호 표시/숨기기 토글', async ({ page }) => {
    const pwInput = page.getByTestId('input-login-pw')
    await pwInput.fill('admin123')
    // 기본: password
    await expect(pwInput).toHaveAttribute('type', 'password')
    // 눈 아이콘 클릭
    await page.locator('.pw-toggle').click()
    await expect(pwInput).toHaveAttribute('type', 'text')
    // 다시 클릭
    await page.locator('.pw-toggle').click()
    await expect(pwInput).toHaveAttribute('type', 'password')
  })

  // ──────────────────────────────────────────
  // TC-LOGIN-008: 이미 로그인된 상태에서 /login 접근 시 리다이렉트
  // ──────────────────────────────────────────
  test('TC-LOGIN-008 | 로그인 상태에서 /login 재접근 시 홈으로 이동', async ({ page }) => {
    // 먼저 로그인
    await page.getByTestId('input-login-id').fill('admin')
    await page.getByTestId('input-login-pw').fill('admin123')
    await page.getByTestId('btn-login').click()
    await page.waitForURL(/\/sscm0100/)

    // /login 재접근
    await page.goto('/login')
    await expect(page).not.toHaveURL('/login')
  })

  // ──────────────────────────────────────────
  // TC-LOGIN-009: Enter 키로 로그인
  // ──────────────────────────────────────────
  test('TC-LOGIN-009 | 비밀번호 입력 후 Enter 키로 로그인', async ({ page }) => {
    await page.getByTestId('input-login-id').fill('test')
    await page.getByTestId('input-login-pw').fill('test1234')
    await page.getByTestId('input-login-pw').press('Enter')
    await page.waitForURL(/\/(sscm0100)?$/)
    await expect(page.getByTestId('app-header')).toBeVisible()
  })
})
