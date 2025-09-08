<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Budget</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-button v-if="hasBudget" expand="block" :router-link="dashboardLink">Open Budget</ion-button>
      <template v-else>
        <div class="empty">
          <div>No budget yet</div>
          <ion-button expand="block" color="primary" @click="openCreate">Create budget</ion-button>
        </div>
      </template>
      <ion-button expand="block" color="medium" router-link="/settings">Settings</ion-button>
      <add-budget-modal ref="createRef" @created="goToBudget" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useBudget } from '../store/budget'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue'
import AddBudgetModal from '../widgets/AddBudgetModal.vue'

const { loadBudgets, budgets } = useBudget()
onMounted(() => { loadBudgets(1) })
const dashboardLink = computed(() => budgets.value.length ? `/budgets/${budgets.value[0].id}` : '/settings')
const hasBudget = computed(() => budgets.value.length > 0)
const createRef = ref<InstanceType<typeof AddBudgetModal> | null>(null)
function openCreate() { createRef.value?.open() }
function goToBudget(id: number) { window.location.href = `/budgets/${id}` }
</script>


