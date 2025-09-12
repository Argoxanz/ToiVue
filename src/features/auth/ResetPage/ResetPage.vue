<script setup lang="ts">
import { reactive } from 'vue';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';
import { useAuth } from '@/store/auth';
import { useRoute, useRouter } from 'vue-router';
import './ResetPage.css';

const form = reactive({ token: '', email: '', password: '', password_confirmation: '' });
const { reset } = useAuth();
const route = useRoute();
const router = useRouter();
const message = reactive({ text: '' });

form.token = (route.query.token as string) || '';
form.email = (route.query.email as string) || '';

async function onSubmit() {
  const res = await reset(form);
  message.text = res.message;
  router.replace('/login');
}
</script>

<template>
  <IonPage>
    <IonContent class="ion-padding auth-center">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{{ $t('auth.setNewPassword') }}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <form @submit.prevent="onSubmit" class="stack-md">
            <IonItem>
              <IonLabel position="stacked">{{ $t("auth.token") }}</IonLabel>
              <IonInput v-model="form.token" required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">{{ $t("common.email") }}</IonLabel>
              <IonInput v-model="form.email" type="email" required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">{{ $t("auth.newPassword") }}</IonLabel>
              <IonInput v-model="form.password" type="password" required />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">{{ $t("auth.confirmPassword") }}</IonLabel>
              <IonInput v-model="form.password_confirmation" type="password" required />
            </IonItem>
            <div>
              <IonButton type="submit" expand="block">{{ $t("auth.resetPassword") }}</IonButton>
            </div>
            <IonText v-if="message.text">{{ message.text }}</IonText>
          </form>
        </IonCardContent>
      </IonCard>
    </IonContent>
  </IonPage>
</template>


