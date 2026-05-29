/**
 * 테스트 공통 헬퍼: 인증
 */
export async function loginAs(page, role = 'admin') {
  const accounts = {
    admin: { id: 'admin', pw: 'admin123' },
    user:  { id: 'user01', pw: 'user1234' },
    test:  { id: 'test',   pw: 'test1234' }
  }
  const acc = accounts[role] || accounts.admin

  await page.goto('/login')
  await page.getByTestId('input-login-id').fill(acc.id)
  await page.getByTestId('input-login-pw').fill(acc.pw)
  await page.getByTestId('btn-login').click()
  // 메인 화면으로 이동 확인
  await page.waitForURL(/\/(sscm0100)?$/)
}
