import type { ReducersMapObject } from '@reduxjs/toolkit';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

const staticReducers = {};

const asyncReducers = {};

const createReducer = (reducers: ReducersMapObject) =>
  combineReducers({
    ...staticReducers,
    ...reducers,
  });

const store = configureStore({
  reducer: createReducer(asyncReducers),
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({}),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
