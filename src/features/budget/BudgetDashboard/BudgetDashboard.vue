<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t('budget.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="onRefresh" :aria-label="$t('budget.refreshBudget')">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

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
      <div class="budget-dashboard" v-else-if="summary">
        <!-- Budget Header Section -->
        <div class="budget-header">
          <div class="budget-info">
            <h1 class="budget-title">{{ $t('budget.title') }}</h1>
            <p class="budget-subtitle">{{ currency }} {{ format(totalPlan) }} {{ $t('common.planned') }}</p>
          </div>
          <div class="budget-status" :class="{ 'exceeded': summary.budget.exceeded }">
            <div class="status-icon">{{ summary.budget.exceeded ? '⚠️' : '✅' }}</div>
            <div class="status-text">{{ summary.budget.exceeded ? $t('budget.over') : $t('budget.booked') }}</div>
          </div>
        </div>

        <!-- Budget Overview Cards -->
        <div class="overview-cards">
          <div class="overview-card">
            <div class="card-icon">💰</div>
            <div class="card-content">
              <div class="card-label">{{ $t('common.actual') }}</div>
              <div class="card-value">{{ currency }} {{ format(totalActual) }}</div>
            </div>
          </div>
          
          <div class="overview-card">
            <div class="card-icon">📊</div>
            <div class="card-content">
              <div class="card-label">{{ $t('common.remaining') }}</div>
              <div class="card-value">{{ currency }} {{ format(totalRemaining) }}</div>
            </div>
          </div>
        </div>

        <!-- Progress Chart -->
        <div class="chart-section">
          <div class="chart-header">
            <h2 class="chart-title">{{ $t('budget.plannedVsActual') }}</h2>
          </div>
          <div class="chart-container">
            <ApexChart :key="chartKey + '-pie'" type="pie" width="100%" :height="280" :options="pieOptions" :series="pieSeries" :aria-label="$t('budget.plannedVsActual')"></ApexChart>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <ion-button 
            @click="openEditBudget" 
            class="action-button edit-button"
            fill="outline"
          >
            <ion-icon :icon="createOutline" slot="start" />
            {{ $t("budget.editBudget") }}
          </ion-button>
          
          <ion-button 
            @click="openAddCategory" 
            class="action-button add-button"
            fill="outline"
          >
            <ion-icon :icon="addOutline" slot="start" />
            {{ $t("budget.addCategory") }}
          </ion-button>
        </div>

        <!-- Categories Section -->
        <div class="categories-section">
          <div class="section-header">
            <h2 class="section-title">{{ $t("budget.categories") }}</h2>
          </div>
          
          <template v-if="summary.categories.length">
            <div class="categories-list">
              <div v-for="cat in summary.categories" :key="cat.id" class="category-card">
                <div class="category-header">
                  <div class="category-info">
                    <h3 class="category-name">{{ cat.name }}</h3>
                    <div class="category-badges">
                      <span v-if="cat.exceeded" class="badge exceeded">{{ $t("budget.over") }}</span>
                      <span v-if="cat.planned > 0" class="badge booked">{{ $t("budget.booked") }}</span>
                    </div>
                  </div>
                  <ion-button 
                    @click="openActions(cat)" 
                    class="category-action"
                    fill="clear"
                    size="small"
                  >
                    <ion-icon :icon="ellipsisVerticalOutline" />
                  </ion-button>
                </div>
                
                <div class="category-progress">
                  <div class="progress-info">
                    <span class="progress-text">{{ currency }} {{ format(cat.planned) }} / {{ currency }} {{ format(cat.allocation ?? 0) }}</span>
                    <span class="progress-percentage">{{ Math.round(progress(cat) * 100) }}%</span>
                  </div>
                  <div class="progress-bar">
                    <div 
                      class="progress-fill" 
                      :class="{ 'exceeded': cat.exceeded }"
                      :style="{ width: `${Math.min(100, progress(cat) * 100)}%` }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
          
          <template v-else>
            <div class="empty-categories">
              <div class="empty-icon">📂</div>
              <div class="empty-text">{{ $t("budget.noCategoriesYet") }}</div>
              <ion-button router-link="/settings" class="setup-button" fill="outline">
                {{ $t("budget.setup") }}
              </ion-button>
            </div>
          </template>
        </div>

        <edit-budget-modal ref="editBudgetRef" :budget-id="budgetId" :initial="{ name: null, total_amount: summary.budget.total }" @saved="refreshAll" />
        <add-category-modal ref="addCategoryRef" :budget-id="budgetId" @created="refreshAll" />
        <edit-category-modal ref="editCategoryRef" :budget-id="budgetId" :category-id="editingCategoryId" @saved="refreshAll" />
        <add-expense-modal ref="addExpenseRef" :budget-id="budgetId" :category-id="addingCategoryId" @created="onExpenseCreated" />
        <ion-action-sheet :is-open="actionsOpen" :buttons="actionButtons" header="Actions" @didDismiss="actionsOpen = false" />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-root">
        <div class="empty-icon">📊</div>
        <ion-text color="medium">{{ $t("common.noData") }}</ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useBudget } from '@/store/budget';
