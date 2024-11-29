import { createListenerMiddleware } from '@reduxjs/toolkit';

import type { RootState } from '..';

const STORAGE_KEY = `${import.meta.env.VITE_CACHE_ID}-app-settings`;

export const persistenceMiddleware = createListenerMiddleware();

// Specify which parts of the state to persist
type PersistedAppState = Pick<
  RootState['app'],
  'defaultMeasurementUnit' | 'defaultLatLonFormat' | 'graticuleVisible'
>;

// Listen for any app settings changes
persistenceMiddleware.startListening({
  predicate: (action) => {
    // Match any action from the app slice that modifies settings
    return action.type.startsWith('app/set');
  },
  effect: (_action, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const settingsToStore: PersistedAppState = {
      defaultMeasurementUnit: state.app.defaultMeasurementUnit,
      defaultLatLonFormat: state.app.defaultLatLonFormat,
      graticuleVisible: state.app.graticuleVisible,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToStore));
  },
});

// Helper to get persisted state
export const getPersistedAppState = (): Partial<PersistedAppState> => {
  try {
    const persistedState = localStorage.getItem(STORAGE_KEY);
    return persistedState ? JSON.parse(persistedState) : {};
  } catch (error) {
    console.error('Failed to parse persisted state:', error);
    return {};
  }
};
