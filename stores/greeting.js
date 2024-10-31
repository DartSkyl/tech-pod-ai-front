import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCookies } from '@/composables/useCookie.js'
import { useNotificationsStore } from './notifications.js'

export const useGreetingStore = defineStore('greeting', () => {
  const { getCookie, setCookie } = useCookies()

  const cookie = 'rc_welcome'
  const shown = ref(0)
  const timeout = ref(0)
  const expiration = import.meta.env.VITE_GREETING_HOURS_EXPIRES ?? 24
  const text = import.meta.env.VITE_GREETING_MESSAGE ?? 'Hello! Can I help you?'

  function show() {
    const welcomed = getCookie(cookie)

    // 1. First visit in 24h, chat hasn't been opened: show greeting after delay
    if (typeof welcomed === 'undefined') {
      const { notify } = useNotificationsStore()

      timeout.value = setTimeout(() => {
        shown.value = 1
        save()
        notify()
      }, import.meta.env.VITE_GREETING_TIMEOUT ?? 5000)

      // 2. Not first visit: show greeting without delay if it hasn't been dismissed
    } else shown.value = parseInt(welcomed)
  }

  function dismiss() {
    shown.value = 0
    save()
  }

  function save() {
    setCookie(cookie, shown.value, expiration)
  }

  return { shown, timeout, text, show, dismiss }
})