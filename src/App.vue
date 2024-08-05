<script setup>
import { ref } from 'vue';
import ChatCollapsed from '@/components/ChatCollapsed.vue';
import ChatConversation from '@/components/ChatConversation.vue';

const collapsed = ref(true)

</script>

<template>
  <div class="ricochat" :class="collapsed ? 'collapsed' : 'expanded'">
    <ChatCollapsed v-if="collapsed" @expand="collapsed = false"/>
    <ChatConversation v-else @collapse="collapsed = true"/>
  </div>
</template>

<style scoped lang="scss">

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
