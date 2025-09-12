<script setup lang="ts">
import { ref, computed } from 'vue';
import { IonPage, IonContent, IonItem, IonLabel, IonInput, IonButton, IonText, IonCard, IonCardContent, IonLoading, IonIcon, IonPopover, IonList } from '@ionic/vue';
import { useAuth } from '@/store/auth';
import { useRouter } from 'vue-router';
import { eyeOutline, eyeOffOutline, mailOutline, lockClosedOutline, chevronDownOutline } from 'ionicons/icons';
import GoogleSignInButton from '@/components/GoogleSignInButton.vue';
import { useLanguageStore, type SupportedLocale } from '@/store/language';
import './LoginPage.css';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const { login, error, loading } = useAuth();
const router = useRouter();
const languageStore = useLanguageStore();
const isLanguagePopoverOpen = ref(false);

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

// Form validation
const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.value.length === 0 || emailRegex.test(email.value);
});

const isPasswordValid = computed(() => {
  return password.value.length === 0 || password.value.length >= 6;
});

const isFormValid = computed(() => {
  return isEmailValid.value && isPasswordValid.value && email.value.length > 0 && password.value.length > 0;
});

async function onSubmit() {
  if (!isFormValid.value) return;
  
  try {
    await login(email.value, password.value);
    router.replace('/profile');
  } catch {
    // Error is handled by the store
  }
}

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value;
}

// Language switching functions
function openLanguagePopover() {
  isLanguagePopoverOpen.value = true;
}

function selectLanguage(locale: SupportedLocale) {
  languageStore.setLocale(locale);
  isLanguagePopoverOpen.value = false;
}

function getLanguageCode(locale: SupportedLocale): string {
  switch (locale) {
    case 'ru': return 'RU';
    case 'en': return 'ENG';
    case 'kz': return 'KZ';
    default: return 'RU';
  }
}
</script>

<template>
  <IonPage class="login-page">
    <IonContent class="login-content">
      <IonLoading :is-open="loading" :message="$t('auth.signingIn')" />
      
      <!-- Compact Language Switcher -->
      <div class="compact-language-switcher" @click="openLanguagePopover">
        <span class="language-code">{{ getLanguageCode(languageStore.currentLocale) }}</span>
        <IonIcon :icon="chevronDownOutline" class="dropdown-icon" />
      </div>

      <!-- Language Selection Popover -->
      <IonPopover :is-open="isLanguagePopoverOpen" @didDismiss="isLanguagePopoverOpen = false">
        <IonContent>
          <IonList>
            <IonItem 
              v-for="locale in languageStore.availableLocales" 
              :key="locale.code"
              button 
              @click="selectLanguage(locale.code)"
              :class="{ 'selected': locale.code === languageStore.currentLocale }"
            >
              <IonLabel>{{ locale.nativeName }}</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonPopover>

      <div class="login-container">
        <!-- Logo/Brand section -->
        <div class="brand-section">
          <div class="brand-logo">
            
            <h1 class="brand-title">Toi</h1>
          </div>
          <p class="brand-subtitle">{{ $t('auth.welcomeBack') }}</p>
        </div>

        <!-- Login form card -->
        <IonCard class="login-card">
          <IonCardContent class="login-form-content">
            <div class="login-form">
              <!-- Email field -->
              <div style="width: 100%;">
                <IonItem fill="outline" class="form-item" :class="{ 'ion-invalid': email.length > 0 && !isEmailValid }">
                  <div class="custom-input-row">
                    <IonIcon :icon="mailOutline" class="input-icon" />
                    <div class="input-content">
                      <IonLabel class="input-label">{{ $t("common.email") }}</IonLabel>
                      <IonInput 
                        class="input-field"
                        v-model="email" 
                        type="email" 
                        required 
                        autocomplete="username"
                        :placeholder="$t('common.email')"
                      />
                    </div>
                  </div>
                </IonItem>
                <IonText v-if="email.length > 0 && !isEmailValid" color="danger" class="error-text">
                  {{ $t('auth.invalidEmail') }}
                </IonText>
              </div>


              <!-- Password field -->
              <div>
                <IonItem class="form-item" :class="{ 'ion-invalid': password.length > 0 && !isPasswordValid }">
                  <div class="custom-input-row space-between">
                    <div style="display: flex; align-items: center; justify-content: start;"><IonIcon :icon="lockClosedOutline" class="input-icon" />
                    <div class="input-content" >
                      <IonLabel class="input-label">{{ $t("common.password") }}</IonLabel>
                      <IonInput 
                        class="input-field"
                        v-model="password" 
                        :type="showPassword ? 'text' : 'password'" 
                        required 
                        autocomplete="current-password"
                        :placeholder="$t('common.password')"
                      />
                    </div></div>
                    
                    <IonIcon 
                      :icon="showPassword ? eyeOffOutline : eyeOutline" 
                      class="password-toggle"
                      @click="togglePasswordVisibility"
                    />
                  </div>
                </IonItem>
                <IonText v-if="password.length > 0 && !isPasswordValid" color="danger" class="error-text">
                  {{ $t('auth.passwordTooShort') }}
                </IonText>
              </div>

              <!-- Submit button -->
              <IonButton 
                expand="block" 
                color="primary"
                class="login-button"
                :disabled="loading || !isFormValid"
                @click="onSubmit"
              >
                <span v-if="!loading">{{ $t("auth.signIn") }}</span>
                <span v-else>{{ $t('auth.signingIn') }}</span>
              </IonButton>

              <!-- Divider -->
              <div class="divider" v-if="googleClientId">
                <span class="divider-text">{{ $t('auth.orContinueWith') }}</span>
              </div>

              <!-- Google Sign In -->
              <div class="google-signin-container" v-if="googleClientId">
                <GoogleSignInButton :client-id="googleClientId" />
              </div>

              <!-- Error message -->
              <IonText v-if="error" color="danger" class="error-message">
                {{ error }}
              </IonText>

              <!-- Auth links -->
              <div class="auth-links">
                <IonButton fill="clear" router-link="/register" class="auth-link">
                  {{ $t("auth.createAccount") }}
                </IonButton>
                <IonButton fill="clear" router-link="/forgot" class="auth-link">
                  {{ $t("auth.forgotPassword") }}
                </IonButton>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      </div>
    </IonContent>
  </IonPage>
</template>
