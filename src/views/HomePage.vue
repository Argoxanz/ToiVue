<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/vue'
import { rocket } from 'ionicons/icons'
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>ToiVue</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <h1>Welcome to Ionic Vue 3</h1>
      <p>This starter is powered by Vite + Vue 3 + Ionic.</p>
      <IonButton color="primary">
        <IonIcon :icon="rocket" slot="start" />
        Get Started
      </IonButton>
    </IonContent>
  </IonPage>
  
</template>

<style scoped>
h1 {
  margin-bottom: 0.5rem;
}
p {
  margin-bottom: 1rem;
}
</style>


