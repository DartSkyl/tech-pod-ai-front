import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage.js'
import { useWebSocket } from '@/composables/useWebSocket.js'
import { useApi } from '@/composables/useApi.js'
import { useNotificationsStore } from './notifications.js'

export const useChatStore = defineStore('chat', () => {
  const id = ref('')
  const socket = useWebSocket()
  const connected = ref(false)
  const initialized = ref(false)
  const opened = ref(false)
  const typing = ref(false)
  const interacted = ref(false)
  const greeting = reactive({
    show: 0,
    timeout: 0,
    text: import.meta.env.VITE_GREETING_MESSAGE ?? 'Hello! Can I help you?'
  })

  const api = useApi()
  const { getStoredValue, setStoredValue } = useLocalStorage()

  function init() {
    const existingUserID = getStoredValue('chat_id')

    if (existingUserID) {
      id.value = existingUserID

    } else {
      id.value = generateID()
      setStoredValue('chat_id', id.value)
    }

    api.getHistory(id.value)
    socket.connect(id.value)

    showGreeting()
  }

  function generateID() {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  function showGreeting() {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('rc_welcome='))
      ?.split('=')[1]

    // 1. First visit in 24h, chat hasn't been opened: show greeting after delay if user interacted with website
    if (typeof cookie === 'undefined') {
      const { notify } = useNotificationsStore()
      const timeout = import.meta.env.VITE_GREETING_TIMEOUT ?? 5000
      const hours = import.meta.env.VITE_GREETING_HOURS_EXPIRES ?? 24

      // Detect interaction
      const events = ['keydown', 'click', 'touchstart']

      const handleInteraction = () => {
        greeting.timeout = setTimeout(() => {
          greeting.show = 1
          notify()

          const now = new Date()
          now.setTime(now.getTime() + hours * 60 * 60 * 1000) // 24h
          const expires = now.toUTCString()

          document.cookie = `rc_welcome=${greeting.show}; expires=${expires}; path=/`
        }, timeout)

        events.forEach(e => removeEventListener(e, handleInteraction))
      }

      events.forEach(e => addEventListener(e, handleInteraction))

      // 2. Not first visit: show greeting without delay if it hasn't been dismissed
    } else greeting.show = parseInt(cookie)
  }

  function dismissGreeting() {
    greeting.show = 0
    document.cookie = 'rc_welcome=0; path=/'
  }

  return { id, socket, greeting, connected, initialized, opened, typing, init, dismissGreeting }
})