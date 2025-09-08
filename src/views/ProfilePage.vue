<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonButton } from '@ionic/vue'
import { onMounted } from 'vue'
import { useAuth } from '../store/auth'
import { useRouter } from 'vue-router'

const { user, loadUserIfAuthenticated, logout } = useAuth()
const router = useRouter()

onMounted(async () => {
  await loadUserIfAuthenticated()
  if (!user.value) {
    router.replace('/login')
  }
})

async function onLogout() {
  await logout()
  router.replace('/login')
}
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Profile</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <template v-if="user">
        <IonItem>
          <IonLabel>
            <h2>{{ user.name }}</h2>
            <p>Email: {{ user.email || '—' }}</p>
            <p>Phone: {{ user.phone || '—' }}</p>
            <p>Role: {{ user.role }}</p>
          </IonLabel>
        </IonItem>
        <div class="ion-padding-top" style="display:grid;gap:8px;grid-auto-flow:column;justify-content:start;">
          <IonButton router-link="/checklists">My Checklists</IonButton>
          <IonButton color="medium" @click="onLogout">Logout</IonButton>
        </div>
      </template>
    </IonContent>
  </IonPage>
  
</template>

<style scoped>
</style>


