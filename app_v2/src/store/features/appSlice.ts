import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '..';

interface AppState {
  graticuleVisible: boolean;
}

const initialState: AppState = {
  graticuleVisible: true,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setGraticuleVisible: (state, action: PayloadAction<boolean>) => {
      state.graticuleVisible = action.payload;
    },
  },
});

export const { setGraticuleVisible } = appSlice.actions;

const selectAppState = (state: RootState) => state.app;
export const selectGraticuleVisible = createSelector(
  selectAppState,
  (state) => state.graticuleVisible,
);

export default appSlice.reducer;