import type { BudgetSummary } from '@/api/budgets';
import { 
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonRefresher, IonRefresherContent, IonText, IonActionSheet, IonIcon
} from '@ionic/vue';
import { createOutline, addOutline, ellipsisVerticalOutline } from 'ionicons/icons';
import EditBudgetModal from '@/widgets/EditBudgetModal.vue';
import AddCategoryModal from '@/widgets/AddCategoryModal.vue';
import EditCategoryModal from '@/widgets/EditCategoryModal.vue';
import AddExpenseModal from '@/widgets/AddExpenseModal.vue';
import { budgetsApi } from '@/api/budgets';
import './BudgetDashboard.css';

const route = useRoute();
const { t } = useI18n();
const budgetId = computed(() => Number(route.params.id));
const { loadSummary, loading, error } = useBudget();
const summary = ref<BudgetSummary | null>(null);

async function fetchAll(force = false) {
  summary.value = await loadSummary(budgetId.value, force);
}

onMounted(() => {
  fetchAll();
});

function handleResize() {
  viewportWidth.value = window.innerWidth;
}
onMounted(() => window.addEventListener('resize', handleResize));
onBeforeUnmount(() => window.removeEventListener('resize', handleResize));

const currency = computed(() => summary.value?.budget.currency ?? 'KZT');
const viewportWidth = ref(window.innerWidth);
const chartKey = computed(() => `${viewportWidth.value}`);

const totalPlan = computed(() => summary.value?.budget.total ?? 0);
const totalActual = computed(() => summary.value?.budget.planned_total ?? 0);
const totalRemaining = computed(() => Math.max(0, (summary.value?.budget.total ?? 0) - (summary.value?.budget.planned_total ?? 0)));

function format(n: number | null | undefined) {
  if (n == null) return '0';
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function progress(cat: BudgetSummary['categories'][number]) {
  const denom = cat.allocation ?? 0;
  if (denom <= 0) return 0;
  return Math.min(1, cat.planned / denom);
}

const pieSeries = computed(() => {
  if (!summary.value) return [];
  return [summary.value.budget.total, summary.value.budget.planned_total];
});

const pieOptions = computed(() => ({
  chart: { toolbar: { show: false }, animations: { enabled: false } },
  labels: [t('common.planned'), t('common.actual')],
  legend: { position: 'bottom' },
  theme: { mode: 'light' },
  responsive: [
    { breakpoint: 640, options: { legend: { position: 'bottom' }, chart: { height: 240 } } },
  ],
}));


function onRefresh(ev: CustomEvent) {
  fetchAll(true).finally(() => (ev.target as unknown as { complete: () => void }).complete());
}

function openEditBudget() { editBudgetRef.value?.open(); }
function openAddCategory() { addCategoryRef.value?.open(); }

const editBudgetRef = ref<InstanceType<typeof EditBudgetModal> | null>(null);
const addCategoryRef = ref<InstanceType<typeof AddCategoryModal> | null>(null);
const editCategoryRef = ref<InstanceType<typeof EditCategoryModal> | null>(null);
const editingCategoryId = ref(0);
function openEditCategory(cat: { id: number; name: string; allocation?: number | null }) {
  editingCategoryId.value = cat.id;
  editCategoryRef.value?.open({ name: cat.name, allocation_percent: null, allocation_amount: cat.allocation ?? null });
}
const addExpenseRef = ref<InstanceType<typeof AddExpenseModal> | null>(null);
const addingCategoryId = ref(0);
function openAddExpense(cat: { id: number }) {
  addingCategoryId.value = cat.id;
  addExpenseRef.value?.open();
}
const actionsOpen = ref(false);
const actionButtons = ref<Array<{ text: string; handler?: () => void; role?: string }>>([]);
function openActions(cat: { id: number; name: string; allocation?: number | null }) {
  actionButtons.value = [
    { text: t('budget.addExpense'), handler: () => openAddExpense(cat) },
    { text: t('budget.editCategory'), handler: () => openEditCategory(cat) },
    { text: t('budget.deleteCategory'), role: 'destructive', handler: () => removeCategory(cat.id) },
    { text: t('budget.editBudget'), handler: () => openEditBudget() },
    { text: t('common.cancel'), role: 'cancel' },
  ];
  actionsOpen.value = true;
}
async function removeCategory(categoryId: number) {
  await budgetsApi.removeCategory(budgetId.value, categoryId);
  await refreshAll();
}
async function refreshAll() { await fetchAll(true); }
async function onExpenseCreated() { await refreshAll(); }
function retry() { fetchAll(true); }
</script>
