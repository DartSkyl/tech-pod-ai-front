<script setup>
import IconClose from '@/components/Icons/IconClose.vue'
import { useChatStore } from '../../stores/chat.js'
import { useMessagesStore } from '../../stores/messages.js'

const chat = useChatStore()
const messages = useMessagesStore()

</script>

<template>
  <div class="chat--collapsed">

    <div v-show="messages.unread > 0 && !chat.greeting"
         class="chat--notifications">{{ messages.unread }}
    </div>

    <Transition name="slide-fade">
      <div v-if="messages.all.length > 0
                && messages.all[0].type === 'incoming'
                && chat.greeting"
           class="chat--greeting">
        <div class="chat--greeting__close">
          <button class="chat--button chat--button_primary chat--button_icon" aria-label="Close message"
                  @click="chat.dismissGreeting()">
            <IconClose/>
          </button>
        </div>
        <div class="chat--greeting__message">
          {{ messages.all[0]?.text }}
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