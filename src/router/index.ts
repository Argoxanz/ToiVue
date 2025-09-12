import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/profile' },
  { 
    path: '/login', 
    component: () => import('@/features/auth/LoginPage'),
    meta: { title: 'Login' }
  },
  { 
    path: '/register', 
    component: () => import('@/features/auth/RegisterPage'),
    meta: { title: 'Register' }
  },
  { 
    path: '/forgot', 
    component: () => import('@/features/auth/ForgotPage'),
    meta: { title: 'Forgot Password' }
  },
  { 
    path: '/reset', 
    component: () => import('@/features/auth/ResetPage'),
    meta: { title: 'Reset Password' }
  },
  { 
    path: '/profile', 
    component: () => import('@/features/profile/ProfilePage'), 
    meta: { requiresAuth: true, title: 'Profile' }
  },
  { 
    path: '/budget', 
    component: () => import('@/features/budget/BudgetEntry'), 
    meta: { requiresAuth: true, title: 'Budget Entry' }
  },
  { 
    path: '/checklists', 
    component: () => import('@/features/checklists/ChecklistsPage'), 
    meta: { requiresAuth: true, title: 'Checklists' }
  },
  { 
    path: '/checklists/:id', 
    component: () => import('@/features/checklists/ChecklistDetailPage'), 
    meta: { requiresAuth: true, title: 'Checklist Details' }
  },
  // Budgets
  { 
    path: '/budgets/:id', 
    component: () => import('@/features/budget/BudgetDashboard'), 
    meta: { requiresAuth: true, title: 'Budget Dashboard' }
  },
  { 
    path: '/budgets/:id/categories/:categoryId', 
    component: () => import('@/features/budget/CategoryDetail'), 
    meta: { requiresAuth: true, title: 'Category Details' }
  },
  { 
    path: '/budgets/:id/expenses/:expenseId', 
    component: () => import('@/features/budget/ExpenseDetail'), 
    meta: { requiresAuth: true, title: 'Expense Details' }
  },
  { 
    path: '/settings', 
    component: () => import('@/features/settings/SettingsPage'), 
    meta: { requiresAuth: true, title: 'Settings' }
  },
  { 
    path: '/export', 
    component: () => import('@/features/export/ExportPage'), 
    meta: { requiresAuth: true, title: 'Export Data' }
  },
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


