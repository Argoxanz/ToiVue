<script setup lang="ts">
import { reactive } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLoading } from '@ionic/vue'
import { useAuth } from '../store/auth'
import { useRouter } from 'vue-router'
import GoogleSignInButton from '../components/GoogleSignInButton.vue'

const form = reactive({ name: '', email: '', phone: '', password: '' })
const { register, error, loading } = useAuth()
const router = useRouter()
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string

async function onSubmit() {
  try {
    await register(form.name, { email: form.email, phone: form.phone }, form.password)
    router.replace('/profile')
  } catch (_) {}
}
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Register</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding auth-center">
      <IonLoading :is-open="loading" message="Creating your account..." />
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Create your account</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <form @submit.prevent="onSubmit" class="stack-md">
            <IonItem>
              <IonLabel position="stacked">Full name</IonLabel>
              <IonInput v-model="form.name" required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput v-model="form.email" type="email" required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Phone number</IonLabel>
              <IonInput v-model="form.phone" type="tel" required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput v-model="form.password" type="password" required />
            </IonItem>
            <div>
              <IonButton type="submit" expand="block" :disabled="loading">Create Account</IonButton>
            </div>
            <div>
              <GoogleSignInButton v-if="googleClientId" :client-id="googleClientId" />
            </div>
            <IonButton fill="clear" router-link="/login">Have an account? Sign in</IonButton>
            <IonText color="danger" v-if="error">{{ error }}</IonText>
          </form>
        </IonCardContent>
      </IonCard>
    </IonContent>
  </IonPage>
  
</template>

<style scoped>
</style>


