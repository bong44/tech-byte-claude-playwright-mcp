const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

(async () => {
  const screenshotDir = path.join(__dirname, 'verify-screenshots');
  if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir);

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // 1. 로그인 페이지 이동
    await page.goto('http://localhost:5174');
    await page.screenshot({ path: path.join(screenshotDir, '01-login-page.png') });
    console.log('✅ Step 1: 로그인 페이지 접속');

    // 2. admin 계정으로 로그인
    await page.waitForSelector('[data-testid="input-login-id"]', { timeout: 10000 });
    await page.fill('[data-testid="input-login-id"]', 'admin');
    await page.fill('[data-testid="input-login-pw"]', 'admin123');
    await page.screenshot({ path: path.join(screenshotDir, '02-credentials-entered.png') });
    console.log('✅ Step 2: 로그인 정보 입력 완료');

    await page.click('[data-testid="btn-login"]');
    await page.waitForURL('**/sscm0100', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(screenshotDir, '03-after-login.png') });
    console.log('✅ Step 3: 로그인 완료, 현재 URL:', page.url());

    // 3. sscm0100 화면으로 이동 (아직 거기 없다면)
    if (!page.url().includes('sscm0100')) {
      await page.goto('http://localhost:5174/sscm0100');
      await page.waitForTimeout(1000);
    }
    await page.screenshot({ path: path.join(screenshotDir, '04-sscm0100-loaded.png') });
    console.log('✅ Step 4: sscm0100 화면 로드, URL:', page.url());

    // 4. 조회 버튼 클릭
    const searchBtn = page.locator('[data-testid="btn-search"]');
    const searchBtnVisible = await searchBtn.isVisible().catch(() => false);
    console.log('   조회 버튼 존재 여부:', searchBtnVisible);

    if (searchBtnVisible) {
      await searchBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(screenshotDir, '05-after-search.png') });
      console.log('✅ Step 5: 조회 버튼 클릭 완료');
    } else {
      const altBtn = page.locator('button:has-text("조회")').first();
      const altVisible = await altBtn.isVisible().catch(() => false);
      if (altVisible) {
        await altBtn.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(screenshotDir, '05-after-search.png') });
        console.log('✅ Step 5: 조회 버튼(텍스트 매칭) 클릭 완료');
      } else {
        console.log('❌ Step 5: 조회 버튼을 찾을 수 없음');
        await page.screenshot({ path: path.join(screenshotDir, '05-no-search-btn.png') });
      }
    }

    // 5. 결과 그리드 확인
    const gridWrap = page.locator('[data-testid="grid-csys010-wrap"]');
    const gridVisible = await gridWrap.isVisible().catch(() => false);
    console.log('   그리드(grid-csys010-wrap) 표시 여부:', gridVisible);

    const rows = page.locator('[data-testid^="row-010-"]');
    const rowCount = await rows.count();
    console.log('   그리드 행(row) 수:', rowCount);

    await page.screenshot({ path: path.join(screenshotDir, '06-grid-result.png'), fullPage: true });

    if (rowCount > 0) {
      const firstCell = page.locator('[data-testid="cell-010-cmmnCd-0"]');
      const cellText = await firstCell.textContent().catch(() => '(N/A)');
      console.log('   첫 번째 행 cmmnCd:', cellText.trim());
      console.log('✅ Step 6: 그리드에 데이터 표시 확인 완료 - 총', rowCount, '행');
    } else {
      console.log('⚠️  Step 6: 그리드 행이 0개 - 조회 전 상태이거나 데이터 없음');
    }

    console.log('\n스크린샷 저장 위치:', screenshotDir);
  } catch (e) {
    console.error('❌ 오류 발생:', e.message);
    await page.screenshot({ path: path.join(screenshotDir, 'error.png') }).catch(() => {});
  } finally {
    await browser.close();
  }
})();
