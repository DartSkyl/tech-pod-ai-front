import { ref } from 'vue'
import { useChatStore } from '../../stores/chat.js'
import { useMessagesStore } from '../../stores/messages.js'
import { useNotificationsStore } from '../../stores/notifications.js'

export function useWebSocket() {
  const socket = ref(null)
  const chat = useChatStore()
  const messages = useMessagesStore()
  const { notify } = useNotificationsStore()

  const connect = (id) => {
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
    const url = `${apiUrl}/ws/${id}`

    socket.value = new WebSocket(url)

    socket.value.onopen = () => {
      chat.connected = true
      console.log('WebSocket connected')
    }

    socket.value.onmessage = e => {
      chat.typing = true

      const message = JSON.parse(e.data)
      setTimeout(() => {
        chat.typing = false
        messages.all.push({
          ...message,
          read: chat.opened
        })
        messages.updateUnread()
        notify()
      }, message.delay ?? 1000)
    }

    socket.value.onclose = () => {
      chat.connected = false
      chat.typing = false
      console.log('WebSocket disconnected')
    }

    socket.value.onerror = e => {
      chat.typing = false
      console.error('WebSocket error', e)
    }
  }

  const send = message => {
    if (socket.value && chat.connected) {
      socket.value.send(message)
    }
  }

  return {
    socket,
    connect,
    send,
  }
}