<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../store/auth'

const props = defineProps<{ clientId: string }>()
const emit = defineEmits<{
  (e: 'success'): void
  (e: 'error', message: string): void
}>()

const btnRef = ref<HTMLDivElement | null>(null)
const { googleLogin } = useAuth()
const router = useRouter()

onMounted(() => {
  // @ts-ignore
  const google = window.google as any
  if (!google || !google.accounts || !google.accounts.id) return
  google.accounts.id.initialize({
    client_id: props.clientId,
    callback: async (response: { credential: string }) => {
      try {
        await googleLogin(response.credential)
        emit('success')
        router.replace('/profile')
      } catch (e: any) {
        const message = e?.response?.data?.message ?? 'Google sign-in failed'
        emit('error', message)
      }
    },
    ux_mode: 'popup',
    auto_select: false,
  })
  if (btnRef.value) {
    google.accounts.id.renderButton(btnRef.value, { theme: 'outline', size: 'large', width: 320 })
  }
})
</script>

<template>
  <div ref="btnRef"></div>
</template>

<style scoped>
</style>


