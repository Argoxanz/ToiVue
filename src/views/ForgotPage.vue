<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue'
import { useAuth } from '../store/auth'

const email = ref('')
const message = ref('')
const { forgot } = useAuth()

async function onSubmit() {
  const res = await forgot(email.value)
  message.value = res.message
}
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Forgot Password</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding auth-center">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Password reset</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <form @submit.prevent="onSubmit" class="stack-md">
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput v-model="email" type="email" required />
            </IonItem>
            <div>
              <IonButton type="submit" expand="block">Send reset link</IonButton>
            </div>
            <IonText v-if="message">{{ message }}</IonText>
          </form>
        </IonCardContent>
      </IonCard>
    </IonContent>
  </IonPage>
  
</template>

<style scoped>
</style>


