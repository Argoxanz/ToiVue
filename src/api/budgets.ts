import http from './http'

export type Paginated<T> = {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type Budget = {
  id: number
  user_id: number
  name: string | null
  total_amount: number
  currency: string
}

export type BudgetCategory = {
  id: number
  budget_id: number
  parent_id: number | null
  name: string
  is_default: boolean
  sort_order: number
  allocation_percent: number | null
  allocation_amount: number | null
  children?: BudgetCategory[]
}

export type BudgetPayment = {
  id: number
  expense_id: number
  amount: number
  is_deposit: boolean
  paid_at: string
  method: string | null
  note: string | null
}

export type BudgetExpense = {
  id: number
  budget_id: number
  category_id: number
  name: string
  amount_total: number
  amount_paid: number
  status: 'planned' | 'deposit_paid' | 'fully_paid'
  due_date: string | null
  vendor: string | null
  notes: string | null
  category?: BudgetCategory
  payments?: BudgetPayment[]
}

export type BudgetSummary = {
  budget: {
    id: number
    currency: string
    total: number
    planned_total: number
    spent_total: number
    remaining_total: number
    exceeded: boolean
  }
  categories: Array<{
    id: number
    name: string
    planned: number
    spent: number
    allocation: number | null
    remaining: number | null
    exceeded: boolean
  }>
}

export const budgetsApi = {
  async list(page = 1): Promise<Paginated<Budget>> {
    const { data } = await http.get<Paginated<Budget>>('/budgets', { params: { page } })
    return data
  },

  async create(payload: { name?: string | null; total_amount: number; currency?: string }): Promise<Budget> {
    const { data } = await http.post<Budget>('/budgets', payload)
    return data
  },

  async get(id: number): Promise<Budget & { categories: BudgetCategory[]; expenses: BudgetExpense[] }> {
    const { data } = await http.get<Budget & { categories: BudgetCategory[]; expenses: BudgetExpense[] }>(`/budgets/${id}`)
    return data
  },

  async update(id: number, payload: Partial<Pick<Budget, 'name' | 'total_amount' | 'currency'>>): Promise<Budget> {
    const { data } = await http.put<Budget>(`/budgets/${id}`, payload)
    return data
  },

  async remove(id: number): Promise<void> {
    await http.delete(`/budgets/${id}`)
  },

  async listCategories(budgetId: number): Promise<BudgetCategory[]> {
    const { data } = await http.get<BudgetCategory[]>(`/budgets/${budgetId}/categories`)
    return data
  },

  async createCategory(
    budgetId: number,
    payload: Partial<Pick<BudgetCategory, 'name' | 'parent_id' | 'sort_order' | 'allocation_percent' | 'allocation_amount'>> & { name: string }
  ): Promise<BudgetCategory> {
    const { data } = await http.post<BudgetCategory>(`/budgets/${budgetId}/categories`, payload)
    return data
  },

  async updateCategory(
    budgetId: number,
    categoryId: number,
    payload: Partial<Pick<BudgetCategory, 'name' | 'parent_id' | 'sort_order' | 'allocation_percent' | 'allocation_amount'>>
  ): Promise<BudgetCategory> {
    const { data } = await http.put<BudgetCategory>(`/budgets/${budgetId}/categories/${categoryId}`, payload)
    return data
  },

  async removeCategory(budgetId: number, categoryId: number): Promise<void> {
    await http.delete(`/budgets/${budgetId}/categories/${categoryId}`)
  },

  async listExpenses(budgetId: number, page = 1): Promise<Paginated<BudgetExpense>> {
    const { data } = await http.get<Paginated<BudgetExpense>>(`/budgets/${budgetId}/expenses`, { params: { page } })
    return data
  },

  async createExpense(
    budgetId: number,
    payload: Partial<Pick<BudgetExpense, 'category_id' | 'name' | 'amount_total' | 'due_date' | 'vendor' | 'notes' | 'status'>> & {
      category_id: number
      name: string
      amount_total: number
    }
  ): Promise<BudgetExpense> {
    const { data } = await http.post<BudgetExpense>(`/budgets/${budgetId}/expenses`, payload)
    return data
  },

  async updateExpense(
    budgetId: number,
    expenseId: number,
    payload: Partial<Pick<BudgetExpense, 'category_id' | 'name' | 'amount_total' | 'due_date' | 'vendor' | 'notes' | 'status'>>
  ): Promise<BudgetExpense> {
    const { data } = await http.put<BudgetExpense>(`/budgets/${budgetId}/expenses/${expenseId}`, payload)
    return data
  },

  async removeExpense(budgetId: number, expenseId: number): Promise<void> {
    await http.delete(`/budgets/${budgetId}/expenses/${expenseId}`)
  },

  async listPayments(budgetId: number, expenseId: number): Promise<BudgetPayment[]> {
    const { data } = await http.get<BudgetPayment[]>(`/budgets/${budgetId}/expenses/${expenseId}/payments`)
    return data
  },

  async createPayment(
    budgetId: number,
    expenseId: number,
    payload: { amount: number; is_deposit?: boolean; paid_at?: string; method?: string | null; note?: string | null }
  ): Promise<BudgetPayment> {
    const { data } = await http.post<BudgetPayment>(`/budgets/${budgetId}/expenses/${expenseId}/payments`, payload)
    return data
  },

  async removePayment(budgetId: number, expenseId: number, paymentId: number): Promise<void> {
    await http.delete(`/budgets/${budgetId}/expenses/${expenseId}/payments/${paymentId}`)
  },

  async summary(budgetId: number): Promise<BudgetSummary> {
    const { data } = await http.get<BudgetSummary>(`/budgets/${budgetId}/summary`)
    return data
  },
}



