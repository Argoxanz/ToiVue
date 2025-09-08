<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Budget</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="onRefresh" aria-label="Refresh budget">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="container" v-if="summary">
        <div class="cards">
          <ion-card>
            <ion-card-header>
              <ion-card-subtitle>Planned</ion-card-subtitle>
              <ion-card-title>{{ currency }} {{ format(totalPlan) }}</ion-card-title>
            </ion-card-header>
          </ion-card>
          <ion-card :color="summary.budget.exceeded ? 'danger' : undefined">
            <ion-card-header>
              <div class="metric-row" role="group" aria-label="Actual and remaining">
                <div class="metric">
                  <div class="subtitle">Actual</div>
                  <div class="title">{{ currency }} {{ format(totalActual) }}</div>
                </div>
                <div class="metric">
                  <div class="subtitle">Remaining</div>
                  <div class="title">{{ currency }} {{ format(totalRemaining) }}</div>
                </div>
              </div>
            </ion-card-header>
          </ion-card>
        </div>

        <div class="charts">
          <div class="chart-wrap">
            <apexchart :key="chartKey + '-pie'" type="pie" width="100%" :height="chartHeight" :options="pieOptions" :series="pieSeries" aria-label="Planned vs Actual shares"></apexchart>
          </div>
          <div class="chart-wrap">
            <apexchart :key="chartKey + '-bar'" type="bar" width="100%" :height="chartHeight" :options="barOptions" :series="barSeries" aria-label="Categories plan vs actual"></apexchart>
          </div>
        </div>

        <div class="actions">
          <ion-button size="small" color="medium" @click="openEditBudget">Edit budget</ion-button>
          <ion-button size="small" @click="openAddCategory">Add category</ion-button>
        </div>

        <ion-list aria-label="Categories progress">
          <ion-list-header>
            <ion-label>Categories</ion-label>
          </ion-list-header>
          <template v-if="summary.categories.length">
            <ion-item v-for="cat in summary.categories" :key="cat.id">
              <ion-label class="ion-text-wrap">
                <div class="row">
                  <div class="name">
                    {{ cat.name }}
                    <ion-badge v-if="cat.exceeded" color="danger" class="ml8">Over</ion-badge>
                    <ion-badge v-if="cat.planned > 0" color="tertiary" class="ml8">Booked</ion-badge>
                  </div>
                  <div class="amounts">{{ currency }} {{ format(cat.planned) }} / {{ currency }} {{ format(cat.allocation ?? 0) }}</div>
                </div>
                <ion-progress-bar :value="progress(cat)" :color="progressColor(cat)" aria-label="Progress"></ion-progress-bar>
              </ion-label>
              <ion-button slot="end" fill="solid" size="small" @click="openActions(cat)" aria-label="Edit">Edit</ion-button>
            </ion-item>
          </template>
          <template v-else>
            <ion-item>
              <ion-label>
                <div class="empty">
                  <div>No categories yet</div>
                  <ion-button router-link="/settings" size="small" color="primary">Setup</ion-button>
                </div>
              </ion-label>
            </ion-item>
          </template>
        </ion-list>

        <edit-budget-modal ref="editBudgetRef" :budget-id="budgetId" :initial="{ name: summary.budget.name ?? null, total_amount: summary.budget.total }" @saved="refreshAll" />
        <add-category-modal ref="addCategoryRef" :budget-id="budgetId" @created="refreshAll" />
        <edit-category-modal ref="editCategoryRef" :budget-id="budgetId" :category-id="editingCategoryId" @saved="refreshAll" />
        <add-expense-modal ref="addExpenseRef" :budget-id="budgetId" :category-id="addingCategoryId" @created="onExpenseCreated" />
        <ion-action-sheet :is-open="actionsOpen" :buttons="actionButtons" header="Actions" @didDismiss="actionsOpen = false" />
      </div>

      <div v-else class="empty-root">
        <ion-text color="medium">No data</ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useBudget } from '../store/budget'
import type { BudgetSummary } from '../api/budgets'
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonList, IonListHeader, IonItem, IonLabel, IonBadge, IonProgressBar, IonButton, IonRefresher, IonRefresherContent, IonText, IonActionSheet
} from '@ionic/vue'
import EditBudgetModal from '../widgets/EditBudgetModal.vue'
import AddCategoryModal from '../widgets/AddCategoryModal.vue'
import EditCategoryModal from '../widgets/EditCategoryModal.vue'
import AddExpenseModal from '../widgets/AddExpenseModal.vue'
import { budgetsApi } from '../api/budgets'

const route = useRoute()
const budgetId = computed(() => Number(route.params.id))
const { loadSummary } = useBudget()
const summary = ref<BudgetSummary | null>(null)

async function fetchAll(force = false) {
  summary.value = await loadSummary(budgetId.value, force)
}

onMounted(() => {
  fetchAll()
})

function handleResize() {
  viewportWidth.value = window.innerWidth
}
onMounted(() => window.addEventListener('resize', handleResize))
onBeforeUnmount(() => window.removeEventListener('resize', handleResize))

const currency = computed(() => summary.value?.budget.currency ?? 'KZT')
const viewportWidth = ref(window.innerWidth)
const chartHeight = computed(() => (viewportWidth.value <= 480 ? 260 : 340))
const chartKey = computed(() => `${viewportWidth.value}`)

