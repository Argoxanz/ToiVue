import { defineStore } from 'pinia'
import { ref } from 'vue'
import i18n from '@/i18n'

export type SupportedLocale = 'ru' | 'en' | 'kz'

export const useLanguageStore = defineStore('language', () => {
  const currentLocale = ref<SupportedLocale>('ru')
  
  const availableLocales: { code: SupportedLocale; name: string; nativeName: string }[] = [
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'kz', name: 'Kazakh', nativeName: 'Қазақша' }
  ]

  function setLocale(locale: SupportedLocale) {
    currentLocale.value = locale
    i18n.global.locale.value = locale
    localStorage.setItem('preferred-locale', locale)
  }

  function initializeLocale() {
    const savedLocale = localStorage.getItem('preferred-locale') as SupportedLocale
    if (savedLocale && availableLocales.some(l => l.code === savedLocale)) {
      setLocale(savedLocale)
    } else {
      // Default to Russian
      setLocale('ru')
    }
  }

  function getLocaleName(locale: SupportedLocale): string {
    const localeInfo = availableLocales.find(l => l.code === locale)
    return localeInfo?.nativeName || localeInfo?.name || locale
  }

  return {
    currentLocale,
    availableLocales,
    setLocale,
    initializeLocale,
    getLocaleName
  }
})
