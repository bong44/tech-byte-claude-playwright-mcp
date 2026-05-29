import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// Mock 사용자 DB
const MOCK_USERS = [
  { id: 'admin', password: 'admin123', name: '관리자', dept: '시스템관리팀', role: 'ADMIN' },
  { id: 'user01', password: 'user1234', name: '홍길동', dept: '개발팀', role: 'USER' },
  { id: 'test',   password: 'test1234', name: '테스트', dept: 'QA팀',   role: 'USER' }
]

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(sessionStorage.getItem('tbp_user') || 'null'))

  const isLoggedIn = computed(() => !!user.value)

  async function login(id, password) {
    // Mock API 딜레이 시뮬레이션
    await delay(600)
    const found = MOCK_USERS.find(u => u.id === id && u.password === password)
    if (!found) {
      throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.')
    }
    user.value = { id: found.id, name: found.name, dept: found.dept, role: found.role }
    sessionStorage.setItem('tbp_user', JSON.stringify(user.value))
  }

  function logout() {
    user.value = null
    sessionStorage.removeItem('tbp_user')
  }

  return { user, isLoggedIn, login, logout }
})

function delay(ms) {
  return new Promise(r => setTimeout(r, ms))
}
