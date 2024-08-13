import { createApp, defineCustomElement } from 'vue'
import { createPinia } from 'pinia'

import WebComponent from './RicochetChat.ce.vue'
import App from './RicochetChat.vue'

createApp(App)
  .use(createPinia())
  .mount('#ricochet-chat')

customElements.define('ricochet-chat', defineCustomElement(WebComponent))