<template>
  <ion-modal :is-open="openState" @didDismiss="close">
    <ion-header>
      <ion-toolbar>
        <ion-title>Add expense</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="close" aria-label="Close">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input placeholder="Name" v-model="name" aria-label="Name" />
      </ion-item>
      <ion-item>
        <ion-input type="number" placeholder="Amount" v-model.number="amount" aria-label="Amount" />
      </ion-item>
      <ion-item>
        <ion-input placeholder="Vendor (optional)" v-model="vendor" aria-label="Vendor" />
      </ion-item>
      <ion-item>
        <ion-textarea placeholder="Notes" v-model="notes" aria-label="Notes" />
      </ion-item>
      <div class="mt8">
        <ion-button expand="block" :disabled="!name || !amount || amount <= 0 || submitting" @click="submit">Save</ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineEmits } from 'vue'
import { useBudget } from '../store/budget'
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonInput, IonTextarea } from '@ionic/vue'

const props = defineProps<{ budgetId: number; categoryId?: number }>()
const { createExpenseOptimistic } = useBudget()
const emit = defineEmits<{ (e: 'created', expenseId: number): void }>()

const openState = ref(false)
const name = ref('')
const amount = ref<number | null>(null)
// Calendar removed for MVP; due date not collected
const vendor = ref<string | null>(null)
const notes = ref<string | null>(null)
const submitting = ref(false)

function open() { openState.value = true }
function close() { openState.value = false }

async function submit() {
  if (!name.value || !amount.value || amount.value <= 0) return
  submitting.value = true
  try {
    const created = await createExpenseOptimistic(props.budgetId, {
      category_id: props.categoryId ?? 0,
      name: name.value,
      amount_total: amount.value,
      // due_date omitted
      vendor: vendor.value ?? undefined,
      notes: notes.value ?? undefined,
    })
    emit('created', created.id)
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


