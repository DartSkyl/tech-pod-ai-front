import { storeToRefs } from 'pinia'
import { useMessagesStore } from '../../stores/messages.js'

export function useApi() {
  const { all: messages } = storeToRefs(useMessagesStore())

  const getHistory = async (id) => {
    const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
    const url = `${apiUrl}/pages/chat_history/${id}`

    fetch(url)
      .then(res=> res.json())
      .then(data => {
        messages.value.push(...data)
      })
      .catch(e => {
        console.error('Error occurred while fetching chat history', e)
      })
  }

  return {
    getHistory
  }
}
