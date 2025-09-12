<template>
  <ion-modal :is-open="openState" @didDismiss="close">
    <ion-header>
      <ion-toolbar>
        <ion-title>Edit budget</ion-title>
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
        <ion-input type="number" placeholder="Total amount" v-model.number="total" aria-label="Total amount" />
      </ion-item>
      <ion-item>
        <ion-label>Currency</ion-label>
        <ion-note slot="end">KZT</ion-note>
      </ion-item>
      <div class="mt8">
        <ion-button expand="block" :disabled="submitting" @click="submit">Save</ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineEmits } from 'vue'
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonInput, IonLabel, IonNote } from '@ionic/vue'
import { budgetsApi } from '../api/budgets'

const props = defineProps<{ budgetId: number; initial?: { name: string | null; total_amount: number } }>()
const emit = defineEmits<{ (e: 'saved'): void }>()

const openState = ref(false)
const name = ref<string | null>(null)
const total = ref<number | null>(null)
const submitting = ref(false)

function open() {
  name.value = props.initial?.name ?? null
  total.value = props.initial?.total_amount ?? null
  openState.value = true
}
function close() { openState.value = false }

async function submit() {
  submitting.value = true
  try {
    await budgetsApi.update(props.budgetId, { name: name.value ?? undefined, total_amount: total.value ?? undefined })
    emit('saved')
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



