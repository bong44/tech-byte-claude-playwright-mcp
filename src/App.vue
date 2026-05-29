<template>
  <router-view />
  <!-- Toast 알림 -->
  <div class="toast-container">
    <transition-group name="toast-fade">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
      >
        <span class="toast-icon">
          <template v-if="toast.type === 'success'">✅</template>
          <template v-else-if="toast.type === 'error'">❌</template>
          <template v-else-if="toast.type === 'warning'">⚠️</template>
          <template v-else>ℹ️</template>
        </span>
        <span class="toast-msg">{{ toast.message }}</span>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToastStore } from './stores/toast'
const toastStore = useToastStore()
</script>

<style>
.toast-fade-enter-active, .toast-fade-leave-active { transition: all 0.25s ease; }
.toast-fade-enter-from { transform: translateX(60px); opacity: 0; }
.toast-fade-leave-to { transform: translateX(60px); opacity: 0; }
</style>
