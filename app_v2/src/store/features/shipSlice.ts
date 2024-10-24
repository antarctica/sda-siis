import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '..';

interface ShipState {
  followShip: boolean;
}

const initialState: ShipState = {
  followShip: false,
};

export const shipSlice = createSlice({
  name: 'ship',
  initialState,
  reducers: {
    setFollowShip: (state, action: PayloadAction<boolean>) => {
      state.followShip = action.payload;
    },
  },
});

export const { setFollowShip } = shipSlice.actions;

const selectShipState = (state: RootState) => state.ship;
export const selectFollowShip = createSelector(selectShipState, (state) => state.followShip);

export default shipSlice.reducer;
