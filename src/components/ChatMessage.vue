<script setup>
import { ref } from 'vue'
import ChatForm from '@/components/ChatForm.vue'
import { useChatStore } from '../../stores/chat.js'

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
  const date = new Date(s)
  return date.toLocaleString(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })
}

const form = ref()
const submitDisabled = ref(false)

async function submit() {
  if (chat.initialized) return

  const result = await form.value.validate()
  if (!result) return

  form.value.disabled = submitDisabled.value = true
  emit('submitted', result)
}

const prepareMessage = str => str.replace(/\b((https?:\/\/|www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/[^\s]*)?)\b/g, (url) => {
  const href = url.startsWith('http') ? url : `https://${url}`
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

    <button v-if="message.format === 'form'" @click="submit" :disabled="submitDisabled"
            class="chat--button chat--button_chat chat--button_accent">Send
    </button>
  </div>
</template>