<script setup>
import { ref } from 'vue';
import IconClose from '@/components/Icons/IconClose.vue';
import IconArrow from '@/components/Icons/IconArrow.vue';
import IconMute from '@/components/Icons/IconMute.vue';
import IconSound from '@/components/Icons/IconSound.vue';
import ChatMessage from '@/components/ChatMessage.vue';

const sendMessageDisabled = ref(false)
const muted = ref(false)

const input = ref('')

const messages = ref([
  {
    type: 'incoming',
    time: '2024-08-04 22:25:49',
    text: 'Hello. Welcome to Ricochet Fuel Distributors, Inc.! I am a Live Person here to help.'
  },
  {
    type: 'outgoing',
    time: '2024-08-04 22:28:49',
    text: 'Hello!'
  },
  {
    type: 'incoming',
    time: '2024-08-04 22:29:49',
    text: 'Hello. Which of our services are you interested in?'
  },
  {
    type: 'incoming',
    time: '2024-08-04 22:40:49',
    text: 'Are you there?'
  },
  {
    type: 'outgoing',
    time: '2024-08-04 23:28:49',
    text: 'End chat'
  }
])

const sendMessage = () => {
  if (input.value.length < 1) return

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  messages.value.push({
    type: 'outgoing',
    time: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    text: input.value
  })

  input.value = ''
}

</script>

<template>
  <div class="chat-conversation">
    <div class="chat-close">
      <button class="button button_icon" @click="$emit('collapse')" aria-label="Collapse chat">
        <IconClose/>
      </button>
    </div>

    <div class="chat-body">
      <div class="chat-header">
        <div class="chat-container">
          <div class="chat-operator">
            <div class="chat-operator__name">Bot Name</div>
            <div class="chat-operator__status status-online">Online</div>
          </div>

          <div class="chat-sound">
            <button class="button button_icon" @click="muted = !muted"
                    :aria-label="muted ? 'Enable sounds' : 'Mute sounds'">
              <IconMute v-if="muted"/>
              <IconSound v-else/>
            </button>
          </div>

          <div class="chat-avatar">
            <div class="chat-avatar__wrapper">
              <img src="/bot.svg" alt="">
            </div>
            <span class="chat-avatar__status status-online"></span>
          </div>
        </div>
      </div>

      <div class="chat-main">
        <div class="chat-container">
          <ChatMessage v-for="(message, i) in messages" :key="i" :message="message"/>
        </div>
      </div>

      <div class="chat-footer">
        <div class="chat-container">
          <span>Created by <a target="_blank" href="https://itinkers.pro"><img src="/itinkers.svg"
                                                                               alt="iTinkers"></a></span>
          <span><a target="_blank" href="#">Privacy Policy</a></span>
        </div>
      </div>

      <div class="chat-input">
        <div class="chat-container">
          <input v-model="input" @keydown.enter="sendMessage" placeholder="Type your message...">
          <div class="chat-input__buttons">
            <button class="button button_icon" aria-label="Send a message"
                    @click="sendMessage" :disabled="sendMessageDisabled">
              <IconArrow/>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

.chat-body {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-background);
  box-shadow: 4px 4px 30px rgba(0, 0, 0, .1);
  border-radius: 20px;
}

.chat-close {
  position: absolute;
  top: -10px;
  right: 0;
  transform: translateY(-100%);

  .button {
    width: 36px;
    height: 36px;
    color: var(--color-background);
    background: var(--color-primary);
  }
}

.chat-conversation {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-footer {
  padding: 20px 0 12px;
  font-size: 12px;
  font-weight: 300;

  .chat-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start
  }

  img {
    display: inline-block;
    height: 1em;
  }
}

.chat-header {
  padding: 30px 0;
  border-bottom: 1px solid var(--color-border);

  .chat-container {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .chat-avatar {
    margin-left: auto;
    flex-shrink: 0;

    &__wrapper {
      width: 59px;
      height: 59px;
    }
  }
}

.chat-input {
  padding: 12px 0;
  border-top: 1px solid var(--color-border);

  &__buttons {

    .button {
      width: 40px;
      height: 40px;
      color: var(--color-background);
      background: var(--color-primary);

      &:disabled {
        cursor: default;
      }
    }
  }

  .chat-container {
    display: flex;
  }

  input {
    padding: 0 20px 0 0;
    flex-grow: 1;
    font-size: 16px;
    line-height: 19px;
    background: transparent;
    border: 0;
    outline: none;

    &::placeholder {
      color: var(--color-text-muted);
      opacity: 1;
    }

    &::-ms-input-placeholder {
      color: var(--color-text-muted);
    }
  }
}

.chat-main {
  padding-top: 3px;
  padding-right: 2px;
  flex-grow: 1;
  overflow: hidden;

  .chat-container {
    height: 100%;
    overflow-y: auto;
    overscroll-behavior-y: contain;

    &::-webkit-scrollbar {
      margin-top: 3px;
      width: 5px;
    }

    &::-webkit-scrollbar-track,
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
    }

    &::-webkit-scrollbar-track {
      background-color: var(--color-background-mute);
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--color-primary);
    }
  }
}

.chat-operator {

  &__name {
    font-family: Coda, Roboto, -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 24px;
    line-height: 34px;
  }

  &__status {
    font-size: 16px;
    line-height: 19px;
    text-transform: lowercase;

    &.status-online {
      color: var(--rc-color-green);
    }
  }
}

.chat-sound {

  .button {
    width: 29px;
    height: 29px;
    border-radius: 0;
  }
}

</style>