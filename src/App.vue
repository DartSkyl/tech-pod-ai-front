<script setup>
import { ref } from 'vue';
import IconClose from '@/components/Icons/IconClose.vue';

const collapsed = ref(true)

const sendMessageDisabled = ref(false)

const muted = ref(false)

// todo

</script>

<template>
  <div class="ricochat">
    <div v-if="collapsed" class="chat-collapsed">
      <div class="chat-greeting">Hello! Can I help you?</div>
      <div class="chat-notifications">2</div>
      <button v-show="collapsed" @click="collapsed = false" class="chat-entry" aria-label="Open chat"></button>
    </div>

    <div v-else class="chat-conversation">
      <div class="chat-close">
        <button @click="collapsed = true" aria-label="Collapse chat">
          <IconClose/>
        </button>
      </div>

      <div class="chat-body">
        <div class="header operator">
          <div class="header__left">
            <div class="operator__name">Bot Name</div>
            <div class="operator__status">Online</div>
            <button class="sound" :aria-label="muted ? 'Enable sounds' : 'Mute sounds'"></button>
          </div>
          <div class="header__right">
            <div class="avatar">
              <img src="" alt="">
              <span class="avatar__status"></span>
            </div>
          </div>
        </div>

        <div class="main">

        </div>

        <div class="input">
          <textarea class="input__field" placeholder="Type your message..."></textarea>
          <div class="input__buttons">
            <button aria-label="Send a message" :disabled="sendMessageDisabled"></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.ricochat {
  position: fixed;
  right: 0;
  bottom: 0;
  padding: 40px;
  width: 100%;
  height: 100%;
  max-width: 478px;
  max-height: 738px;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  z-index: 2147483639;
}

</style>
