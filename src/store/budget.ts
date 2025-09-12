import { reactive, toRefs } from 'vue'
import { budgetsApi, type Budget, type BudgetCategory, type BudgetExpense, type BudgetPayment, type BudgetSummary, type Paginated } from '../api/budgets'

type ExpensesCacheEntry = {
  page: number
  data: Paginated<BudgetExpense>
  fetchedAt: number
}

type BudgetState = {
  budgets: Budget[]
  budgetsPagination: { current_page: number; last_page: number; total: number; per_page: number } | null
  currentBudget: Budget | null
  categoriesByBudget: Map<number, { data: BudgetCategory[]; fetchedAt: number }>
  expensesByBudget: Map<number, Map<number, ExpensesCacheEntry>> // budgetId -> page -> entry
  summaryByBudget: Map<number, { data: BudgetSummary; fetchedAt: number }>
  paymentsByExpense: Map<number, { data: BudgetPayment[]; fetchedAt: number }>
  loading: boolean
  error: string | null
}

const CACHE_MS = 60_000

const state = reactive<BudgetState>({
  budgets: [],
  budgetsPagination: null,
  currentBudget: null,
  categoriesByBudget: new Map(),
  expensesByBudget: new Map(),
  summaryByBudget: new Map(),
  paymentsByExpense: new Map(),
  loading: false,
  error: null,
})

