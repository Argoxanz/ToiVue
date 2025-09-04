<script setup lang="ts">
import { IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/vue'
import { people, home } from 'ionicons/icons'
</script>

<template>
  <IonTabs>
    <IonRouterOutlet />
    <IonTabBar slot="bottom">
      <IonTabButton tab="guests" href="/tabs/guests">
        <IonIcon :icon="people" />
        <IonLabel>Guests</IonLabel>
      </IonTabButton>
      <IonTabButton tab="home" href="/tabs/home">
        <IonIcon :icon="home" />
        <IonLabel>Home</IonLabel>
      </IonTabButton>
    </IonTabBar>
  </IonTabs>
</template>


