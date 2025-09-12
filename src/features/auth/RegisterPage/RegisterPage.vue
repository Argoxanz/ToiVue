<script setup lang="ts">
import { reactive } from 'vue';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonLoading } from '@ionic/vue';
import { useAuth } from '@/store/auth';
import { useRouter } from 'vue-router';
import GoogleSignInButton from '@/components/GoogleSignInButton.vue';
import './RegisterPage.css';

const form = reactive({ name: '', email: '', phone: '', password: '' });
const { register, error, loading } = useAuth();
const router = useRouter();
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

async function onSubmit() {
  try {
    await register(form.name, { email: form.email, phone: form.phone }, form.password);
    router.replace('/profile');
  } catch {
    // Error is handled by the store
  }
}
</script>

<template>
  <IonPage>
    <IonContent class="ion-padding auth-center">
      <IonLoading :is-open="loading" :message="$t('auth.creatingAccount')" />
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{{ $t('auth.createAccount') }}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <form @submit.prevent="onSubmit" class="stack-md">
            <IonItem>
              <IonLabel position="stacked">{{ $t("auth.fullName") }}</IonLabel>
              <IonInput v-model="form.name" required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">{{ $t("common.email") }}</IonLabel>
              <IonInput v-model="form.email" type="email" required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">{{ $t("auth.phoneNumber") }}</IonLabel>
              <IonInput v-model="form.phone" type="tel" required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">{{ $t("common.password") }}</IonLabel>
              <IonInput v-model="form.password" type="password" required />
            </IonItem>
            <div>
              <IonButton type="submit" expand="block" :disabled="loading">{{ $t("auth.createAccount") }}</IonButton>
            </div>
            <div>
              <GoogleSignInButton v-if="googleClientId" :client-id="googleClientId" />
            </div>
            <IonButton fill="clear" router-link="/login">{{ $t("auth.haveAccount") }}</IonButton>
            <IonText color="danger" v-if="error">{{ error }}</IonText>
          </form>
        </IonCardContent>
      </IonCard>
    </IonContent>
  </IonPage>
</template>
