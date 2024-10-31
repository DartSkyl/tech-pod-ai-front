<script setup>
import { onMounted, ref, watch } from 'vue'
import ChatCollapsed from '@/components/ChatCollapsed.vue'
import ChatConversation from '@/components/ChatConversation.vue'
import { useChatStore } from '../stores/chat.js'
import { useMessagesStore } from '../stores/messages.js'
import { useGreetingStore } from '../stores/greeting.js'

const chat = useChatStore()
const greeting = useGreetingStore()
const messages = useMessagesStore()

onMounted(() => chat.init())

const dialog = ref()

watch(chat, ({ opened }) => {
  if (opened) {
    messages.clearUnread()
    dialog.value.scrollToBottom()
    greeting.dismiss()
    if (greeting.timeout) clearTimeout(greeting.timeout)
  }
}, { deep: true })


document.addEventListener('DOMContentLoaded', () => {
  const setAppHeight = () => {
    document.documentElement.style.setProperty('--rc-app-height', `${window.innerHeight}px`)
  }
  window.addEventListener('resize', setAppHeight)
  setAppHeight()
})

</script>

<template>
  <div class="ricochet-chat" :class="chat.opened ? 'expanded' : 'collapsed'">
    <ChatConversation ref="dialog" v-show="chat.opened" @collapse="chat.opened = false"/>
    <ChatCollapsed v-show="!chat.opened" @expand="chat.opened = true"/>
  </div>
</template>