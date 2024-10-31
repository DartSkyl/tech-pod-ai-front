import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage.js'
import { useWebSocket } from '@/composables/useWebSocket.js'
import { useApi } from '@/composables/useApi.js'
import { useGreetingStore } from './greeting.js'

export const useChatStore = defineStore('chat', () => {
  const id = ref('')
  const api = useApi()
  const socket = useWebSocket()
  const connected = ref(false)
  const initialized = ref(false)
  const opened = ref(false)
  const typing = ref(false)

  const { getStoredValue, setStoredValue } = useLocalStorage()
  const greeting = useGreetingStore()

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
    greeting.show()
  }

  function generateID() {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  return { id, socket, connected, initialized, opened, typing, init }
})