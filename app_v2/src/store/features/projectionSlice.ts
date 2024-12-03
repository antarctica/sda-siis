import { Extent } from '@arcgis/core/geometry';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MapCRS } from '@/types';

import { RootState } from '..';

interface ProjectionState {
  currentCRS?: MapCRS;
  previousExtent: string | undefined;
}

const initialState: ProjectionState = {
  currentCRS: undefined,
  previousExtent: undefined,
};

export const projectionSlice = createSlice({
  name: 'projection',
  initialState,
  reducers: {
    setCurrentCRS: (state, action: PayloadAction<MapCRS>) => {
      state.currentCRS = action.payload;
    },
    setNewCRS: (state, action: PayloadAction<{ crs: MapCRS; extentJson: string }>) => {
      state.currentCRS = action.payload.crs;
      state.previousExtent = action.payload.extentJson;
    },
  },
});

export const { setCurrentCRS, setNewCRS } = projectionSlice.actions;

const selectProjectionState = (state: RootState) => state.crs;
export const selectCurrentCRS = createSelector(selectProjectionState, (state) => state.currentCRS);
export const selectPreviousExtent = createSelector(selectProjectionState, (state) =>
  state.previousExtent ? Extent.fromJSON(state.previousExtent) : undefined,
);

export default projectionSlice.reducer;
