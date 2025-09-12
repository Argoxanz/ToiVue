import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import RegisterPage from './RegisterPage.vue';

// Mock the auth store
vi.mock('@/store/auth', () => ({
  useAuth: () => ({
    register: vi.fn(),
    error: null,
    loading: false,
  }),
}));

// Mock the router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

describe('RegisterPage', () => {
  it('renders registration form correctly', () => {
    const wrapper = mount(RegisterPage);
    
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="tel"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('shows create account message', () => {
    const wrapper = mount(RegisterPage);
    
    expect(wrapper.text()).toContain('Create your account');
  });

  it('has navigation link to login', () => {
    const wrapper = mount(RegisterPage);
    
    expect(wrapper.text()).toContain('Have an account? Sign in');
  });
});


