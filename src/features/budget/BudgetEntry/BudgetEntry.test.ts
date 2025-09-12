import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BudgetEntry from './BudgetEntry.vue';

// Mock the budget store
vi.mock('@/store/budget', () => ({
  useBudget: () => ({
    loadBudgets: vi.fn(),
    budgets: { value: [] },
  }),
}));

// Mock the widget
vi.mock('@/widgets/AddBudgetModal.vue', () => ({ default: { name: 'AddBudgetModal' } }));

describe('BudgetEntry', () => {
  it('renders budget entry page correctly', () => {
    const wrapper = mount(BudgetEntry);
    
    expect(wrapper.find('ion-page').exists()).toBe(true);
    expect(wrapper.find('ion-header').exists()).toBe(true);
    expect(wrapper.find('ion-content').exists()).toBe(true);
  });

  it('shows budget title', () => {
    const wrapper = mount(BudgetEntry);
    
    expect(wrapper.text()).toContain('Budget');
  });

  it('shows settings button', () => {
    const wrapper = mount(BudgetEntry);
    
    expect(wrapper.text()).toContain('Settings');
  });
});


