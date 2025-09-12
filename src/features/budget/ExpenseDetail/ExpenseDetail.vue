<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t('common.expense') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-list v-if="expense">
        <ion-item>
          <ion-label class="ion-text-wrap">
            <h2>{{ expense.name }}</h2>
            <p>{{ $t("checklists.status") }}: <ion-badge :color="statusColor(expense.status)">{{ expense.status }}</ion-badge></p>
            <p>{{ $t("checklists.vendor") }}: <a v-if="expense.vendor" :href="vendorLink(expense.vendor)" target="_blank" rel="noopener" :aria-label="$t('checklists.vendorLink')">{{ expense.vendor }}</a><span v-else>-</span></p>
            <!-- Due date hidden for now -->
            <p>{{ currency }} {{ format(expense.amount_paid) }} / {{ currency }} {{ format(expense.amount_total) }}</p>
          </ion-label>
          <ion-button slot="end" size="small" @click="openAddPayment">{{ $t("checklists.addPayment") }}</ion-button>
        </ion-item>

        <ion-list-header>
          <ion-label>{{ $t("checklists.payments") }}</ion-label>
        </ion-list-header>
        <ion-item v-for="p in payments" :key="p.id">
          <ion-label>
            {{ currency }} {{ format(p.amount) }} — {{ new Date(p.paid_at).toLocaleDateString() }} ({{ p.method || '—' }})
          </ion-label>
        </ion-item>
        <ion-item v-if="!payments.length">
          <ion-label>{{ $t("checklists.noPaymentsYet") }}</ion-label>
        </ion-item>
      </ion-list>

      <ion-item v-else>
        <ion-label>{{ $t("common.loading") }}</ion-label>
      </ion-item>

      <add-payment-modal :budget-id="budgetId" :expense-id="expenseId" ref="addPaymentRef" />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useBudget } from '@/store/budget';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonListHeader, IonItem, IonLabel, IonBadge, IonButton } from '@ionic/vue';
import AddPaymentModal from '@/widgets/AddPaymentModal.vue';
import './ExpenseDetail.css';

const route = useRoute();
const budgetId = Number(route.params.id);
const expenseId = Number(route.params.expenseId);
const { loadExpenses, loadPayments, expensesByBudget, paymentsByExpense, loadSummary, summaryByBudget } = useBudget();

onMounted(async () => {
  await loadExpenses(budgetId, 1);
  await loadPayments(expenseId);
  await loadSummary(budgetId);
});

const expense = computed(() => {
  const page = expensesByBudget.value.get(budgetId)?.get(1);
  return page?.data?.data.find((e) => e.id === expenseId);
});
const payments = computed(() => paymentsByExpense.value.get(expenseId)?.data ?? []);
const currency = computed(() => summaryByBudget.value.get(budgetId)?.data?.budget.currency ?? 'KZT');

function format(n: number) { return n?.toLocaleString(undefined, { maximumFractionDigits: 0 }); }
function statusColor(s: string) { return s === 'fully_paid' ? 'success' : s === 'deposit_paid' ? 'warning' : 'medium'; }
function vendorLink(v: string) { return v.startsWith('http') ? v : `https://www.google.com/search?q=${encodeURIComponent(v)}`; }

const addPaymentRef = ref<InstanceType<typeof AddPaymentModal> | null>(null);
function openAddPayment() { addPaymentRef.value?.open(); }
</script>


