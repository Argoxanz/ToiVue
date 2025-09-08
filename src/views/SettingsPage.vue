<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-list-header>
          <ion-label>Budget</ion-label>
        </ion-list-header>
        <ion-item>
          <ion-label>Currency</ion-label>
          <ion-note slot="end">KZT</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Reminders</ion-label>
          <ion-note slot="end">7 / 3 / 1 days</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonLabel, IonNote } from '@ionic/vue'
</script>


