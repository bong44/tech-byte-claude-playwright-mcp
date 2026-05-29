<template>
  <div class="main-layout">
    <!-- 헤더 -->
    <header class="app-header" data-testid="app-header">
      <div class="header-left">
        <button class="sidebar-toggle" @click="sidebarOpen = !sidebarOpen" data-testid="btn-sidebar-toggle">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path v-if="sidebarOpen" d="M19 11H7.83l4.88-4.88a1 1 0 10-1.41-1.41l-6.59 6.59a1 1 0 000 1.41l6.59 6.59A1 1 0 0012.71 18l-4.88-4.88H19a1 1 0 000-2z"/>
            <path v-else d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
          </svg>
        </button>
        <div class="header-brand">
          <svg width="28" height="28" viewBox="0 0 48 48" fill="none">
            <rect width="48" height="48" rx="10" fill="#4d90f0"/>
            <path d="M12 34V14l12 10 12-10v20" stroke="white" stroke-width="3" stroke-linejoin="round" fill="none"/>
            <circle cx="24" cy="24" r="4" fill="white"/>
          </svg>
          <span class="brand-name">TechByte</span>
          <span class="brand-sub">학사행정시스템</span>
        </div>
      </div>
      <div class="header-right">
        <div class="header-breadcrumb" v-if="currentMenu">
          <span>홈</span>
          <span class="bc-sep">›</span>
          <span>시스템관리</span>
          <span class="bc-sep">›</span>
          <span class="bc-current">{{ currentMenu.title }}</span>
        </div>
        <div class="header-user">
          <div class="user-avatar">{{ auth.user?.name?.[0] || 'U' }}</div>
          <div class="user-info">
            <span class="user-name">{{ auth.user?.name }}</span>
            <span class="user-dept">{{ auth.user?.dept }}</span>
          </div>
          <button class="btn-logout" @click="handleLogout" data-testid="btn-logout">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
            </svg>
            로그아웃
          </button>
        </div>
      </div>
    </header>

    <div class="layout-body">
      <!-- 사이드바 -->
      <aside class="app-sidebar" :class="{ collapsed: !sidebarOpen }" data-testid="app-sidebar">
        <nav class="sidebar-nav">
          <div class="nav-section">
            <div class="nav-section-title">시스템 관리</div>
            <router-link
              v-for="item in menuItems"
              :key="item.to"
              :to="item.to"
              class="nav-item"
              :class="{ active: $route.path === item.to }"
              :data-testid="`nav-${item.id}`"
            >
              <span class="nav-icon">{{ item.icon }}</span>
              <span class="nav-label" v-show="sidebarOpen">{{ item.label }}</span>
            </router-link>
          </div>
        </nav>
      </aside>

      <!-- 콘텐츠 -->
      <main class="app-content" data-testid="app-content">
        <div class="page-title" v-if="currentMenu">
          <h2>{{ currentMenu.title }}</h2>
          <span class="page-id">{{ $route.path }}</span>
        </div>
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToastStore } from '../stores/toast'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToastStore()

const sidebarOpen = ref(true)

const menuItems = [
  { id: 'sscm0100', to: '/sscm0100', label: '공통코드 관리', icon: '📋' },
]

const currentMenu = computed(() => {
  return menuItems.find(m => m.to === route.path)
})

async function handleLogout() {
  auth.logout()
  toast.info('로그아웃 되었습니다.')
  router.push('/login')
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* ===== Header ===== */
.app-header {
  height: 56px;
  background: var(--color-header-bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px 0 0;
  flex-shrink: 0;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 100;
}
.header-left { display: flex; align-items: center; gap: 0; }
.sidebar-toggle {
  width: 56px;
  height: 56px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.15s, background 0.15s;
  flex-shrink: 0;
}
.sidebar-toggle:hover { color: #fff; background: rgba(255,255,255,0.08); }
.header-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}
.brand-name { font-size: 18px; font-weight: 800; letter-spacing: -0.3px; }
.brand-sub { font-size: 12px; color: rgba(255,255,255,0.55); margin-left: 4px; padding-left: 12px; border-left: 1px solid rgba(255,255,255,0.2); }
.header-right { display: flex; align-items: center; gap: 20px; }
.header-breadcrumb { font-size: 12px; color: rgba(255,255,255,0.55); display: flex; align-items: center; gap: 6px; }
.bc-sep { color: rgba(255,255,255,0.3); }
.bc-current { color: rgba(255,255,255,0.85); font-weight: 500; }

.header-user { display: flex; align-items: center; gap: 10px; }
.user-avatar {
  width: 34px; height: 34px;
  background: linear-gradient(135deg, #4d90f0, #0fa0d4);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 700;
}
.user-info { display: flex; flex-direction: column; }
.user-name { font-size: 13px; font-weight: 600; }
.user-dept { font-size: 11px; color: rgba(255,255,255,0.6); }
.btn-logout {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 12px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 6px;
  color: rgba(255,255,255,0.8);
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}
.btn-logout:hover { background: rgba(255,255,255,0.18); color: #fff; }

/* ===== Layout Body ===== */
.layout-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ===== Sidebar ===== */
.app-sidebar {
  width: 220px;
  background: var(--color-sidebar-bg);
  flex-shrink: 0;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.2s ease;
  z-index: 50;
}
.app-sidebar.collapsed { width: 56px; }
.sidebar-nav { padding: 12px 0; }
.nav-section { }
.nav-section-title {
  padding: 8px 16px;
  font-size: 10px;
  font-weight: 700;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  white-space: nowrap;
  overflow: hidden;
}
.app-sidebar.collapsed .nav-section-title { opacity: 0; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 16px;
  color: rgba(255,255,255,0.65);
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.15s;
  white-space: nowrap;
}
.nav-item:hover { background: var(--color-sidebar-hover); color: #fff; }
.nav-item.active { background: var(--color-sidebar-active); color: #fff; }
.nav-icon { font-size: 16px; flex-shrink: 0; width: 24px; text-align: center; }

/* ===== Content ===== */
.app-content {
  flex: 1;
  overflow: auto;
  background: var(--color-bg);
  padding: 16px;
  display: flex;
  flex-direction: column;
}
.page-title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}
.page-title h2 { font-size: 18px; font-weight: 700; color: var(--color-text); }
.page-id { font-size: 12px; color: var(--color-text-muted); }
</style>
