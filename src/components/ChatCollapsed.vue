<script setup>
import IconClose from '@/components/Icons/IconClose.vue'
import { useMessagesStore } from '../../stores/messages.js'
import { useGreetingStore } from '../../stores/greeting.js'

const messages = useMessagesStore()
const greeting = useGreetingStore()

const apiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

</script>

<template>
  <div class="chat--collapsed">
    <div v-show="messages.unread > 0 && !greeting.shown"
         class="chat--notifications">{{ messages.unread }}
    </div>

    <Transition name="slide-fade">
      <div v-if="greeting.shown"
           class="chat--greeting">
        <div class="chat--greeting__close">
          <button class="chat--button chat--button_primary chat--button_icon" aria-label="Close message"
                  @click="greeting.dismiss()">
            <IconClose/>
          </button>
        </div>
        <div class="chat--greeting__message">
          {{ greeting.text }}
        </div>
      </div>
    </Transition>

    <button @click="$emit('expand')" class="chat--collapsed__entry chat--avatar" aria-label="Open chat">
      <span class="chat--avatar__wrapper">
        <img :src="`${apiUrl}/bot.svg`" alt="Ricochet Chat">
      </span>
    </button>
  </div>
</template>