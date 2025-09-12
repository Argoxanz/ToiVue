<template>
  <ion-item button @click="openLanguageSelector">
    <ion-icon :icon="languageIcon" slot="start"></ion-icon>
    <ion-label>{{ $t('settings.language') }}</ion-label>
    <ion-note slot="end">{{ languageStore.getLocaleName(languageStore.currentLocale) }}</ion-note>
  </ion-item>

  <ion-popover :is-open="isPopoverOpen" @didDismiss="isPopoverOpen = false">
    <ion-content>
      <ion-list>
        <ion-list-header>
          <ion-label>{{ $t('settings.language') }}</ion-label>
        </ion-list-header>
        <ion-item 
          v-for="locale in languageStore.availableLocales" 
          :key="locale.code"
          button 
          @click="selectLanguage(locale.code)"
          :class="{ 'selected': locale.code === languageStore.currentLocale }"
        >
          <ion-label>{{ locale.nativeName }}</ion-label>
          <ion-icon 
            v-if="locale.code === languageStore.currentLocale" 
            :icon="checkmarkIcon" 
            slot="end"
            color="primary"
          ></ion-icon>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-popover>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  IonItem, 
  IonIcon, 
  IonLabel, 
  IonNote, 
  IonPopover, 
  IonContent, 
  IonList, 
  IonListHeader 
} from '@ionic/vue'
import { language, checkmark } from 'ionicons/icons'
import { useLanguageStore, type SupportedLocale } from '@/store/language'

const languageStore = useLanguageStore()
const isPopoverOpen = ref(false)

const languageIcon = language
const checkmarkIcon = checkmark

function openLanguageSelector() {
  isPopoverOpen.value = true
}

function selectLanguage(locale: SupportedLocale) {
  languageStore.setLocale(locale)
  isPopoverOpen.value = false
}
</script>

<style scoped>
.selected {
  --background: var(--ion-color-primary-tint);
  --color: var(--ion-color-primary-contrast);
}
</style>
