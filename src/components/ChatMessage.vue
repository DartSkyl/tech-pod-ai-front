<script setup>

import { ref } from 'vue';
import ChatForm from '@/components/ChatForm.vue';

const { message, time } = defineProps({
  message: {
    type: Object,
    required: true
  },
  time: {
    type: Boolean,
    required: true
  }
})

function formatDate(s) {
  const [date, time] = s.split(' ');

  let [hour, minute] = time.split(':');

  hour = parseInt(hour, 10);

  const period = hour >= 12 ? 'pm' : 'am';

  hour = hour % 12;
  hour = hour ? hour : 12;

  return `${hour}:${minute} ${period}`;
}

const form = ref()

async function submit() {
  const result = await form.value.validate()
  if (!result) return

  console.log('Form submitted, ', result)
}

</script>

<template>
  <div class="chat-message" :class="`chat-message_${message.type}`">
    <div class="chat-message__body">
      <div class="chat-message__wrapper" v-html="message.text"></div>
    </div>

    <ChatForm ref="form" v-if="message.format === 'form'"/>

    <div v-if="time" class="chat-message__time">{{ formatDate(message.time) }}</div>

    <button v-if="message.format === 'form'" @click="submit"
            class="button button_chat button_accent">Send
    </button>
  </div>
</template>

<style scoped lang="scss">

.chat-message {
  margin-bottom: 15px;
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 10px 12px;

  &:first-child {
    margin-top: 20px;
  }

  &__body {
    padding: 20px 30px 20px 15px;
    max-width: var(--rc-message-width);
    min-width: 100px;
    background: var(--color-background-mute);
  }

  &__time {
    font-weight: 300;
    font-size: 12px;
    line-height: 14px;
    white-space: nowrap;
    opacity: .6;
  }

  &_outgoing {
    flex-direction: row-reverse;

    .chat-message__body {
      padding: 13px 19px;
      color: var(--color-background);
      background: var(--color-primary);
    }

    .chat-message__wrapper {
      margin: 0 auto;
      width: fit-content;
    }
  }
}

</style>