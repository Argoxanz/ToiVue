<template>
  <ion-modal :is-open="openState" @didDismiss="close">
    <ion-header>
      <ion-toolbar>
        <ion-title>Add payment</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="close" aria-label="Close">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input type="number" placeholder="Amount" v-model.number="amount" aria-label="Amount" />
      </ion-item>
      <ion-item>
        <ion-datetime presentation="date" v-model="paidAt" aria-label="Paid at" />
      </ion-item>
      <ion-item>
        <ion-input placeholder="Method (optional)" v-model="method" aria-label="Method" />
      </ion-item>
      <ion-item>
        <ion-textarea placeholder="Note" v-model="note" aria-label="Note" />
      </ion-item>
      <div class="mt8">
        <ion-button expand="block" :disabled="!amount || amount <= 0 || submitting" @click="submit">Save</ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue'
import { useBudget } from '../store/budget'
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonInput, IonTextarea, IonDatetime } from '@ionic/vue'

const props = defineProps<{ budgetId: number; expenseId: number }>()
const { createPaymentOptimistic } = useBudget()

const openState = ref(false)
const amount = ref<number | null>(null)
const paidAt = ref<string>(new Date().toISOString())
const method = ref<string | null>(null)
const note = ref<string | null>(null)
const submitting = ref(false)

function open() { openState.value = true }
function close() { openState.value = false }

async function submit() {
  if (!amount.value || amount.value <= 0) return
  submitting.value = true
  try {
    await createPaymentOptimistic(props.budgetId, props.expenseId, { amount: amount.value, paid_at: paidAt.value, method: method.value ?? undefined, note: note.value ?? undefined })
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


