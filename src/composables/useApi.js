import { useMessagesStore } from '../../stores/messages.js'
import { useChatStore } from '../../stores/chat.js'

export function useApi() {
  const chat = useChatStore()
  const messages = useMessagesStore()

  const getHistory = async (id) => {
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
    const url = `${apiUrl}/pages/chat_history/${id}`

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data.length) {
          messages.all = data
          messages.init()
          chat.initialized = true
        }
      })
      .catch(e => {
        console.error('Error occurred while fetching chat history', e)
      })
  }

  return {
    getHistory
  }
}