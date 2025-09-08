import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/profile' },
  { path: '/login', component: () => import('../views/LoginPage.vue') },
  { path: '/register', component: () => import('../views/RegisterPage.vue') },
  { path: '/forgot', component: () => import('../views/ForgotPage.vue') },
  { path: '/reset', component: () => import('../views/ResetPage.vue') },
  { path: '/profile', component: () => import('../views/ProfilePage.vue'), meta: { requiresAuth: true } },
  { path: '/budget', component: () => import('../views/BudgetEntry.vue'), meta: { requiresAuth: true } },
  { path: '/checklists', component: () => import('../views/ChecklistsPage.vue'), meta: { requiresAuth: true } },
  { path: '/checklists/:id', component: () => import('../views/ChecklistDetailPage.vue'), meta: { requiresAuth: true } },
  // Budgets
  { path: '/budgets/:id', component: () => import('../views/BudgetDashboard.vue'), meta: { requiresAuth: true } },
  { path: '/budgets/:id/categories/:categoryId', component: () => import('../views/CategoryDetail.vue'), meta: { requiresAuth: true } },
  { path: '/budgets/:id/expenses/:expenseId', component: () => import('../views/ExpenseDetail.vue'), meta: { requiresAuth: true } },
  { path: '/settings', component: () => import('../views/SettingsPage.vue'), meta: { requiresAuth: true } },
  { path: '/export', component: () => import('../views/ExportPage.vue'), meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const { tokenStorage } = await import('../api/http')
    const { accessToken } = tokenStorage.get()
    if (!accessToken) {
      return { path: '/login', query: { redirect: to.fullPath } }
    }
  }
  return true
})

export default router


