<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon } from '@ionic/vue';
import { onMounted, computed } from 'vue';
import { useAuth } from '@/store/auth';
import { useRouter } from 'vue-router';
import { settingsOutline, logOutOutline, personOutline } from 'ionicons/icons';
import './ProfilePage.css';

const { user, loadUserIfAuthenticated, logout } = useAuth();
const router = useRouter();

onMounted(async () => {
  await loadUserIfAuthenticated();
  if (!user) {
    router.replace('/login');
  }
});

async function onLogout() {
  await logout();
  router.replace('/login');
}

const userInitials = computed(() => {
  if (!user?.name) return 'U';
  return user.name
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
});
</script>

<template>
  <IonPage class="profile-page">
    <IonHeader>
      <IonToolbar>
        <IonTitle>{{ $t('profile.title') }}</IonTitle>
      </IonToolbar>
    </IonHeader>
    
    <IonContent class="profile-content">
      <template v-if="user">
        <!-- Profile Header Section -->
        <div class="profile-header">
          <div class="avatar-container">
            <div class="avatar">
              <span class="avatar-text">{{ userInitials }}</span>
            </div>
            <div class="avatar-ring"></div>
          </div>
          
          <div class="user-info">
            <h1 class="user-name">{{ user.name }}</h1>
            <p class="user-role">{{ user.role }}</p>
          </div>
        </div>

        <!-- Profile Details Card -->
        <div class="profile-card">
          <div class="card-header">
            <IonIcon :icon="personOutline" class="card-icon" />
            <h2 class="card-title">{{ $t('profile.personalInfo') }}</h2>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">{{ $t('profile.email') }}</span>
              <span class="info-value">{{ user.email || '—' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">{{ $t('profile.phone') }}</span>
              <span class="info-value">{{ user.phone || '—' }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-section">
          <IonButton 
            router-link="/settings" 
            class="action-button settings-button"
            fill="outline"
          >
            <IonIcon :icon="settingsOutline" slot="start" />
            {{ $t("common.settings") }}
          </IonButton>
          
          <IonButton 
            @click="onLogout" 
            class="action-button logout-button"
            fill="outline"
          >
            <IonIcon :icon="logOutOutline" slot="start" />
            {{ $t("common.logout") }}
          </IonButton>
        </div>
      </template>
    </IonContent>
  </IonPage>
</template>


