<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t('budget.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <p class="loading-text">{{ $t('common.loading') }}</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-icon">⚠️</div>
        <p class="error-text">{{ error }}</p>
        <ion-button expand="block" color="primary" @click="retry">{{ $t('common.retry') }}</ion-button>
      </div>
      
      <!-- Success State -->
      <template v-else>
        <ion-button v-if="hasBudget" expand="block" :router-link="dashboardLink">{{ $t("budget.budgetDashboard") }}</ion-button>
        <template v-else>
          <div class="empty">
            <div class="empty-icon">💰</div>
            <div class="empty-text">{{ $t("common.noData") }}</div>
            <ion-button expand="block" color="primary" @click="openCreate">{{ $t("budget.editBudget") }}</ion-button>
          </div>
        </template>
      </template>
      
      <add-budget-modal ref="createRef" @created="goToBudget" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useBudget } from '@/store/budget';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import AddBudgetModal from '@/widgets/AddBudgetModal.vue';
import './BudgetEntry.css';

const { loadBudgets, budgets, loading, error } = useBudget();

onMounted(() => { 
  loadBudgets(1); 
});

const dashboardLink = computed(() => budgets.value.length ? `/budgets/${budgets.value[0].id}` : '/settings');
const hasBudget = computed(() => budgets.value.length > 0);
const createRef = ref<InstanceType<typeof AddBudgetModal> | null>(null);

function openCreate() { 
  createRef.value?.open(); 
}

function goToBudget(id: number) { 
  window.location.href = `/budgets/${id}`; 
}

function retry() {
  loadBudgets(1);
}
</script>


