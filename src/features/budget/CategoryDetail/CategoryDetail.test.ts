import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import CategoryDetail from './CategoryDetail.vue';

// Mock the budget store
vi.mock('@/store/budget', () => ({
  useBudget: () => ({
    loadExpenses: vi.fn(),
    loadSummary: vi.fn(),
    expensesByBudget: { value: new Map() },
    summaryByBudget: { value: new Map() },
  }),
}));

// Mock the router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '1', categoryId: '1' },
  }),
}));

// Mock the widget
vi.mock('@/widgets/AddExpenseModal.vue', () => ({ default: { name: 'AddExpenseModal' } }));

describe('CategoryDetail', () => {
  it('renders category detail page correctly', () => {
    const wrapper = mount(CategoryDetail);
    
    expect(wrapper.find('ion-page').exists()).toBe(true);
    expect(wrapper.find('ion-header').exists()).toBe(true);
    expect(wrapper.find('ion-content').exists()).toBe(true);
  });

  it('shows category title', () => {
    const wrapper = mount(CategoryDetail);
    
    expect(wrapper.text()).toContain('Category');
  });

  it('shows expenses header', () => {
    const wrapper = mount(CategoryDetail);
    
    expect(wrapper.text()).toContain('Expenses');
  });
});


