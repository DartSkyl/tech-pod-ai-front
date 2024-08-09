import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue';
import { useLocalStorage } from '@/composables/useLocalStorage';
import { useMessagesStore } from './messages.js';

export const useNotificationsStore = defineStore('notifications', () => {
  const muted = ref(false);

  const { getValue, setValue } = useLocalStorage()
  const { messages } = storeToRefs(useMessagesStore())

  const notifications = computed(() => {
    return messages.value.filter(message => message.read === false).length;
  })

  function init() {
    const stored = getValue('muted')
    if (typeof stored === 'undefined') {
      setValue('muted', false)
    } else {
      muted.value = stored
    }
  }

  function notify() {
    if (muted.value) return
    const audio = new Audio('/notification.mp3')
    audio.play().catch(e => {
      console.error('Error playing sound:', e);
    });
  }

  function toggle() {
    muted.value = !muted.value
    setValue('muted', muted.value)
  }

  function clear() {
    messages.value = messages.value.map(message => {
      if ('read' in message) {
        return { ...message, read: true };
      }
      return message
    });
  }

  return { notifications, muted, init, notify, toggle, clear }
})