<script setup>
import IconClose from '@/components/Icons/IconClose.vue';
import { useChatStore } from '../../stores/chat.js';
import { useNotificationsStore } from '../../stores/notifications.js';
import { storeToRefs } from 'pinia';

const store = useChatStore()
const { notifications } = storeToRefs(useNotificationsStore())

</script>

<template>
  <div class="chat-collapsed">
    <div v-show="notifications > 0" class="chat-notifications">{{ notifications }}</div>
    <Transition name="slide-fade">
      <div v-if="notifications === 0 && store.greeting" class="chat-greeting">
        <div class="chat-greeting__close">
          <button class="button button_primary button_icon" @click="store.dismissGreeting()" aria-label="Close message">
            <IconClose/>
          </button>
        </div>
        <div class="chat-greeting__message">
          Hello! Can I help you?
        </div>
      </div>
    </Transition>
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
  justify-content: flex-end;
}

.chat-entry {
  margin-top: 18px;
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

.chat-notifications {
  margin-right: -20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2em;
  height: 2em;
  font-size: 12px;
  border-radius: 50%;
  color: var(--color-background);
  background-color: var(--color-accent);
  transform: translateY(20px);
  z-index: 1;
}

.slide-fade-enter-active {
  transition: all .3s ease-out;
}

.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

</style>