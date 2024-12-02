import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MeasurementUnit } from '@/features/arcgis/hooks/measurements/types';
import { LatLonFormat } from '@/types';

import { RootState } from '..';
import { getPersistedAppState } from '../middleware/persistenceMiddleware';

interface AppState {
  graticuleVisible: boolean;
  defaultMeasurementUnit: MeasurementUnit;
  defaultLatLonFormat: LatLonFormat;
  localTimeOffset: number;
}

const initialState: AppState = {
  graticuleVisible: true,
  defaultMeasurementUnit: 'nautical-miles',
  defaultLatLonFormat: 'DMS',
  localTimeOffset: 0,
  ...getPersistedAppState(),
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setGraticuleVisible: (state, action: PayloadAction<boolean>) => {
      state.graticuleVisible = action.payload;
    },
    setDefaultMeasurementUnit: (state, action: PayloadAction<MeasurementUnit>) => {
      state.defaultMeasurementUnit = action.payload;
    },
    setDefaultLatLonFormat: (state, action: PayloadAction<LatLonFormat>) => {
      state.defaultLatLonFormat = action.payload;
    },
    setLocalTimeOffset: (state, action: PayloadAction<number>) => {
      state.localTimeOffset = action.payload;
    },
  },
});

export const {
  setGraticuleVisible,
  setDefaultMeasurementUnit,
  setDefaultLatLonFormat,
  setLocalTimeOffset,
} = appSlice.actions;

const selectAppState = (state: RootState) => state.app;
export const selectGraticuleVisible = createSelector(
  selectAppState,
  (state) => state.graticuleVisible,
);
export const selectDefaultMeasurementUnit = createSelector(
  selectAppState,
  (state) => state.defaultMeasurementUnit,
);
export const selectDefaultLatLonFormat = createSelector(
  selectAppState,
  (state) => state.defaultLatLonFormat,
);
export const selectLocalTimeOffset = createSelector(
  selectAppState,
  (state) => state.localTimeOffset,
);

export default appSlice.reducer;
