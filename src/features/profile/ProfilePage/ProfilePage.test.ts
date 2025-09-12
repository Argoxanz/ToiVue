import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ProfilePage from './ProfilePage.vue';

// Mock the auth store
vi.mock('@/store/auth', () => ({
  useAuth: () => ({
    user: { id: 1, name: 'Test User', email: 'test@example.com', phone: '+1234567890', role: 'user' },
    loadUserIfAuthenticated: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Mock the router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    replace: vi.fn(),
  }),
}));

describe('ProfilePage', () => {
  it('renders profile page correctly', () => {
    const wrapper = mount(ProfilePage);
    
    expect(wrapper.find('ion-page').exists()).toBe(true);
    expect(wrapper.find('ion-header').exists()).toBe(true);
    expect(wrapper.find('ion-content').exists()).toBe(true);
  });

  it('shows profile title', () => {
    const wrapper = mount(ProfilePage);
    
    expect(wrapper.text()).toContain('Profile');
  });

  it('shows user information', () => {
    const wrapper = mount(ProfilePage);
    
    expect(wrapper.text()).toContain('Test User');
    expect(wrapper.text()).toContain('test@example.com');
  });
});


