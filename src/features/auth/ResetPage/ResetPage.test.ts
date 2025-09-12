import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ResetPage from './ResetPage.vue';

// Mock the auth store
vi.mock('@/store/auth', () => ({
  useAuth: () => ({
    reset: vi.fn().mockResolvedValue({ message: 'Password reset successfully' }),
  }),
}));

// Mock the router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: { token: 'test-token', email: 'test@example.com' },
  }),
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

describe('ResetPage', () => {
  it('renders password reset form correctly', () => {
    const wrapper = mount(ResetPage);
    
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('input[type="password"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('shows set new password title', () => {
    const wrapper = mount(ResetPage);
    
    expect(wrapper.text()).toContain('Set a new password');
  });

  it('shows reset password button', () => {
    const wrapper = mount(ResetPage);
    
    expect(wrapper.text()).toContain('Reset Password');
  });
});


