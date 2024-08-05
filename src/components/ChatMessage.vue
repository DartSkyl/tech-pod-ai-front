<script setup>

const { message } = defineProps({
  message: {
    type: Object,
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

</script>

<template>
  <div class="chat-message" :class="`chat-message_${message.type}`">
    <div class="chat-message__body" v-html="message.text"></div>
    <div class="chat-message__time">{{ formatDate(message.time) }}</div>
  </div>
</template>

<style scoped lang="scss">

.chat-message {
  margin-bottom: 15px;
  display: flex;
  align-items: flex-end;
  gap: 12px;

  &:first-child {
    margin-top: 20px;
  }

  &__body {
    padding: 20px 30px 20px 15px;
    max-width: 304px;
    font-size: 16px;
    line-height: 19px;
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
      padding-right: 15px;
      color: var(--color-background);
      background: var(--color-primary);
    }
  }
}

</style>