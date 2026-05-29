# tech-byte-playwright

**Claude Code × Playwright MCP** 를 활용한 E2E 테스트 자동화 데모 프로젝트입니다.

화면 소스를 Claude Code가 분석해 테스트 시나리오를 자동 생성하고,  
Playwright MCP로 브라우저를 직접 조작·검증하는 전체 프로세스를 시연합니다.

---

## 핵심 구성

| 구성 요소 | 역할 |
|---|---|
| `.claude/mcp.json` | Playwright MCP 서버 등록 |
| `.claude/skills/` | `/gen-playwright-scenario` 커스텀 스킬 |
| `tests/*.spec.js` | 자동 생성된 Playwright 테스트 시나리오 |
| `src/` | 데모 웹 앱 (로그인 · 공통코드 관리) |

---

## 빠른 시작

```bash
npm install
npx playwright install chromium
npm test
```

---

## Claude Code 커스텀 스킬

화면 ID를 입력하면 소스를 분석해 테스트 파일을 자동 생성합니다.

```
/gen-playwright-scenario sscm0100
```

---

## 테스트 실행

```bash
npm test                 # 전체 실행 (Claude 불필요, 토큰 0)
npm run test:headed      # 브라우저 창 표시
npm run test:ui          # Playwright GUI 모드
npm run test:report      # HTML 리포트 확인
```

> 시나리오를 한 번 생성한 이후의 `npm test`는 Claude와 완전히 독립적으로 실행됩니다.

---

## 데모 계정

| ID | PW | 역할 |
|---|---|---|
| admin | admin123 | 관리자 |
| user01 | user1234 | 사용자 |

---

## 관련 자료

- 발표 가이드: [`playwright-guide.html`](./playwright-guide.html)
- Playwright MCP: [@playwright/mcp](https://www.npmjs.com/package/@playwright/mcp)
- Claude Code: [claude.ai/code](https://claude.ai/code)
