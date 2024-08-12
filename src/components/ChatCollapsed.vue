<script setup>
import { storeToRefs } from 'pinia'
import IconClose from '@/components/Icons/IconClose.vue'
import { useChatStore } from '../../stores/chat.js'
import { useMessagesStore } from '../../stores/messages.js'

const chat = useChatStore()
const messages = useMessagesStore()

</script>

<template>
  <div class="chat-collapsed">

    <div v-show="messages.unread > 0" class="chat-notifications">{{ messages.unread }}</div>

    <Transition name="slide-fade">
      <div v-if="messages.unread === 0 && chat.greeting.show" class="chat-greeting">
        <div class="chat-greeting__close">
          <button class="button button_primary button_icon" @click="chat.dismissGreeting()" aria-label="Close message">
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
  @include for-mobile-down {
    width: 70px;
    height: 70px;
  }
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
      @include for-mobile-down {
        width: 20px;
        height: 20px;
      }
    }
  }

  &__message {
    padding: 7px 29px;
    font-size: 18px;
    background: var(--color-background);
    border: 1px solid var(--color-primary);
    border-radius: 20px 20px 0 20px;
    transform: translateY(-13px);
    @include for-mobile-down {
      padding-right: 19px;
      padding-left: 19px;
      font-size: 12px;
    }
  }
}

.chat-notifications {
  position: relative;
  margin-right: -20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38.97px;
  height: 28.24px;
  font-weight: 900;
  border-radius: 50% / 50%;
  color: var(--color-background);
  background-color: var(--color-accent);
  transform: translateY(9px);
  z-index: 1;
  @include for-mobile-down {
    width: 25.67px;
    height: 18.67px;
    font-size: 10px;
    transform: translateY(16px);
  }

  &:after {
    position: absolute;
    content: '';
    top: 50%;
    right: -1px;
    width: 9.23px;
    height: 25.88px;
    background-size: 100%;
    background-repeat: no-repeat;
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='26' viewBox='0 0 10 26' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10.0003 26L8.97469 0.117676L0.769531 8.35297L10.0003 26Z' fill='%23EEAC00'/%3E%3C/svg%3E%0A");
    @include for-mobile-down {
      width: 5.83px;
      height: 16.33px;
    }
  }
}

.slide-fade-enter-active {
  transition: all .3s ease-out;
}


.slide-fade-enter-from {
  transform: translateX(20px);
  opacity: 0;
}

</style>