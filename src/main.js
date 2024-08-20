import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './RicochetChat.vue'
import './assets/styles/main.scss'

createApp(App)
  .use(createPinia())
  .mount('#ricochet-chat')
