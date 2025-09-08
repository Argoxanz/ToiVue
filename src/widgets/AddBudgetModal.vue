<template>
  <ion-modal :is-open="openState" @didDismiss="close">
    <ion-header>
      <ion-toolbar>
        <ion-title>Create budget</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="close" aria-label="Close">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input placeholder="Name (optional)" v-model="name" aria-label="Name" />
      </ion-item>
      <ion-item>
        <ion-input type="number" placeholder="Total amount" v-model.number="total" aria-label="Total amount" />
      </ion-item>
      <ion-item>
        <ion-label>Currency</ion-label>
        <ion-note slot="end">KZT</ion-note>
      </ion-item>
      <div class="mt8">
        <ion-button expand="block" :disabled="!total || total <= 0 || submitting" @click="submit">Create</ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineEmits } from 'vue'
import { useBudget } from '../store/budget'
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonInput, IonLabel, IonNote } from '@ionic/vue'

const emit = defineEmits<{ (e: 'created', id: number): void }>()
const { createBudget } = useBudget()

const openState = ref(false)
const name = ref<string | null>(null)
const total = ref<number | null>(null)
const submitting = ref(false)

function open() { openState.value = true }
function close() { openState.value = false }

async function submit() {
  if (!total.value || total.value <= 0) return
  submitting.value = true
  try {
    const budget = await createBudget({ name: name.value ?? undefined, total_amount: total.value, currency: 'KZT' })
    emit('created', budget.id)
    close()
  } finally {
    submitting.value = false
  }
}

defineExpose({ open, close })
</script>

<style scoped>
.mt8 { margin-top: 8px; }
</style>


