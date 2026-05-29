import { defineStore } from 'pinia'
import { ref } from 'vue'

let seq = 0
export const useToastStore = defineStore('toast', () => {
  const toasts = ref([])

  function show(message, type = 'info', duration = 2800) {
    const id = ++seq
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), duration)
  }

  function remove(id) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  const success = (msg) => show(msg, 'success')
  const error   = (msg) => show(msg, 'error', 4000)
  const warning = (msg) => show(msg, 'warning')
  const info    = (msg) => show(msg, 'info')

  return { toasts, success, error, warning, info }
})
