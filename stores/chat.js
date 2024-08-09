import { defineStore } from 'pinia'
import { ref } from 'vue';
import { useLocalStorage } from '@/composables/useLocalStorage.js';
import { useWebSocket } from '@/composables/useWebSocket.js';

export const useChatStore = defineStore('chat', () => {
  const id = ref('')
  const greeting = ref(false)
  const connected = ref(false)
  const opened = ref(false)
  const typing = ref(false)
  const socket = useWebSocket()

  const { getValue, setValue } = useLocalStorage()

  function init() {
    const existingUserID = getValue('chat_id')

    if (existingUserID) {
      id.value = existingUserID

    } else {
      id.value = generateID()
      setValue('chat_id', id.value)
    }

    socket.connect(id.value)
  }

  function generateID() {
    return Date.now()
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  function showGreeting() {
    const show = document.cookie
      .split('; ')
      .find(row => row.startsWith('rc_greeting='))
      ?.split('=')[1];

    // 1. First visit, chat hasn't been opened: show greeting after delay
    // 2. Not first visit: show greeting without delay if it hasn't been dismissed
    if (typeof show === 'undefined') {
      setTimeout(() => {
        greeting.value = !opened.value
        const cookieValue = opened.value ? 0 : 1
        document.cookie = `rc_greeting=${cookieValue}; path=/`;
      }, 5000)
    } else greeting.value = show === '1';
  }

  function dismissGreeting() {
    greeting.value = false;
    document.cookie = 'rc_greeting=0; path=/';
  }

  return { id, socket, greeting, connected, opened, typing, init, dismissGreeting, showGreeting }
})