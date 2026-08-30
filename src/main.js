import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import './style.css'
import 'cropperjs/dist/cropper.css'
import App from './App.vue'

import en from './locales/en.json'
import zhtw from './locales/zh-tw.json'

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-tw': zhtw
  }
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')
