import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ExpenseDetail from './ExpenseDetail.vue';

// Mock the budget store
vi.mock('@/store/budget', () => ({
  useBudget: () => ({
    loadExpenses: vi.fn(),
    loadPayments: vi.fn(),
    loadSummary: vi.fn(),
    expensesByBudget: { value: new Map() },
    paymentsByExpense: { value: new Map() },
    summaryByBudget: { value: new Map() },
  }),
}));

// Mock the router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '1', expenseId: '1' },
  }),
}));

// Mock the widget
vi.mock('@/widgets/AddPaymentModal.vue', () => ({ default: { name: 'AddPaymentModal' } }));

describe('ExpenseDetail', () => {
  it('renders expense detail page correctly', () => {
    const wrapper = mount(ExpenseDetail);
    
    expect(wrapper.find('ion-page').exists()).toBe(true);
    expect(wrapper.find('ion-header').exists()).toBe(true);
    expect(wrapper.find('ion-content').exists()).toBe(true);
  });

  it('shows expense title', () => {
    const wrapper = mount(ExpenseDetail);
    
    expect(wrapper.text()).toContain('Expense');
  });

  it('shows payments header', () => {
    const wrapper = mount(ExpenseDetail);
    
    expect(wrapper.text()).toContain('Payments');
  });
});


