import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage.js'

export const useMessagesStore = defineStore('messages', () => {
  const all = ref([
    {
      type: 'incoming',
      text: 'Please complete the form to start a conversation',
      time: getNowDate(),
      format: 'form'
    }
  ])
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

  function getNowDate() {
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  return { all, unread, init, clearUnread, updateUnread }
})