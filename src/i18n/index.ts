import { createI18n } from 'vue-i18n'
import ru from './locales/ru.json'
import en from './locales/en.json'
import kz from './locales/kz.json'

const messages = {
  ru,
  en,
  kz
}

const i18n = createI18n({
  legacy: false,
  locale: 'ru', // default locale
  fallbackLocale: 'ru',
  messages,
  globalInjection: true
})

export default i18n
