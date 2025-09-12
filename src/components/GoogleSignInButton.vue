<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../store/auth'

interface GoogleAccounts {
  accounts: {
    id: {
      initialize: (config: { client_id: string; callback: (response: { credential: string }) => void; ux_mode: string; auto_select: boolean }) => void;
      renderButton: (element: HTMLElement, config: { theme: string; size: string; width: string; shape?: string; logo_alignment?: string }) => void;
    };
  };
}

interface WindowWithGoogle extends Window {
  google?: GoogleAccounts;
}

const props = defineProps<{ clientId: string }>()
const emit = defineEmits<{
  (e: 'success'): void
  (e: 'error', message: string): void
}>()

const btnRef = ref<HTMLDivElement | null>(null)
const { googleLogin } = useAuth()
const router = useRouter()

onMounted(() => {
  const google = (window as WindowWithGoogle).google
  if (!google || !google.accounts || !google.accounts.id) return
  google.accounts.id.initialize({
    client_id: props.clientId,
    callback: async (response: { credential: string }) => {
      try {
        await googleLogin(response.credential)
        emit('success')
        router.replace('/profile')
      } catch (e: unknown) {
        const error = e as { response?: { data?: { message?: string } } }
        const message = error?.response?.data?.message ?? 'Google sign-in failed'
        emit('error', message)
      }
    },
    ux_mode: 'popup',
    auto_select: false,
  })
  if (btnRef.value) {
    google.accounts.id.renderButton(btnRef.value, { 
      theme: 'outline', 
      size: 'large', 
      width: '100%',
      shape: 'rectangular',
      logo_alignment: 'left'
    })
  }
})
</script>

<template>
  <div ref="btnRef" class="google-signin-button"></div>
</template>

<style scoped>
.google-signin-button {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.google-signin-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Override Google button styles */
.google-signin-button :deep(.nsm7Bb-HzV7m-LgbsSe) {
  border-radius: 16px !important;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  background: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(10px) !important;
  transition: all 0.3s ease !important;
}

.google-signin-button :deep(.nsm7Bb-HzV7m-LgbsSe:hover) {
  background: rgba(255, 255, 255, 1) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-1px) !important;
}
</style>