const totalPlan = computed(() => summary.value?.budget.total ?? 0)
const totalActual = computed(() => summary.value?.budget.planned_total ?? 0)
const totalRemaining = computed(() => Math.max(0, (summary.value?.budget.total ?? 0) - (summary.value?.budget.planned_total ?? 0)))

function format(n: number | null | undefined) {
  if (n == null) return '0'
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

function progress(cat: BudgetSummary['categories'][number]) {
  const denom = cat.allocation ?? 0
  if (denom <= 0) return 0
  return Math.min(1, cat.planned / denom)
}
function progressColor(cat: BudgetSummary['categories'][number]) {
  const denom = cat.allocation ?? 0
  if (denom <= 0) return 'medium'
  return cat.planned > denom ? 'danger' : 'primary'
}

const pieSeries = computed(() => {
  if (!summary.value) return []
  return [summary.value.budget.total, summary.value.budget.planned_total]
})

const pieOptions = computed(() => ({
  chart: { toolbar: { show: false }, animations: { enabled: false } },
  labels: ['Planned', 'Actual'],
  legend: { position: 'bottom' },
  theme: { mode: 'light' },
  responsive: [
    { breakpoint: 640, options: { legend: { position: 'bottom' }, chart: { height: 240 } } },
  ],
}))

const barSeries = computed(() => {
  if (!summary.value) return []
  return [
    { name: 'Planned', data: summary.value.categories.map((c) => c.allocation ?? 0) },
    { name: 'Actual', data: summary.value.categories.map((c) => c.planned) },
  ]
})

const barOptions = computed(() => ({
  chart: { type: 'bar', toolbar: { show: false }, parentHeightOffset: 0, animations: { enabled: false } },
  plotOptions: { bar: { horizontal: false, columnWidth: '55%' } },
  dataLabels: { enabled: false },
  grid: { padding: { left: 0, right: 0 } },
  xaxis: {
    categories: summary.value?.categories.map((c) => c.name) ?? [],
    labels: { rotate: viewportWidth.value <= 480 ? -45 : 0, hideOverlappingLabels: true, trim: true },
  },
  legend: { position: 'bottom' },
  theme: { mode: 'light' },
  responsive: [
    { breakpoint: 480, options: { plotOptions: { bar: { columnWidth: '60%' } }, xaxis: { labels: { rotate: -45 } } } },
    { breakpoint: 360, options: { plotOptions: { bar: { columnWidth: '70%' } }, xaxis: { labels: { rotate: -60 } } } },
  ],
}))

function onRefresh(ev: CustomEvent) {
  fetchAll(true).finally(() => (ev.target as any).complete())
}

function openEditBudget() { editBudgetRef.value?.open() }
function openAddCategory() { addCategoryRef.value?.open() }

const editBudgetRef = ref<InstanceType<typeof EditBudgetModal> | null>(null)
const addCategoryRef = ref<InstanceType<typeof AddCategoryModal> | null>(null)
const editCategoryRef = ref<InstanceType<typeof EditCategoryModal> | null>(null)
const editingCategoryId = ref(0)
function openEditCategory(cat: any) {
  editingCategoryId.value = cat.id
  editCategoryRef.value?.open({ name: cat.name, allocation_percent: null, allocation_amount: cat.allocation ?? null })
}
const addExpenseRef = ref<InstanceType<typeof AddExpenseModal> | null>(null)
const addingCategoryId = ref(0)
function openAddExpense(cat: any) {
  addingCategoryId.value = cat.id
  addExpenseRef.value?.open()
}
const actionsOpen = ref(false)
const actionButtons = ref<any[]>([])
function openActions(cat: any) {
  actionButtons.value = [
    { text: 'Add Expense', handler: () => openAddExpense(cat) },
    { text: 'Edit Category', handler: () => openEditCategory(cat) },
    { text: 'Delete Category', role: 'destructive', handler: () => removeCategory(cat.id) },
    { text: 'Edit Budget', handler: () => openEditBudget() },
    { text: 'Cancel', role: 'cancel' },
  ]
  actionsOpen.value = true
}
async function removeCategory(categoryId: number) {
  await budgetsApi.removeCategory(budgetId.value, categoryId)
  await refreshAll()
}
async function refreshAll() { await fetchAll(true) }
async function onExpenseCreated() { await refreshAll() }
</script>

<style scoped>
.container { padding: 12px; }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.charts { display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 8px; }
.chart-wrap { width: 100%; overflow-x: auto; }
.actions { display: flex; gap: 8px; padding: 8px 0; }
.row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.name { font-weight: 600; }
.amounts { font-size: 12px; color: var(--ion-color-medium); }
.ml8 { margin-left: 8px; }
.empty { display: flex; align-items: center; gap: 8px; }
.empty-root { display: flex; align-items: center; justify-content: center; height: 60vh; }
@media (max-width: 768px) {
  .cards { grid-template-columns: 1fr; }
}
.metric-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-items: center; }
.metric .subtitle { font-size: 12px; color: var(--ion-color-medium); }
.metric .title { font-size: 16px; font-weight: 600; }
</style>


