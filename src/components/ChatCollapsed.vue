<script setup>
import { ref } from 'vue';
import IconClose from '@/components/Icons/IconClose.vue';

const showGreeting = ref(true)
const notifications = ref(0)
</script>

<template>
  <div class="chat-collapsed">
    <div v-show="notifications > 0" class="chat-notifications">{{ notifications }}</div>
    <div v-show="notifications === 0 && showGreeting" class="chat-greeting">
      <div class="chat-greeting__close">
        <button class="button button_primary button_icon" @click="showGreeting = false" aria-label="Close message">
          <IconClose/>
        </button>
      </div>
      <div class="chat-greeting__message">
        Hello! Can I help you?
      </div>
    </div>
    <button @click="$emit('expand')" class="chat-entry chat-avatar" aria-label="Open chat">
      <span class="chat-avatar__wrapper">
        <img src="/bot.svg" alt="Ricochat">
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">

.chat-collapsed {
  display: flex;
  align-items: flex-start;
}

.chat-entry {
  margin-top: 18px;
  margin-left: auto;
  padding: 0;
  display: block;
  flex-shrink: 0;
  width: 93px;
  height: 93px;
  background: none;
  border: none;
  appearance: none;
  cursor: pointer;
}

.chat-greeting {
  margin-right: -20px;
  display: flex;
  flex-direction: column;
  z-index: 1;

  &__close {
    margin-left: auto;
    z-index: 1;

    .button {
      width: 25px;
      height: 25px;
    }
  }

  &__message {
    padding: 8px 29px;
    font-size: 18px;
    background: var(--color-background);
    border: 1px solid var(--color-primary);
    border-radius: 20px 20px 0 20px;
    transform: translateY(-13px);
  }
}

</style>