import { configureStore } from '@reduxjs/toolkit';
import plansReducer from './plansSlice';
import trackingReducer from './trackingSlice';

export const store = configureStore({
  reducer: {
    plans: plansReducer,
    tracking: trackingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for serializable check
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 