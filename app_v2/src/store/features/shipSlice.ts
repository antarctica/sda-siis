import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '..';

interface ShipState {
  followShip: boolean;
  sensorInfoPanelOpen: boolean;
  showDistanceCircles: boolean;
}

const initialState: ShipState = {
  followShip: false,
  sensorInfoPanelOpen: true,
  showDistanceCircles: true,
};

export const shipSlice = createSlice({
  name: 'ship',
  initialState,
  reducers: {
    setFollowShip: (state, action: PayloadAction<boolean>) => {
      state.followShip = action.payload;
    },
    setShowDistanceCircles: (state, action: PayloadAction<boolean>) => {
      state.showDistanceCircles = action.payload;
    },
    setSensorInfoPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.sensorInfoPanelOpen = action.payload;
    },
    reset: (state) => ({ ...initialState, sensorInfoPanelOpen: state.sensorInfoPanelOpen }),
  },
});

export const { setFollowShip, setSensorInfoPanelOpen, reset, setShowDistanceCircles } =
  shipSlice.actions;

const selectShipState = (state: RootState) => state.ship;
export const selectFollowShip = createSelector(selectShipState, (state) => state.followShip);
export const selectSensorInfoPanelOpen = createSelector(
  selectShipState,
  (state) => state.sensorInfoPanelOpen,
);
export const selectShowDistanceCircles = createSelector(
  selectShipState,
  (state) => state.showDistanceCircles,
);

export default shipSlice.reducer;
