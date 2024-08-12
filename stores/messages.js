import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage.js'

export const useMessagesStore = defineStore('messages', () => {
  const all = ref([])
  const unread = ref(0)

  const { getStoredValue, setStoredValue } = useLocalStorage()

  function init() {
    const storedUnread = getStoredValue('unread')
    if (typeof storedUnread !== 'undefined') {
      unread.value = storedUnread
    }
  }

  function clearUnread() {
    all.value = all.value.map(message => {
      if ('read' in message) {
        return { ...message, read: true }
      }
      return message
    })

    updateUnread()
  }

  function updateUnread() {
    unread.value = all.value.filter(message => message.read === false).length
    setStoredValue('unread', unread.value)
  }

  return { all, unread, init, clearUnread, updateUnread }
})