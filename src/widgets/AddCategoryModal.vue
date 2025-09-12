<template>
  <ion-modal :is-open="openState" @didDismiss="close">
    <ion-header>
      <ion-toolbar>
        <ion-title>Add category</ion-title>
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
        <ion-input type="number" placeholder="Allocation % (optional)" v-model.number="allocationPercent" aria-label="Allocation percent" />
      </ion-item>
      <ion-item>
        <ion-input type="number" placeholder="Allocation amount (optional)" v-model.number="allocationAmount" aria-label="Allocation amount" />
      </ion-item>
      <div class="mt8">
        <ion-button expand="block" :disabled="!name || submitting" @click="submit">Create</ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, defineExpose, defineEmits } from 'vue'
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonItem, IonInput } from '@ionic/vue'
import { budgetsApi } from '../api/budgets'

const props = defineProps<{ budgetId: number; parentId?: number | null }>()
const emit = defineEmits<{ (e: 'created'): void }>()

const openState = ref(false)
const name = ref('')
const allocationPercent = ref<number | null>(null)
const allocationAmount = ref<number | null>(null)
const submitting = ref(false)

function open() { openState.value = true }
function close() { openState.value = false }

async function submit() {
  if (!name.value) return
  submitting.value = true
  try {
    await budgetsApi.createCategory(props.budgetId, {
      name: name.value,
      parent_id: props.parentId ?? null,
      allocation_percent: allocationPercent.value ?? null,
      allocation_amount: allocationAmount.value ?? null,
    })
    emit('created')
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



