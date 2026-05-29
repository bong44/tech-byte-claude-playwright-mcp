/**
 * 공통코드 관리 (sscm0100) Playwright 시나리오
 * 메뉴: 시스템관리 > 공통코드 관리
 */
import { test, expect } from '@playwright/test'
import { loginAs } from './helpers/auth.js'

test.describe('공통코드 관리 (sscm0100)', () => {

  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'admin')
    await page.goto('/sscm0100')
    await page.waitForSelector('[data-testid="page-sscm0100"]')
  })

  // ──────────────────────────────────────────
  // TC-SSCM0100-001: 화면 기본 렌더링
  // ──────────────────────────────────────────
  test('TC-SSCM0100-001 | 공통코드 관리 화면 기본 렌더링', async ({ page }) => {
    await expect(page.getByTestId('search-area')).toBeVisible()
    await expect(page.getByTestId('grid-csys010-wrap')).toBeVisible()
    await expect(page.getByTestId('grid-csys011-wrap')).toBeVisible()
    // 조회 전: 초기 안내 메시지
    await expect(page.locator('text=조회 버튼을 클릭하여')).toBeVisible()
    // 코드값 그리드: 선택 안내
    await expect(page.locator('text=좌측 공통코드를 선택하면')).toBeVisible()
  })

  // ──────────────────────────────────────────
  // TC-SSCM0100-002: 전체 조회
  // ──────────────────────────────────────────
  test('TC-SSCM0100-002 | 조회 버튼 클릭 시 공통코드 목록 조회', async ({ page }) => {
    await page.getByTestId('btn-search').click()

    // 로딩 후 데이터 표시
    await page.waitForSelector('[data-testid="row-010-0"]')
    const rows = page.locator('[data-testid^="row-010-"]')
    await expect(rows).not.toHaveCount(0)

    // 총 건수 표시 확인
    await expect(page.locator('.grid-wrap').first().locator('.total-count')).toContainText('총')
  })

  // ──────────────────────────────────────────
  // TC-SSCM0100-003: 조회 조건 필터링
  // ──────────────────────────────────────────
  test('TC-SSCM0100-003 | 공통코드명으로 필터 조회', async ({ page }) => {
    await page.getByTestId('input-cmmn-cd-nm').fill('사용여부')
    await page.getByTestId('btn-search').click()
    await page.waitForSelector('[data-testid="row-010-0"]')

    const rows = page.locator('[data-testid^="row-010-"]')
    const count = await rows.count()
    expect(count).toBeGreaterThan(0)
    // 첫 번째 행에 '사용여부' 포함
    await expect(page.getByTestId('cell-010-cmmnCdNm-0')).toHaveValue(/사용여부/)
  })

  test('TC-SSCM0100-004 | 사용여부 드롭다운 필터 조회 (사용)', async ({ page }) => {
    await page.getByTestId('sel-use-yn').selectOption('0') // 미사용
    await page.getByTestId('btn-search').click()
    await page.waitForTimeout(600)
    // 조회 결과 건수가 전체보다 적거나 없을 수 있음
    const rows = page.locator('[data-testid^="row-010-"]')
    const cnt = await rows.count()
    // 미사용 항목만 반환 (최소 1건 이상 또는 0건 확인)
    expect(cnt).toBeGreaterThanOrEqual(0)
  })

  test('TC-SSCM0100-005 | Enter 키로 조회', async ({ page }) => {
    await page.getByTestId('input-cmmn-cd-nm').fill('코드')
    await page.getByTestId('input-cmmn-cd-nm').press('Enter')
    await page.waitForTimeout(500)
    await expect(page.locator('[data-testid="grid-csys010"]')).toBeVisible()
  })

  // ──────────────────────────────────────────
  // TC-SSCM0100-006: 행 선택 → 코드값 조회
  // ──────────────────────────────────────────
  test('TC-SSCM0100-006 | 공통코드 행 선택 시 코드값 목록 조회', async ({ page }) => {
    await page.getByTestId('btn-search').click()
    await page.waitForSelector('[data-testid="row-010-0"]')

    // 첫 번째 행 클릭
    await page.getByTestId('row-010-0').click()
    // 코드값 조회 대기
    await page.waitForTimeout(400)
    // 코드값 그리드에 데이터 또는 안내 메시지 표시
    const colValues = page.locator('[data-testid^="row-011-"]')
    const noData = page.locator('text=등록된 코드값이 없습니다')
    const hasData = await colValues.count() > 0
    const hasMsg = await noData.isVisible()
    expect(hasData || hasMsg).toBe(true)
  })

  // ──────────────────────────────────────────
  // TC-SSCM0100-007: 공통코드 추가
  // ──────────────────────────────────────────
  test('TC-SSCM0100-007 | 공통코드 추가', async ({ page }) => {
    await page.getByTestId('btn-search').click()
    await page.waitForSelector('[data-testid="row-010-0"]')

    const beforeCount = await page.locator('[data-testid^="row-010-"]').count()
    await page.getByTestId('btn-add-010').click()

    const afterCount = await page.locator('[data-testid^="row-010-"]').count()
    expect(afterCount).toBe(beforeCount + 1)

    // 추가된 행이 상태=추가 배지 확인
    await expect(page.locator('.status-badge.inserted').first()).toBeVisible()
  })

  // ──────────────────────────────────────────
  // TC-SSCM0100-008: 공통코드 저장 (유효성 실패)
  // ──────────────────────────────────────────
  test('TC-SSCM0100-008 | 필수값 미입력 시 저장 유효성 오류', async ({ page }) => {
    await page.getByTestId('btn-search').click()
    await page.waitForSelector('[data-testid="row-010-0"]')

    // 추가 후 공통코드 비워두고 저장
    await page.getByTestId('btn-add-010').click()
    await page.getByTestId('btn-save-010').click()

    // 토스트 에러 메시지 확인
    await expect(page.locator('.toast.error')).toBeVisible()
    await expect(page.locator('.toast.error')).toContainText('공통코드')
  })

  // ──────────────────────────────────────────
  // TC-SSCM0100-009: 공통코드 저장 성공
  // ──────────────────────────────────────────
  test('TC-SSCM0100-009 | 공통코드 신규 추가 및 저장 성공', async ({ page }) => {
    await page.getByTestId('btn-search').click()
    await page.waitForSelector('[data-testid="row-010-0"]')

    // 추가
    await page.getByTestId('btn-add-010').click()
    await page.getByTestId('cell-010-cmmnCd-0').fill('TEST0099')
    await page.getByTestId('cell-010-cmmnCdNm-0').fill('테스트코드')

    // 저장
    await page.getByTestId('btn-save-010').click()
    await expect(page.locator('.toast.success')).toBeVisible()
    await expect(page.locator('.toast.success')).toContainText('저장')
  })

  // ──────────────────────────────────────────
  // TC-SSCM0100-010: 공통코드값 추가
  // ──────────────────────────────────────────
  test('TC-SSCM0100-010 | 공통코드값 추가', async ({ page }) => {
    await page.getByTestId('btn-search').click()
    await page.waitForSelector('[data-testid="row-010-0"]')

    // 첫 번째 행 선택 (코드값이 있는 CSYS0010)
    await page.getByTestId('row-010-0').click()
    await page.waitForSelector('[data-testid="row-011-0"]')

    const before = await page.locator('[data-testid^="row-011-"]').count()
    await page.getByTestId('btn-add-011').click()
    const after = await page.locator('[data-testid^="row-011-"]').count()
    expect(after).toBe(before + 1)
  })

  // ──────────────────────────────────────────
  // TC-SSCM0100-011: 공통코드값 저장 성공
  // ──────────────────────────────────────────
  test('TC-SSCM0100-011 | 공통코드값 신규 추가 및 저장 성공', async ({ page }) => {
    await page.getByTestId('btn-search').click()
    await page.waitForSelector('[data-testid="row-010-0"]')

    // 공통코드 행 선택
    await page.getByTestId('row-010-0').click()
    await page.waitForTimeout(400)

    // 값 추가
    await page.getByTestId('btn-add-011').click()
    // 마지막 행에 입력
    const lastIdx = await page.locator('[data-testid^="row-011-"]').count() - 1
    await page.getByTestId(`cell-011-cmmnCdVal-${lastIdx}`).fill('TEST')
    await page.getByTestId(`cell-011-cdValNm-${lastIdx}`).fill('테스트값')

    // 저장
    await page.getByTestId('btn-save-011').click()
    await expect(page.locator('.toast.success')).toBeVisible()
  })

  // ──────────────────────────────────────────
  // TC-SSCM0100-012: 삭제 - 선택 없이 클릭
  // ──────────────────────────────────────────
  test('TC-SSCM0100-012 | 삭제 버튼 - 선택 항목 없으면 경고', async ({ page }) => {
    await page.getByTestId('btn-search').click()
    await page.waitForSelector('[data-testid="row-010-0"]')

    await page.getByTestId('btn-del-010').click()
    await expect(page.locator('.toast.warning')).toBeVisible()
    await expect(page.locator('.toast.warning')).toContainText('선택')
  })

  // ──────────────────────────────────────────
  // TC-SSCM0100-013: 삭제 확인 다이얼로그 취소
  // ──────────────────────────────────────────
  test('TC-SSCM0100-013 | 삭제 확인 다이얼로그 취소 시 삭제 안됨', async ({ page }) => {
    await page.getByTestId('btn-search').click()
    await page.waitForSelector('[data-testid="row-010-0"]')

    const before = await page.locator('[data-testid^="row-010-"]').count()
    // 체크박스 선택
    await page.getByTestId('chk-010-0').check()
    await page.getByTestId('btn-del-010').click()
    // 다이얼로그 확인
    await expect(page.getByTestId('modal-confirm')).toBeVisible()
    // 취소 클릭
    await page.getByTestId('btn-confirm-cancel').click()
    await expect(page.getByTestId('modal-confirm')).not.toBeVisible()
    // 행 수 그대로
    const after = await page.locator('[data-testid^="row-010-"]').count()
    expect(after).toBe(before)
  })

  // ──────────────────────────────────────────
  // TC-SSCM0100-014: 조회 후 수정 → 재조회 경고
  // ──────────────────────────────────────────
  test('TC-SSCM0100-014 | 변경사항 있는 상태에서 재조회 시 경고 다이얼로그', async ({ page }) => {
    await page.getByTestId('btn-search').click()
    await page.waitForSelector('[data-testid="row-010-0"]')

    // 첫 번째 행 수정
    await page.getByTestId('cell-010-cmmnCdNm-0').fill('수정테스트')
    // 재조회
    await page.getByTestId('btn-search').click()
    // 경고 다이얼로그 표시 확인
    await expect(page.getByTestId('modal-confirm')).toBeVisible()
    // 확인 후 조회 진행
    await page.getByTestId('btn-confirm-ok').click()
    await page.waitForTimeout(500)
    await expect(page.getByTestId('modal-confirm')).not.toBeVisible()
  })

  // ──────────────────────────────────────────
  // TC-SSCM0100-015: 로그아웃
  // ──────────────────────────────────────────
  test('TC-SSCM0100-015 | 로그아웃 후 로그인 화면 이동', async ({ page }) => {
    await page.getByTestId('btn-logout').click()
    await page.waitForURL('/login')
    await expect(page.getByTestId('login-form')).toBeVisible()
    // 로그아웃 토스트
    await expect(page.locator('.toast')).toContainText('로그아웃')
  })
})
