<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t('settings.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-list-header>
          <ion-label>{{ $t('settings.budget') }}</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-label>{{ $t('settings.currency') }}</ion-label>
          <ion-note slot="end">KZT</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>{{ $t('settings.reminders') }}</ion-label>
          <ion-note slot="end">7 / 3 / 1 days</ion-note>
        </ion-item>
      </ion-list>
      
      <ion-list>
        <ion-list-header>
          <ion-label>{{ $t('settings.language') }}</ion-label>
        </ion-list-header>
        <LanguageSwitcher />
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonLabel, IonNote } from '@ionic/vue';
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import './SettingsPage.css';
</script>


