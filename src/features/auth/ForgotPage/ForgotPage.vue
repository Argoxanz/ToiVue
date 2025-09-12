<script setup lang="ts">
import { ref } from 'vue';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/vue';
import { useAuth } from '@/store/auth';
import './ForgotPage.css';

const email = ref('');
const message = ref('');
const { forgot } = useAuth();

async function onSubmit() {
  const res = await forgot(email.value);
  message.value = res.message;
}
</script>

<template>
  <IonPage>
    <IonContent class="ion-padding auth-center">
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>{{ $t('auth.passwordReset') }}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <form @submit.prevent="onSubmit" class="stack-md">
            <IonItem>
              <IonLabel position="stacked">{{ $t("common.email") }}</IonLabel>
              <IonInput v-model="email" type="email" required />
            </IonItem>
            <div>
              <IonButton type="submit" expand="block">{{ $t("auth.sendResetLink") }}</IonButton>
            </div>
            <IonText v-if="message">{{ message }}</IonText>
          </form>
        </IonCardContent>
      </IonCard>
    </IonContent>
  </IonPage>
</template>


