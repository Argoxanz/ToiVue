<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Category</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list>
        <ion-list-header>
          <ion-label>Expenses</ion-label>
          <ion-button size="small" @click="openAddExpense">Add expense</ion-button>
        </ion-list-header>
        <ion-item v-for="e in filtered" :key="e.id" :router-link="`/budgets/${budgetId}/expenses/${e.id}`">
          <ion-label class="ion-text-wrap">
            <div class="row">
              <div class="name">{{ e.name }}</div>
              <div class="right">
                <ion-badge :color="statusColor(e.status)">{{ e.status }}</ion-badge>
              </div>
            </div>
            <div class="meta">{{ currency }} {{ format(e.amount_paid) }} / {{ currency }} {{ format(e.amount_total) }}</div>
          </ion-label>
        </ion-item>
        <ion-item v-if="!filtered.length">
          <ion-label>No expenses yet</ion-label>
        </ion-item>
      </ion-list>

      <add-expense-modal :budget-id="budgetId" :category-id="categoryId" ref="addExpenseRef" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useBudget } from '../store/budget'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonLabel, IonBadge, IonButton } from '@ionic/vue'
import AddExpenseModal from '../widgets/AddExpenseModal.vue'

const route = useRoute()
const budgetId = Number(route.params.id)
const categoryId = Number(route.params.categoryId)
const { loadExpenses, loadSummary, expensesByBudget, summaryByBudget } = useBudget()

const page = ref(1)

onMounted(async () => {
  await loadExpenses(budgetId, page.value)
  await loadSummary(budgetId)
})

const expensesPage = computed(() => expensesByBudget.value.get(budgetId)?.get(page.value)?.data?.data ?? [])
const filtered = computed(() => expensesPage.value.filter((e) => e.category_id === categoryId))
const currency = computed(() => summaryByBudget.value.get(budgetId)?.data?.budget.currency ?? 'KZT')

function format(n: number) { return n?.toLocaleString(undefined, { maximumFractionDigits: 0 }) }
function statusColor(s: string) { return s === 'fully_paid' ? 'success' : s === 'deposit_paid' ? 'warning' : 'medium' }

const addExpenseRef = ref<InstanceType<typeof AddExpenseModal> | null>(null)
function openAddExpense() { addExpenseRef.value?.open() }
</script>

<style scoped>
.row { display: flex; justify-content: space-between; align-items: center; }
.name { font-weight: 600; }
.meta { font-size: 12px; color: var(--ion-color-medium); }
</style>



