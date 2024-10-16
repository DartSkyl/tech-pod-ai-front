import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'

export const useNotificationsStore = defineStore('notifications', () => {
  const muted = ref(false)

  const { getStoredValue, setStoredValue } = useLocalStorage()

  function init() {
    const storedMuted = getStoredValue('muted')
    if (typeof storedMuted === 'undefined') {
      setStoredValue('muted', false)
    } else {
      muted.value = storedMuted
    }
  }

  function notify() {
    if (muted.value) return

    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
    const audio = new Audio(`${apiUrl}/notification.mp3`)
    audio.play().catch(e => {
      console.warn('Error playing notifications sound:', e)
    })
  }

  function toggle() {
    muted.value = !muted.value
    setStoredValue('muted', muted.value)
  }

  return { muted, init, notify, toggle }
})