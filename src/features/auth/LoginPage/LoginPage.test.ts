import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import LoginPage from './LoginPage.vue';

// Mock the auth store
vi.mock('@/store/auth', () => ({
  useAuth: () => ({
    login: vi.fn(),
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

describe('LoginPage', () => {
  it('renders login form correctly', () => {
    const wrapper = mount(LoginPage);
    
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('shows welcome message', () => {
    const wrapper = mount(LoginPage);
    
    expect(wrapper.text()).toContain('Welcome back');
  });

  it('has navigation links', () => {
    const wrapper = mount(LoginPage);
    
    expect(wrapper.text()).toContain('Create account');
    expect(wrapper.text()).toContain('Forgot password?');
  });
});


