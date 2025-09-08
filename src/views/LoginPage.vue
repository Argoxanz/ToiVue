<script setup lang="ts">
import { ref } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLoading } from '@ionic/vue'
import { useAuth } from '../store/auth'
import { useRouter } from 'vue-router'
import GoogleSignInButton from '../components/GoogleSignInButton.vue'

const email = ref('')
const password = ref('')
const { login, error, loading } = useAuth()
const router = useRouter()

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

async function onSubmit() {
  try {
    await login(email.value, password.value)
    router.replace('/profile')
  } catch (_) {}
}
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Login</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding auth-center">
      <IonLoading :is-open="loading" message="Signing you in..." />
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Welcome back</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <form @submit.prevent="onSubmit" class="stack-md">
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput v-model="email" type="email" required autocomplete="username" />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput v-model="password" type="password" required autocomplete="current-password" />
            </IonItem>
            <div>
              <IonButton type="submit" expand="block" :disabled="loading">Sign In</IonButton>
            </div>
            <div>
              <GoogleSignInButton v-if="googleClientId" :client-id="googleClientId" />
            </div>
            <div class="stack-sm">
              <IonButton fill="clear" router-link="/register">Create account</IonButton>
              <IonButton fill="clear" router-link="/forgot">Forgot password?</IonButton>
            </div>
            <IonText color="danger" v-if="error">{{ error }}</IonText>
          </form>
        </IonCardContent>
      </IonCard>
    </IonContent>
  </IonPage>
  
</template>

<style scoped>
</style>


