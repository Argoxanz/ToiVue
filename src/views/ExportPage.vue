<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Export</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <div class="container">
        <ion-button @click="exportXlsx" aria-label="Export to Excel">Export XLSX</ion-button>
        <ion-button @click="exportPdf" aria-label="Export to PDF">Export PDF</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useBudget } from '../store/budget'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/vue'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const route = useRoute()
const budgetId = Number(route.query.budget || route.params.id)
const { summaryByBudget } = useBudget()
const summary = computed(() => summaryByBudget.value.get(budgetId)?.data)

function exportXlsx() {
  if (!summary.value) return
  const ws = XLSX.utils.json_to_sheet(summary.value.categories.map(c => ({ Category: c.name, Planned: c.planned, Spent: c.spent, Allocation: c.allocation ?? '', Remaining: c.remaining ?? '' })))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Categories')
  XLSX.writeFile(wb, 'budget.xlsx')
}

function exportPdf() {
  if (!summary.value) return
  const doc = new jsPDF()
  const rows = summary.value.categories.map(c => [c.name, c.planned, c.spent, c.allocation ?? '', c.remaining ?? ''])
  ;(doc as any).autoTable({ head: [['Category', 'Planned', 'Spent', 'Allocation', 'Remaining']], body: rows })
  doc.save('budget.pdf')
}
</script>

<style scoped>
.container { padding: 12px; display: flex; gap: 8px; }
</style>



