import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Global test setup
config.global.mocks = {
  $router: {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  },
  $route: {
    path: '/',
    params: {},
    query: {},
    meta: {},
  },
};

// Mock Ionic components
config.global.stubs = {
  'ion-page': true,
  'ion-header': true,
  'ion-toolbar': true,
  'ion-title': true,
  'ion-content': true,
  'ion-button': true,
  'ion-input': true,
  'ion-item': true,
  'ion-label': true,
  'ion-card': true,
  'ion-card-header': true,
  'ion-card-title': true,
  'ion-card-content': true,
  'ion-loading': true,
  'ion-text': true,
  'ion-tabs': true,
  'ion-tab-bar': true,
  'ion-tab-button': true,
  'ion-icon': true,
  'ion-router-outlet': true,
};
