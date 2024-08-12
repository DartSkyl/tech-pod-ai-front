<script setup>
import { nextTick, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import IconClose from '@/components/Icons/IconClose.vue'
import IconArrow from '@/components/Icons/IconArrow.vue'
import IconMute from '@/components/Icons/IconMute.vue'
import IconSound from '@/components/Icons/IconSound.vue'
import ChatMessage from '@/components/ChatMessage.vue'
import { useMessagesStore } from '../../stores/messages.js'
import { useNotificationsStore } from '../../stores/notifications.js'
import { useChatStore } from '../../stores/chat.js'

const chat = useChatStore()
const notifications = useNotificationsStore()
const { all: messages } = storeToRefs(useMessagesStore())

const input = ref('')

const send = () => {
  if (input.value.length < 1) return

  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  messages.value.push({
    text: input.value,
    time: `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`,
    type: 'outgoing'
  })

  const message = input.value
  input.value = ''

  setTimeout(() => {
    chat.socket.send(message)
    scrollToBottom()
  }, 1000)
}

watch(messages, () => {
  scrollToBottom()
}, {
  deep: true
})

// todo do another way
watch(chat, ({ typing }) => {
  if (typing) scrollToBottom()
}, { deep: true })

const dialog = ref()

function scrollToBottom() {
  nextTick(() => {
    dialog.value.scrollTop = dialog.value.scrollHeight
  })
}

defineExpose({
  scrollToBottom
})

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
          <div class="chat-avatar">
            <div class="chat-avatar__wrapper">
              <img src="/bot.svg" alt="">
            </div>
            <span class="chat-avatar__status" :class="chat.connected ? 'status-online' : 'status-offline'"></span>
          </div>

          <div class="chat-operator">
            <div class="chat-operator__name">
              Bot Name
              <div class="chat-sound">
                <button class="button button_icon" @click="notifications.toggle()"
                        :aria-label="notifications.muted ? 'Enable sounds' : 'Mute sounds'">
                  <IconMute v-if="notifications.muted"/>
                  <IconSound v-else/>
                </button>
              </div>
            </div>
            <div class="chat-operator__status" :class="chat.connected ? 'status-online' : 'status-offline'">
              {{ chat.connected ? 'Online' : 'Offline' }}
            </div>
          </div>
        </div>
      </div>

      <div class="chat-main">
        <div class="chat-container" ref="dialog">
          <ChatMessage v-for="(message, i) in messages" :key="i"
                       :time="!messages[i+1] || messages[i+1].type !== message.type"
                       :message="message" @submitted="chat.socket.send(JSON.stringify($event))"/>

          <div v-show="chat.typing" class="chat-typing"></div>
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
          <input v-model="input" @keydown.enter="send" placeholder="Type your message...">
          <div class="chat-input__buttons">
            <button class="button button_icon button_primary" aria-label="Send a message"
                    @click="send">
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
  @include for-mobile-up {
    box-shadow: 4px 4px 30px rgba(0, 0, 0, .1);
    border-radius: 20px;
  }
}

.chat-close {
  position: absolute;
  top: 30px;
  right: 15px;
  @include for-mobile-up {
    top: -10px;
    right: 0;
    transform: translateY(-100%);
  }

  .button {
    width: 26px;
    height: 26px;
    color: var(--color-background);
    background: var(--color-primary);
    @include for-mobile-up {
      width: 36px;
      height: 36px;
    }
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
  @include for-mobile-down {
    padding: 20px 0;
  }

  .chat-container {
    display: flex;
    align-items: center;
    gap: 12px;
    @include for-mobile-down {
      gap: 6px;
    }
  }

  .chat-avatar {
    flex-shrink: 0;
    @include for-mobile-up {
      margin-left: auto;
      order: 3;
    }

    &__wrapper {
      width: 59px;
      height: 59px;
    }
  }
}

.chat-hint {
  margin-top: 20px;
  text-align: right;
  font-style: italic;
  opacity: .5;
}

.chat-input {
  padding: 12px 0;
  border-top: 1px solid var(--color-border);

  .button {
    width: 40px;
    height: 40px;
    @include for-mobile-down {
      width: 30px;
      height: 30px;
    }
  }

  .chat-container {
    display: flex;
  }

  input {
    padding: 0 20px 0 0;
    flex-grow: 1;
    font-size: 16px;
    background: transparent;
    border: 0;
    outline: none;

    &::placeholder {
      opacity: .3;
    }
  }
}

.chat-main {
  padding-top: 3px;
  padding-right: 2px;
  flex-grow: 1;
  overflow: hidden;
  @include for-mobile-down {
    padding-right: 4px;
  }

  .chat-container {
    height: 100%;
    overflow-x: hidden;
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
    line-height: 1.4;
    @include for-mobile-down {
      font-size: 22px;
    }

    .chat-sound {
      margin-left: 12px;
      display: inline-block;
      vertical-align: sub;
    }
  }

  &__status {
    line-height: 1.2;
    text-transform: lowercase;

    &.status-online {
      color: var(--rc-color-green);
    }

    &.status-offline {
      color: var(--rc-color-red);
    }
  }
}

.chat-typing {
  margin-bottom: 20px;
  width: 57px;
  height: 21px;
  background-color: var(--color-primary);
  background-image: url("data:image/svg+xml,%3Csvg width='23' height='5' viewBox='0 0 23 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 2.5C5 3.88071 3.88071 5 2.5 5C1.11929 5 0 3.88071 0 2.5C0 1.11929 1.11929 0 2.5 0C3.88071 0 5 1.11929 5 2.5Z' fill='white'/%3E%3Cpath d='M14 2.5C14 3.88071 12.8807 5 11.5 5C10.1193 5 9 3.88071 9 2.5C9 1.11929 10.1193 0 11.5 0C12.8807 0 14 1.11929 14 2.5Z' fill='white'/%3E%3Cpath d='M23 2.5C23 3.88071 21.8807 5 20.5 5C19.1193 5 18 3.88071 18 2.5C18 1.11929 19.1193 0 20.5 0C21.8807 0 23 1.11929 23 2.5Z' fill='white'/%3E%3C/svg%3E%0A");
  background-repeat: no-repeat;
  background-position: center center;
  border-radius: 10px;
  animation: typing infinite alternate 2s;
}

.chat-sound {

  .button {
    width: 29px;
    height: 29px;
    border-radius: 0;
  }
}

@keyframes typing {
  from {
    opacity: 1;
  }
  to {
    opacity: .05;
  }
}

</style>