import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  /* 최대 타임아웃 */
  timeout: 30000,
  expect: { timeout: 5000 },
  /* 전체 실패 시 재시도 */
  retries: process.env.CI ? 2 : 0,
  /* 병렬 실행 */
  workers: process.env.CI ? 1 : undefined,
  /* 리포트 */
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:5173',
    /* 스크린샷은 실패 시만 */
    screenshot: 'only-on-failure',
    /* 느린 동작 시각화 (데모용: 500ms) */
    // actionTimeout: 0,
    // launchOptions: { slowMo: 500 },
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  /* 테스트 전 개발 서버 자동 시작 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000
  }
})
