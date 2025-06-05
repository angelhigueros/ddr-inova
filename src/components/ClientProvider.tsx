'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { hydratePlans } from '@/store/plansSlice';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Hydrate the store with localStorage data after client-side mounting
    store.dispatch(hydratePlans());
  }, []);

  return <Provider store={store}>{children}</Provider>;
} 