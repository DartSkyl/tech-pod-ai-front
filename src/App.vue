<script setup>
import { onMounted, ref, watch } from 'vue';
import ChatCollapsed from '@/components/ChatCollapsed.vue';
import ChatConversation from '@/components/ChatConversation.vue';
import { useChatStore } from '../stores/chat.js';
import { useNotificationsStore } from '../stores/notifications.js';

const chat = useChatStore()
const notifications = useNotificationsStore()

onMounted(() => {
  chat.init()
  chat.showGreeting()
  notifications.init()
})

const dialog = ref()

watch(chat, ({ opened }) => {
  if (opened) {
    notifications.clear()
    dialog.value.scrollToBottom()
  }
}, { deep: true })

</script>

<template>
  <div class="ricochat" :class="chat.opened ? 'expanded' : 'collapsed'">
    <ChatConversation ref="dialog" v-show="chat.opened" @collapse="chat.opened = false"/>
    <ChatCollapsed v-show="!chat.opened" @expand="chat.opened = true"/>
  </div>
</template>

<style scoped lang="scss">

/*.scale-enter-active,
.scale-leave-active {
  transition: transform .5s ease;
}

.scale-enter-from,
.scale-leave-to {
  transform: scale(0);
}*/

.ricochat {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 40px;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
  z-index: 2147483647;

  &.expanded {
    max-width: 478px;
    max-height: 738px;
  }

  &.collapsed {
    max-width: 306px;
    max-height: 111px;
  }
}

</style>
