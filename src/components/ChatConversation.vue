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
  if (!chat.initialized) return
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

watch(chat, ({ typing }) => {
  if (typing) scrollToBottom()
})

const dialog = ref()

function scrollToBottom() {
  nextTick(() => {
    dialog.value.scrollTop = dialog.value.scrollHeight
  })
}

defineExpose({
  scrollToBottom
})

const botName = import.meta.env.VITE_BOT_NAME ?? 'Manager'
const privacyPolicyUrl = import.meta.env.VITE_PRIVACY_POLICY_URL ?? false

</script>

<template>
  <div class="chat--conversation">
    <div class="chat--conversation__close">
      <button class="chat--button chat--button_icon" @click="$emit('collapse')" aria-label="Collapse chat">
        <IconClose/>
      </button>
    </div>

    <div class="chat--conversation__body">
      <div class="chat--conversation__header">
        <div class="chat--container">
          <div class="chat--avatar">
            <div class="chat--avatar__wrapper">
              <img src="/bot.svg" alt="">
            </div>
            <span class="chat--avatar__status"
                  :class="chat.connected ? 'chat--status-online' : 'chat--status-offline'"></span>
          </div>

          <div class="chat--operator">
            <div class="chat--operator__name">
              {{ botName }}
              <button class="chat--button chat--button_icon" @click="notifications.toggle()"
                      :aria-label="notifications.muted ? 'Enable sounds' : 'Mute sounds'">
                <IconMute v-if="notifications.muted"/>
                <IconSound v-else/>
              </button>
            </div>
            <div class="chat--operator__status"
                 :class="chat.connected ? 'chat--status-online' : 'chat--status-offline'">
              {{ chat.connected ? 'Online' : 'Offline' }}
            </div>
          </div>
        </div>
      </div>

      <div class="chat--conversation__main">
        <div class="chat--container" ref="dialog">
          <ChatMessage v-for="(message, i) in messages" :key="i"
                       :time="!messages[i+1] || messages[i+1].type !== message.type"
                       :message="message" @submitted="chat.socket.send(JSON.stringify($event))"/>

          <div v-show="chat.typing" class="chat--conversation__typing"></div>
        </div>
      </div>

      <div class="chat--conversation__footer">
        <div class="chat--container">
          <span>Created by <a target="_blank" href="https://itinkers.pro">
            <img src="/itinkers.svg" alt="iTinkers"></a>
          </span>
          <span v-if="privacyPolicyUrl"><a target="_blank" :href="privacyPolicyUrl">Privacy Policy</a></span>
        </div>
      </div>

      <div class="chat--conversation__input">
        <div class="chat--container">
          <input v-model="input" :disabled="!chat.initialized" @keydown.enter="send"
                 :placeholder="chat.initialized ? 'Type your message...' : 'Please fill in the form to start'"
                 name="chat-conversation-input" id="chat-conversation-input">
          <div>
            <button class="chat--button chat--button_icon chat--button_primary" aria-label="Send a message"
                    :disabled="!chat.initialized" @click="send">
              <IconArrow/>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>