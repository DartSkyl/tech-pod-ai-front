import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue';

export const useChatStore = defineStore('chat', () => {
  const id = ref('')
  const greeting = ref(false)

  function init() {
    const existingUserID = localStorage.getItem('rc_chat_id')

    if (existingUserID) {
      id.value = existingUserID

    } else {
      id.value = generateID()
      localStorage.setItem('rc_chat_id', id.value)
    }
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
      .find(cookie => cookie.startsWith('rc_greeting='));

    console.log(show)

    // 1. First visit, chat hasn't been opened: show greeting after delay
    // 2. Not first visit: show greeting without delay if it hasn't been dismissed
    if (typeof show === 'undefined') {
      setTimeout(() => {
        greeting.value = true
        document.cookie = 'rc_greeting=true path=/';
      }, 5000)
    } else greeting.value = show;
  }

  function dismissGreeting() {
    greeting.value = false;
    document.cookie = 'rc_greeting=false; path=/';
  }

  return { id, greeting, init, dismissGreeting, showGreeting }
})