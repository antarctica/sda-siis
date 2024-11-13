import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MapCRS } from '@/types';

import { RootState } from '..';

interface ProjectionState {
  currentCRS?: MapCRS;
}

const initialState: ProjectionState = {
  currentCRS: undefined,
};

export const projectionSlice = createSlice({
  name: 'projection',
  initialState,
  reducers: {
    setCurrentCRS: (state, action: PayloadAction<MapCRS>) => {
      state.currentCRS = action.payload;
    },
  },
});

export const { setCurrentCRS } = projectionSlice.actions;

const selectProjectionState = (state: RootState) => state.crs;
export const selectCurrentCRS = createSelector(selectProjectionState, (state) => state.currentCRS);

export default projectionSlice.reducer;
