import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage.js'
import { useWebSocket } from '@/composables/useWebSocket.js'
import { useApi } from '@/composables/useApi.js'
import { useNotificationsStore } from './notifications.js'
import { useCookies } from '@/composables/useCookie.js';

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
  const { getCookie, setCookie } = useCookies()

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
    const welcomed = getCookie('rc_welcome')

    // 1. First visit in 24h, chat hasn't been opened: show greeting after delay if user interacted with website
    if (typeof welcomed === 'undefined') {
      const { notify } = useNotificationsStore()
      const interacted = getCookie('rc_interacted')
      const timeout = import.meta.env.VITE_GREETING_TIMEOUT ?? 5000
      const hours = import.meta.env.VITE_GREETING_HOURS_EXPIRES ?? 24

      const welcome = () => {
        greeting.timeout = setTimeout(() => {
          greeting.show = 1
          notify()
          setCookie('rc_welcome', greeting.show, hours)
        }, timeout)
      }

      // If interaction has been already made (ex: on the other page)
      if (typeof interacted !== 'undefined') {
        welcome()

      } else {
        // If there has been no interaction yet
        const events = ['keydown', 'click', 'touchstart']

        const handleInteraction = () => {
          events.forEach(e => removeEventListener(e, handleInteraction))
          setCookie('rc_interacted', 1, 1)
          welcome()
        }

        events.forEach(e => addEventListener(e, handleInteraction))
      }

      // 2. Not first visit: show greeting without delay if it hasn't been dismissed
    } else greeting.show = parseInt(welcomed)
  }

  function dismissGreeting() {
    const hours = import.meta.env.VITE_GREETING_HOURS_EXPIRES ?? 24

    greeting.show = 0
    setCookie('rc_welcome', greeting.show, hours)
  }

  return { id, socket, greeting, connected, initialized, opened, typing, init, dismissGreeting }
})