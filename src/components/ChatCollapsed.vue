<script setup>
import IconClose from '@/components/Icons/IconClose.vue'
import { useChatStore } from '../../stores/chat.js'
import { useMessagesStore } from '../../stores/messages.js'

const chat = useChatStore()
const messages = useMessagesStore()

</script>

<template>
  <div class="chat--collapsed">

    <div v-show="messages.unread > 0" class="chat--notifications">{{ messages.unread }}</div>

    <Transition name="slide-fade">
      <div v-if="messages.unread === 0 && chat.greeting.show" class="chat--greeting">
        <div class="chat--greeting__close">
          <button class="chat--button chat--button_primary chat--button_icon" aria-label="Close message"
                  @click="chat.dismissGreeting()">
            <IconClose/>
          </button>
        </div>
        <div class="chat--greeting__message">
          Hello! Can I help you?
        </div>
      </div>
    </Transition>

    <button @click="$emit('expand')" class="chat--collapsed__entry chat--avatar" aria-label="Open chat">
      <span class="chat--avatar__wrapper">
        <img src="/bot.svg" alt="Ricochat">
      </span>
    </button>
  </div>
</template>