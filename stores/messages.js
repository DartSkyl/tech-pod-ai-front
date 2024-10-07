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

  function pushOutgoing(text) {
    all.value.push({
      text,
      time: getNowDate(),
      type: 'outgoing'
    })
  }

  function updateUnread() {
    unread.value = all.value.filter(message => message.read === false).length
    setStoredValue('unread', unread.value)
  }

  function getNowDate() {
    const now = new Date()
    return now.toISOString()
  }

  return { all, unread, init, clearUnread, pushOutgoing, updateUnread }
})