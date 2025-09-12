import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ChecklistDetailPage from './ChecklistDetailPage.vue';

// Mock the checklists store
vi.mock('@/store/checklists', () => ({
  useChecklists: () => ({
    current: { value: null },
    loading: false,
    error: null,
    loadChecklist: vi.fn(),
    updateChecklist: vi.fn(),
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
    createSubtask: vi.fn(),
    updateSubtask: vi.fn(),
    deleteSubtask: vi.fn(),
  }),
}));

// Mock the auth store
vi.mock('@/store/auth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Test User' },
  }),
}));

// Mock the router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: { id: '1' },
  }),
}));

describe('ChecklistDetailPage', () => {
  it('renders checklist detail page correctly', () => {
    const wrapper = mount(ChecklistDetailPage);
    
    expect(wrapper.find('ion-page').exists()).toBe(true);
    expect(wrapper.find('ion-header').exists()).toBe(true);
    expect(wrapper.find('ion-content').exists()).toBe(true);
  });

  it('shows checklist title', () => {
    const wrapper = mount(ChecklistDetailPage);
    
    expect(wrapper.text()).toContain('Checklist');
  });

  it('has back button', () => {
    const wrapper = mount(ChecklistDetailPage);
    
    expect(wrapper.find('ion-back-button').exists()).toBe(true);
  });
});


