import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SettingsPage from './SettingsPage.vue';

describe('SettingsPage', () => {
  it('renders settings page correctly', () => {
    const wrapper = mount(SettingsPage);
    
    expect(wrapper.find('ion-page').exists()).toBe(true);
    expect(wrapper.find('ion-header').exists()).toBe(true);
    expect(wrapper.find('ion-content').exists()).toBe(true);
  });

  it('shows settings title', () => {
    const wrapper = mount(SettingsPage);
    
    expect(wrapper.text()).toContain('Settings');
  });

  it('shows budget settings', () => {
    const wrapper = mount(SettingsPage);
    
    expect(wrapper.text()).toContain('Budget');
    expect(wrapper.text()).toContain('Currency');
    expect(wrapper.text()).toContain('Reminders');
  });
});


