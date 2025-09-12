import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ForgotPage from './ForgotPage.vue';

// Mock the auth store
vi.mock('@/store/auth', () => ({
  useAuth: () => ({
    forgot: vi.fn().mockResolvedValue({ message: 'Reset link sent' }),
  }),
}));

describe('ForgotPage', () => {
  it('renders password reset form correctly', () => {
    const wrapper = mount(ForgotPage);
    
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input[type="email"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true);
  });

  it('shows password reset title', () => {
    const wrapper = mount(ForgotPage);
    
    expect(wrapper.text()).toContain('Password reset');
  });

  it('shows send reset link button', () => {
    const wrapper = mount(ForgotPage);
    
    expect(wrapper.text()).toContain('Send reset link');
  });
});


