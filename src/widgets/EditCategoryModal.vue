<template>
  <ion-modal :is-open="openState" @didDismiss="close">
    <ion-header>
      <ion-toolbar>
        <ion-title>Edit category</ion-title>
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
        <ion-input type="number" placeholder="Allocation %" v-model.number="allocationPercent" aria-label="Allocation percent" />
      </ion-item>
      <ion-item>
        <ion-input type="number" placeholder="Allocation amount" v-model.number="allocationAmount" aria-label="Allocation amount" />
      </ion-item>
      <div class="mt8">
        <ion-button expand="block" :disabled="submitting" @click="submit">Save</ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, defineExpose } from 'vue'
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonInput } from '@ionic/vue'
import { budgetsApi } from '../api/budgets'

const props = defineProps<{ budgetId: number; categoryId: number }>()

const openState = ref(false)
const name = ref('')
const allocationPercent = ref<number | null>(null)
const allocationAmount = ref<number | null>(null)
const submitting = ref(false)

function open(initial?: { name: string; allocation_percent: number | null; allocation_amount: number | null }) {
  if (initial) {
    name.value = initial.name
    allocationPercent.value = initial.allocation_percent
    allocationAmount.value = initial.allocation_amount
  }
  openState.value = true
}
function close() { openState.value = false }

async function submit() {
  submitting.value = true
  try {
    await budgetsApi.updateCategory(props.budgetId, props.categoryId, {
      name: name.value,
      allocation_percent: allocationPercent.value ?? null,
      allocation_amount: allocationAmount.value ?? null,
    })
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