export function useBudget() {
  function isFresh(timestamp: number | undefined) {
    return typeof timestamp === 'number' && Date.now() - timestamp < CACHE_MS
  }

  async function loadBudgets(page = 1) {
    state.loading = true
    state.error = null
    try {
      const result = await budgetsApi.list(page)
      state.budgets = result.data
      state.budgetsPagination = {
        current_page: result.current_page,
        last_page: result.last_page,
        per_page: result.per_page,
        total: result.total,
      }
    } catch (e: unknown) {
      const errorResponse = e as { response?: { data?: { message?: string } } }
      state.error = errorResponse?.response?.data?.message ?? 'Failed to load budgets'
    } finally {
      state.loading = false
    }
  }

  async function createBudget(payload: { name?: string | null; total_amount: number; currency?: string }) {
    const created = await budgetsApi.create(payload)
    state.budgets.unshift(created)
    return created
  }

  async function loadBudget(id: number) {
    state.loading = true
    state.error = null
    try {
      const budget = await budgetsApi.get(id)
      state.currentBudget = budget
      // Warm caches
      state.categoriesByBudget.set(id, { data: budget.categories, fetchedAt: Date.now() })
      const paginated: Paginated<BudgetExpense> = {
        data: budget.expenses,
        current_page: 1,
        last_page: 1,
        per_page: Math.max(1, budget.expenses.length),
        total: budget.expenses.length,
      }
      let map = state.expensesByBudget.get(id)
      if (!map) {
        map = new Map()
        state.expensesByBudget.set(id, map)
      }
      map.set(1, { page: 1, data: paginated, fetchedAt: Date.now() })
    } catch (e: unknown) {
      const errorResponse = e as { response?: { data?: { message?: string } } }
      state.error = errorResponse?.response?.data?.message ?? 'Failed to load budget'
    } finally {
      state.loading = false
    }
  }

  async function loadCategories(budgetId: number, force = false) {
    const cached = state.categoriesByBudget.get(budgetId)
    if (!force && cached && isFresh(cached.fetchedAt)) return cached.data
    const data = await budgetsApi.listCategories(budgetId)
    state.categoriesByBudget.set(budgetId, { data, fetchedAt: Date.now() })
    return data
  }

  async function loadExpenses(budgetId: number, page = 1, force = false) {
    const pages = state.expensesByBudget.get(budgetId)
    const cached = pages?.get(page)
    if (!force && cached && isFresh(cached.fetchedAt)) return cached.data
    const data = await budgetsApi.listExpenses(budgetId, page)
    let map = state.expensesByBudget.get(budgetId)
    if (!map) {
      map = new Map()
      state.expensesByBudget.set(budgetId, map)
    }
    map.set(page, { page, data, fetchedAt: Date.now() })
    return data
  }

  async function loadSummary(budgetId: number, force = false) {
    const cached = state.summaryByBudget.get(budgetId)
    if (!force && cached && isFresh(cached.fetchedAt)) return cached.data
    const data = await budgetsApi.summary(budgetId)
    state.summaryByBudget.set(budgetId, { data, fetchedAt: Date.now() })
    return data
  }

  async function createExpenseOptimistic(budgetId: number, payload: { category_id: number; name: string; amount_total: number; due_date?: string | null; vendor?: string | null; notes?: string | null; status?: BudgetExpense['status'] }) {
    // Optimistically insert into first page
    const tempId = Math.floor(Math.random() * -1e9)
    const optimistic: BudgetExpense = {
      id: tempId,
      budget_id: budgetId,
      category_id: payload.category_id,
      name: payload.name,
      amount_total: payload.amount_total,
      amount_paid: 0,
      status: payload.status ?? 'planned',
      due_date: payload.due_date ?? null,
      vendor: payload.vendor ?? null,
      notes: payload.notes ?? null,
      category: undefined,
      payments: [],
    }
    let map = state.expensesByBudget.get(budgetId)
    if (!map) {
      map = new Map()
      state.expensesByBudget.set(budgetId, map)
    }
    const first = map.get(1)
    if (first) {
      first.data.data.unshift(optimistic)
      first.data.total += 1
    }
    try {
      const created = await budgetsApi.createExpense(budgetId, payload)
      if (first) {
        const idx = first.data.data.findIndex((e) => e.id === tempId)
        if (idx !== -1) first.data.data[idx] = created
      }
      // Invalidate summary cache
      state.summaryByBudget.delete(budgetId)
      return created
    } catch (e) {
      if (first) first.data.data = first.data.data.filter((e) => e.id !== tempId)
      throw e
    }
  }

  async function updateExpense(budgetId: number, expenseId: number, payload: Partial<Pick<BudgetExpense, 'category_id' | 'name' | 'amount_total' | 'due_date' | 'vendor' | 'notes' | 'status'>>) {
    const updated = await budgetsApi.updateExpense(budgetId, expenseId, payload)
    const pages = state.expensesByBudget.get(budgetId)
    pages?.forEach((entry) => {
      const idx = entry.data.data.findIndex((e) => e.id === expenseId)
      if (idx !== -1) entry.data.data[idx] = updated
    })
    state.summaryByBudget.delete(budgetId)
    return updated
  }

  async function deleteExpense(budgetId: number, expenseId: number) {
    await budgetsApi.removeExpense(budgetId, expenseId)
    const pages = state.expensesByBudget.get(budgetId)
    pages?.forEach((entry) => {
      entry.data.data = entry.data.data.filter((e) => e.id !== expenseId)
      entry.data.total = Math.max(0, entry.data.total - 1)
    })
    state.summaryByBudget.delete(budgetId)
  }

  async function loadPayments(expenseId: number, force = false) {
    const cached = state.paymentsByExpense.get(expenseId)
    if (!force && cached && isFresh(cached.fetchedAt)) return cached.data
    // We need budgetId too; find from expenses cache
    let budgetId: number | null = null
    outer: for (const [bId, pages] of state.expensesByBudget.entries()) {
      for (const entry of pages.values()) {
        const found = entry.data.data.find((e) => e.id === expenseId)
        if (found) {
          budgetId = bId
          break outer
        }
      }
    }
    if (!budgetId) throw new Error('Budget not found for expense')
    const payments = await budgetsApi.listPayments(budgetId, expenseId)
    state.paymentsByExpense.set(expenseId, { data: payments, fetchedAt: Date.now() })
    return payments
  }

  async function createPaymentOptimistic(budgetId: number, expenseId: number, payload: { amount: number; is_deposit?: boolean; paid_at?: string; method?: string | null; note?: string | null }) {
    const tempId = Math.floor(Math.random() * -1e9)
    const optimistic: BudgetPayment = {
      id: tempId,
      expense_id: expenseId,
      amount: payload.amount,
      is_deposit: !!payload.is_deposit,
      paid_at: payload.paid_at ?? new Date().toISOString(),
      method: payload.method ?? null,
      note: payload.note ?? null,
    }
    const existing = state.paymentsByExpense.get(expenseId)
    if (existing) existing.data.unshift(optimistic)
    else state.paymentsByExpense.set(expenseId, { data: [optimistic], fetchedAt: Date.now() })
    // Also update expense amount_paid/status locally
    const pages = state.expensesByBudget.get(budgetId)
    pages?.forEach((entry) => {
      const exp = entry.data.data.find((e) => e.id === expenseId)
      if (exp) {
        exp.amount_paid = (exp.amount_paid ?? 0) + payload.amount
        if (exp.amount_paid <= 0) exp.status = 'planned'
        else if (exp.amount_paid < exp.amount_total) exp.status = 'deposit_paid'
        else exp.status = 'fully_paid'
      }
    })
    try {
      const created = await budgetsApi.createPayment(budgetId, expenseId, payload)
      const list = state.paymentsByExpense.get(expenseId)
      if (list) {
        const idx = list.data.findIndex((p) => p.id === tempId)
        if (idx !== -1) list.data[idx] = created
      }
      state.summaryByBudget.delete(budgetId)
      return created
    } catch (e) {
      // rollback
      const list = state.paymentsByExpense.get(expenseId)
      if (list) list.data = list.data.filter((p) => p.id !== tempId)
      // Invalidate and refetch expense list on next use
      state.expensesByBudget.delete(budgetId)
      throw e
    }
  }

  return {
    ...toRefs(state),
    loadBudgets,
    createBudget,
    loadBudget,
    loadCategories,
    loadExpenses,
    loadSummary,
    createExpenseOptimistic,
    updateExpense,
    deleteExpense,
    loadPayments,
    createPaymentOptimistic,
  }
}



