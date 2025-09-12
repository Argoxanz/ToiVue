<script setup lang="ts">
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue'
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { healthCheck } from './api/health'
import { personOutline, walletOutline, listOutline } from 'ionicons/icons'

const { t: $t } = useI18n()

const healthy = ref(true)
const route = useRoute()

const showTabs = computed(() => {
  // Show tabs only for authenticated routes
  return route.meta.requiresAuth === true
})

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
      <IonTabBar v-if="showTabs" slot="bottom">
        <IonTabButton tab="profile" href="/profile" aria-label="Profile">
          <IonIcon :icon="personOutline" />
          <IonLabel>{{ $t('common.profile') }}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="budget" href="/budget" aria-label="Budget">
          <IonIcon :icon="walletOutline" />
          <IonLabel>{{ $t('common.budget') }}</IonLabel>
        </IonTabButton>
        <IonTabButton tab="checklists" href="/checklists" aria-label="Checklists">
          <IonIcon :icon="listOutline" />
          <IonLabel>{{ $t('checklists.title') }}</IonLabel>
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
