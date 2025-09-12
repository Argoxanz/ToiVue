<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ $t('export.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="container">
        <ion-button @click="exportXlsx" :aria-label="$t('export.exportToExcel')">{{ $t("export.exportXlsx") }}</ion-button>
        <ion-button @click="exportPdf" :aria-label="$t('export.exportToPdf')">{{ $t("export.exportPdf") }}</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useBudget } from '@/store/budget';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './ExportPage.css';

const route = useRoute();
const { t } = useI18n();
const budgetId = Number(route.query.budget || route.params.id);
const { summaryByBudget } = useBudget();
const summary = computed(() => summaryByBudget.value.get(budgetId)?.data);

function exportXlsx() {
  if (!summary.value) return;
  const ws = XLSX.utils.json_to_sheet(summary.value.categories.map(c => ({ 
    [t('export.category')]: c.name, 
    [t('export.planned')]: c.planned, 
    [t('export.spent')]: c.spent, 
    [t('export.allocation')]: c.allocation ?? '', 
    [t('export.remaining')]: c.remaining ?? '' 
  })));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, t('budget.categories'));
  XLSX.writeFile(wb, 'budget.xlsx');
}

function exportPdf() {
  if (!summary.value) return;
  const doc = new jsPDF();
  const rows = summary.value.categories.map(c => [c.name, c.planned, c.spent, c.allocation ?? '', c.remaining ?? '']);
  (doc as unknown as { autoTable: (options: { head: string[][]; body: (string | number)[][] }) => void }).autoTable({ 
    head: [[t('export.category'), t('export.planned'), t('export.spent'), t('export.allocation'), t('export.remaining')]], 
    body: rows 
  });
  doc.save('budget.pdf');
}
</script>
