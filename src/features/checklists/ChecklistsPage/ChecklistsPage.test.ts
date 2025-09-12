import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ChecklistsPage from './ChecklistsPage.vue';

// Mock the checklists store
vi.mock('@/store/checklists', () => ({
  useChecklists: () => ({
    templates: [],
    list: null,
    loading: false,
    error: null,
    loadTemplates: vi.fn(),
    loadList: vi.fn(),
    createChecklist: vi.fn().mockResolvedValue({ id: 1 }),
    deleteChecklist: vi.fn(),
  }),
}));

// Mock the router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('ChecklistsPage', () => {
  it('renders checklists page correctly', () => {
    const wrapper = mount(ChecklistsPage);
    
    expect(wrapper.find('ion-page').exists()).toBe(true);
    expect(wrapper.find('ion-header').exists()).toBe(true);
    expect(wrapper.find('ion-content').exists()).toBe(true);
  });

  it('shows checklists title', () => {
    const wrapper = mount(ChecklistsPage);
    
    expect(wrapper.text()).toContain('Checklists');
  });

  it('shows create checklist form', () => {
    const wrapper = mount(ChecklistsPage);
    
    expect(wrapper.text()).toContain('Create Checklist');
  });
});


