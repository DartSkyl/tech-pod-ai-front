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
  const greeting = ref(true)

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

    const storedGreeting = getStoredValue('greeting')
    if (typeof storedGreeting !== 'undefined') greeting.value = storedGreeting
  }

  function generateID() {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  function dismissGreeting() {
    setStoredValue('greeting', false)
    greeting.value = false
  }

  return { id, socket, greeting, connected, initialized, opened, typing, init, dismissGreeting }
})