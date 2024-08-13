<script setup>
import { onMounted, ref, watch } from 'vue'
import ChatCollapsed from '@/components/ChatCollapsed.vue'
import ChatConversation from '@/components/ChatConversation.vue'
import { useChatStore } from '../stores/chat.js'
import { useNotificationsStore } from '../stores/notifications.js'
import { useMessagesStore } from '../stores/messages.js'

const chat = useChatStore()
const messages = useMessagesStore()
const notifications = useNotificationsStore()

onMounted(() => {
  chat.init()
  messages.init()
  notifications.init()
})

const dialog = ref()

watch(chat, ({ opened }) => {
  if (opened) {
    messages.clearUnread()
    dialog.value.scrollToBottom()
    chat.dismissGreeting()
    if (chat.greeting.timeout) clearTimeout(chat.greeting.timeout)
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

<style scoped lang="scss">

.ricochet-chat {
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  z-index: 2147483647;
  @include for-mobile-up {
    margin: 40px;
  }

  &.expanded {
    max-width: 478px;
    max-height: 738px;
    @include for-mobile-down {
      max-height: var(--rc-app-height, 100vh);
      max-width: 100%;
    }
  }

  &.collapsed {
    max-width: 306px;
    max-height: 111px;
    @include for-mobile-down {
      margin: 15px;
      max-height: 88px;
    }
  }
}

</style>
