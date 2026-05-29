<template>
  <div class="login-page">
    <!-- 좌측 배경 영역 -->
    <div class="login-left">
      <div class="login-left-content">
        <div class="login-logo-wrap">
          <div class="login-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="#1a6fd4"/>
              <path d="M12 34V14l12 10 12-10v20" stroke="white" stroke-width="3" stroke-linejoin="round" fill="none"/>
              <circle cx="24" cy="24" r="4" fill="white"/>
            </svg>
            <span>TechByte</span>
          </div>
          <p class="login-subtitle">대학 학사 행정 시스템</p>
        </div>
        <div class="login-illust">
          <div class="illust-card illust-card-1">
            <span class="illust-icon">📋</span>
            <span>공통코드 관리</span>
          </div>
          <div class="illust-card illust-card-2">
            <span class="illust-icon">👥</span>
            <span>사용자 관리</span>
          </div>
          <div class="illust-card illust-card-3">
            <span class="illust-icon">🏫</span>
            <span>학사 관리</span>
          </div>
        </div>
        <p class="login-desc">
          안전하고 효율적인 학사 행정을 위한<br>
          통합 관리 플랫폼입니다.
        </p>
      </div>
    </div>

    <!-- 우측 로그인 폼 -->
    <div class="login-right">
      <div class="login-form-wrap">
        <div class="login-form-header">
          <h1>로그인</h1>
          <p>아이디와 비밀번호를 입력하세요</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin" data-testid="login-form">
          <div class="login-field">
            <label class="login-field-label" for="loginId">아이디</label>
            <div class="login-input-wrap" :class="{ error: errors.id }">
              <span class="input-icon">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </span>
              <input
                id="loginId"
                v-model="form.id"
                type="text"
                placeholder="아이디를 입력하세요"
                class="login-input"
                autocomplete="username"
                data-testid="input-login-id"
                @input="errors.id = ''"
              />
            </div>
            <span v-if="errors.id" class="field-error">{{ errors.id }}</span>
          </div>

          <div class="login-field">
            <label class="login-field-label" for="loginPw">비밀번호</label>
            <div class="login-input-wrap" :class="{ error: errors.pw }">
              <span class="input-icon">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6A5 5 0 007 6v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zm-6 9a2 2 0 110-4 2 2 0 010 4zm3.1-9H8.9V6a3.1 3.1 0 016.2 0v2z"/>
                </svg>
              </span>
              <input
                id="loginPw"
                v-model="form.pw"
                :type="showPw ? 'text' : 'password'"
                placeholder="비밀번호를 입력하세요"
                class="login-input"
                autocomplete="current-password"
                data-testid="input-login-pw"
                @input="errors.pw = ''"
              />
              <button type="button" class="pw-toggle" @click="showPw = !showPw" tabindex="-1">
                {{ showPw ? '🙈' : '👁️' }}
              </button>
            </div>
            <span v-if="errors.pw" class="field-error">{{ errors.pw }}</span>
          </div>

          <div class="login-options">
            <label class="save-id-label">
              <input type="checkbox" v-model="saveId" data-testid="chk-save-id" />
              <span>아이디 저장</span>
            </label>
          </div>

          <!-- 서버 에러 메시지 -->
          <div v-if="loginError" class="login-error-msg" data-testid="login-error">
            <span>⚠️</span>
            <span>{{ loginError }}</span>
          </div>

          <button
            type="submit"
            class="btn-login"
            :disabled="loading"
            data-testid="btn-login"
          >
            <span v-if="loading" class="loading-spinner"></span>
            <span v-else>로그인</span>
          </button>
        </form>

        <div class="login-hint">
          <p class="hint-title">테스트 계정 안내</p>
          <div class="hint-accounts">
            <div class="hint-row" v-for="acc in hintAccounts" :key="acc.id" @click="fillAccount(acc)">
              <span class="hint-badge" :class="acc.role.toLowerCase()">{{ acc.role }}</span>
              <span class="hint-id">{{ acc.id }}</span>
              <span class="hint-pw">/ {{ acc.pw }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'

const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

const form = ref({ id: '', pw: '' })
const errors = ref({ id: '', pw: '' })
const loginError = ref('')
const loading = ref(false)
const showPw = ref(false)
const saveId = ref(false)

const hintAccounts = [
  { id: 'admin', pw: 'admin123', role: 'ADMIN' },
  { id: 'user01', pw: 'user1234', role: 'USER' },
  { id: 'test',  pw: 'test1234', role: 'USER' }
]

onMounted(() => {
  const saved = localStorage.getItem('tbp_saved_id')
  if (saved) {
    form.value.id = saved
    saveId.value = true
  }
})

function fillAccount(acc) {
  form.value.id = acc.id
  form.value.pw = acc.pw
}

function validate() {
  let valid = true
  errors.value = { id: '', pw: '' }
  if (!form.value.id.trim()) {
    errors.value.id = '아이디를 입력하세요.'
    valid = false
  }
  if (!form.value.pw.trim()) {
    errors.value.pw = '비밀번호를 입력하세요.'
    valid = false
  }
  return valid
}

async function handleLogin() {
  if (!validate()) return
  loginError.value = ''
  loading.value = true
  try {
    await auth.login(form.value.id, form.value.pw)
    if (saveId.value) {
      localStorage.setItem('tbp_saved_id', form.value.id)
    } else {
      localStorage.removeItem('tbp_saved_id')
    }
    toast.success(`${auth.user.name}님 환영합니다!`)
    router.push('/')
  } catch (e) {
    loginError.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  height: 100vh;
  min-height: 600px;
  overflow: hidden;
}

/* ===== 좌측 ===== */
.login-left {
  flex: 1;
  background: linear-gradient(145deg, #1a2744 0%, #1a6fd4 60%, #0fa0d4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  position: relative;
  overflow: hidden;
}
.login-left::before {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 320px; height: 320px;
  border-radius: 50%;
  background: rgba(255,255,255,0.06);
}
.login-left::after {
  content: '';
  position: absolute;
  bottom: -60px; left: -60px;
  width: 240px; height: 240px;
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
}
.login-left-content { position: relative; z-index: 1; color: #fff; max-width: 380px; }
.login-logo-wrap { margin-bottom: 48px; }
.login-logo {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}
.login-subtitle { font-size: 15px; color: rgba(255,255,255,0.75); margin-left: 62px; }
.login-illust {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
}
.illust-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}
.illust-card:hover { background: rgba(255,255,255,0.18); }
.illust-icon { font-size: 20px; }
.illust-card-1 { margin-left: 0; }
.illust-card-2 { margin-left: 20px; }
.illust-card-3 { margin-left: 40px; }
.login-desc {
  font-size: 13px;
  line-height: 1.8;
  color: rgba(255,255,255,0.65);
}

/* ===== 우측 ===== */
.login-right {
  width: 480px;
  min-width: 420px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  box-shadow: -4px 0 24px rgba(0,0,0,0.08);
}
.login-form-wrap { width: 100%; max-width: 360px; padding: 0 20px; }
.login-form-header { margin-bottom: 32px; }
.login-form-header h1 {
  font-size: 26px;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 6px;
}
.login-form-header p { font-size: 13px; color: #6b7280; }

/* Fields */
.login-field { margin-bottom: 18px; }
.login-field-label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
.login-input-wrap {
  display: flex;
  align-items: center;
  border: 1.5px solid #e0e4ea;
  border-radius: 8px;
  background: #fafbfc;
  overflow: hidden;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.login-input-wrap:focus-within {
  border-color: #1a6fd4;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(26,111,212,0.12);
}
.login-input-wrap.error { border-color: #d84040; }
.input-icon {
  padding: 0 12px;
  color: #9ca3af;
  display: flex;
  align-items: center;
}
.login-input {
  flex: 1;
  height: 44px;
  border: none;
  background: transparent;
  font-size: 14px;
  font-family: inherit;
  color: #1a1a2e;
  outline: none;
}
.login-input::placeholder { color: #c0c6d0; }
.pw-toggle {
  padding: 0 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  color: #9ca3af;
}
.field-error { display: block; font-size: 12px; color: #d84040; margin-top: 4px; }

/* Options */
.login-options { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.save-id-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
}

/* Error */
.login-error-msg {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  font-size: 13px;
  color: #dc2626;
  margin-bottom: 16px;
}

/* Login Button */
.btn-login {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #1a6fd4, #0fa0d4);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: inherit;
}
.btn-login:hover:not(:disabled) { opacity: 0.92; transform: translateY(-1px); }
.btn-login:disabled { opacity: 0.6; cursor: not-allowed; }
.loading-spinner {
  width: 20px; height: 20px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Hint */
.login-hint {
  margin-top: 28px;
  padding: 14px 16px;
  background: #f8faff;
  border: 1px solid #e8f0fc;
  border-radius: 8px;
}
.hint-title { font-size: 11px; font-weight: 700; color: #6b7280; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
.hint-accounts { display: flex; flex-direction: column; gap: 6px; }
.hint-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
}
.hint-row:hover { background: #e8f0fc; }
.hint-badge {
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
  background: #dbeafe;
  color: #1d4ed8;
}
.hint-badge.admin { background: #fde68a; color: #92400e; }
.hint-id { font-size: 13px; font-weight: 600; color: #1a1a2e; }
.hint-pw { font-size: 12px; color: #9ca3af; }

@media (max-width: 768px) {
  .login-left { display: none; }
  .login-right { width: 100%; min-width: 0; }
}
</style>
