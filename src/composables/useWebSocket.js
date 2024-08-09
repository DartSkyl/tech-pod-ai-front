import { ref } from 'vue';
import { useChatStore } from '../../stores/chat.js';
import { storeToRefs } from 'pinia';
import { useMessagesStore } from '../../stores/messages.js';
import { useNotificationsStore } from '../../stores/notifications.js';

export function useWebSocket() {
  const socket = ref(null)
  const chat = useChatStore()
  const { messages } = storeToRefs(useMessagesStore())
  const { notify } = useNotificationsStore()

  const connect = (id) => {
    const baseUrl = import.meta.env.VITE_WEBSOCKET_URL ?? 'ws://localhost:8000/ws'
    const url = `${baseUrl}/${id}`
    socket.value = new WebSocket(url);

    socket.value.onopen = () => {
      chat.connected = true
      console.log('WebSocket connected');
    };

    socket.value.onmessage = e => {
      chat.typing = true

      const message = JSON.parse(e.data);
      setTimeout(() => {
        chat.typing = false
        messages.value.push({
          ...message,
          read: chat.opened
        });
        notify()
      }, 2000) // todo message.delay
    };

    socket.value.onclose = () => {
      chat.connected = false
      chat.typing = false
      console.log('WebSocket disconnected');
    };

    socket.value.onerror = e => {
      chat.typing = false
      console.error('WebSocket error', e);
    };
  };

  const send = message => {
    if (socket.value && chat.connected) {
      socket.value.send(message);
    }
  }

  return {
    socket,
    connect,
    send,
  };
}
