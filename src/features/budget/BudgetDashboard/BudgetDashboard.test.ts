import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BudgetDashboard from './BudgetDashboard.vue';

// Mock the budget store
vi.mock('@/store/budget', () => ({
  useBudget: () => ({
    loadSummary: vi.fn().mockResolvedValue({
      budget: { total: 1000, planned_total: 500, exceeded: false, currency: 'KZT' },
      categories: []
    }),
  }),
}));

// Mock the router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '1' },
  }),
}));

// Mock the budgets API
vi.mock('@/api/budgets', () => ({
  budgetsApi: {
    removeCategory: vi.fn(),
  },
}));

// Mock the widgets
vi.mock('@/widgets/EditBudgetModal.vue', () => ({ default: { name: 'EditBudgetModal' } }));
vi.mock('@/widgets/AddCategoryModal.vue', () => ({ default: { name: 'AddCategoryModal' } }));
vi.mock('@/widgets/EditCategoryModal.vue', () => ({ default: { name: 'EditCategoryModal' } }));
vi.mock('@/widgets/AddExpenseModal.vue', () => ({ default: { name: 'AddExpenseModal' } }));

describe('BudgetDashboard', () => {
  it('renders budget dashboard correctly', () => {
    const wrapper = mount(BudgetDashboard);
    
    expect(wrapper.find('ion-page').exists()).toBe(true);
    expect(wrapper.find('ion-header').exists()).toBe(true);
    expect(wrapper.find('ion-content').exists()).toBe(true);
  });

  it('shows budget title', () => {
    const wrapper = mount(BudgetDashboard);
    
    expect(wrapper.text()).toContain('Budget');
  });

  it('has refresh functionality', () => {
    const wrapper = mount(BudgetDashboard);
    
    expect(wrapper.find('ion-refresher').exists()).toBe(true);
  });
});


