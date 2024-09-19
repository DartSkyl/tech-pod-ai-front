<script setup>
import { ref } from 'vue'
import ChatForm from '@/components/ChatForm.vue'
import { useChatStore } from '../../stores/chat.js';
import { useLocalStorage } from '@/composables/useLocalStorage.js';

const { message, time } = defineProps({
  message: {
    type: Object,
    required: true
  },
  time: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['submitted'])

const chat = useChatStore()

function formatDate(s) {
  const [date, time] = s.split(' ')

  let [hour, minute] = time.split(':')

  hour = parseInt(hour, 10)

  const period = hour >= 12 ? 'pm' : 'am'

  hour = hour % 12
  hour = hour ? hour : 12

  return `${hour}:${minute} ${period}`
}

const form = ref()

async function submit() {
  if (chat.initialized) return

  const result = await form.value.validate()
  if (!result) return

  emit('submitted', result)
  chat.initialized = true
}

const prepareMessage = str => str.replace(/(?:https?:\/\/)?(?:www\.)?[^\s]+\.[^\s]+/g, (url) => {
  const href = url.startsWith('http') ? url : `http://${url}`
  return `<a href="${href}" target="_blank">${url}</a>`
})

</script>

<template>
  <div class="chat--message" :class="message.type ? `chat--message_${message.type}` : ''">
    <div class="chat--message__body">
      <div class="chat--message__wrapper" v-html="prepareMessage(message.text)"></div>
    </div>

    <ChatForm ref="form" v-if="message.format === 'form'"/>

    <div v-if="time" class="chat--message__time">{{ formatDate(message.time) }}</div>

    <button v-if="message.format === 'form'" @click="submit" :disabled="chat.initialized"
            class="chat--button chat--button_chat chat--button_accent">Send
    </button>
  </div>
</template>