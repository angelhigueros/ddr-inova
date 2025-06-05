'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { hydratePlans } from '@/store/plansSlice';
import { hydrateTracking } from '@/store/trackingSlice';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hydrate the store with localStorage data after client-side mounting
    store.dispatch(hydratePlans());
    store.dispatch(hydrateTracking());
  }, []);

  return <Provider store={store}>{children}</Provider>;
} 