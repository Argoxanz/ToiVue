import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ExportPage from './ExportPage.vue';

// Mock the budget store
vi.mock('@/store/budget', () => ({
  useBudget: () => ({
    summaryByBudget: { value: new Map() },
  }),
}));

// Mock the router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: { budget: '1' },
    params: { id: '1' },
  }),
}));

// Mock the export libraries
vi.mock('xlsx', () => ({
  utils: {
    json_to_sheet: vi.fn(),
    book_new: vi.fn(),
    book_append_sheet: vi.fn(),
  },
  writeFile: vi.fn(),
}));

vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    autoTable: vi.fn(),
    save: vi.fn(),
  })),
}));

describe('ExportPage', () => {
  it('renders export page correctly', () => {
    const wrapper = mount(ExportPage);
    
    expect(wrapper.find('ion-page').exists()).toBe(true);
    expect(wrapper.find('ion-header').exists()).toBe(true);
    expect(wrapper.find('ion-content').exists()).toBe(true);
  });

  it('shows export title', () => {
    const wrapper = mount(ExportPage);
    
    expect(wrapper.text()).toContain('Export');
  });

  it('shows export buttons', () => {
    const wrapper = mount(ExportPage);
    
    expect(wrapper.text()).toContain('Export XLSX');
    expect(wrapper.text()).toContain('Export PDF');
  });
});


