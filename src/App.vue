<script setup lang="ts">
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue'
import { onMounted, ref } from 'vue'
import { healthCheck } from './api/health'
import { personOutline, walletOutline, listOutline } from 'ionicons/icons'

const healthy = ref(true)
onMounted(async () => {
  try {
    const res = await healthCheck()
    healthy.value = res.status === 'ok'
  } catch {
    healthy.value = false
  }
})
</script>

<template>
  <IonApp>
    <IonTabs>
      <IonRouterOutlet />
      <IonTabBar slot="bottom">
        <IonTabButton tab="profile" href="/profile" aria-label="Profile">
          <IonIcon :icon="personOutline" />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
        <IonTabButton tab="budget" href="/budget" aria-label="Budget">
          <IonIcon :icon="walletOutline" />
          <IonLabel>Budget</IonLabel>
        </IonTabButton>
        <IonTabButton tab="checklists" href="/checklists" aria-label="Checklists">
          <IonIcon :icon="listOutline" />
          <IonLabel>Checklists</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
    <div v-if="!healthy" style="position:fixed;bottom:0;left:0;right:0;padding:8px;background:#fee2e2;color:#991b1b;text-align:center;">
      Backend unreachable. Check API base URL.
    </div>
  </IonApp>
  
</template>

<style>
</style>
