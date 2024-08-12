import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage.js'
import { useWebSocket } from '@/composables/useWebSocket.js'
import { useApi } from '@/composables/useApi.js'
import { useNotificationsStore } from './notifications.js';

export const useChatStore = defineStore('chat', () => {
  const id = ref('')
  const socket = useWebSocket()
  const connected = ref(false)
  const opened = ref(false)
  const typing = ref(false)

  const { notify } = useNotificationsStore()

  const greeting = reactive({
    show: 0,
    timeout: 0
  })

  // todo store form submission

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
      .find(row => row.startsWith('rc_greeting='))
      ?.split('=')[1]

    // 1. First visit, chat hasn't been opened: show greeting after delay
    // 2. Not first visit: show greeting without delay if it hasn't been dismissed
    if (typeof cookie === 'undefined') {
      greeting.timeout = setTimeout(() => {
        greeting.show = 1
        notify()
        document.cookie = `rc_greeting=${greeting.show}; path=/`
      }, 5000)
    } else greeting.show = cookie === '1'
  }

  function dismissGreeting() {
    greeting.show = false
    document.cookie = 'rc_greeting=0; path=/'
  }

  return { id, socket, greeting, connected, opened, typing, init, dismissGreeting }
})