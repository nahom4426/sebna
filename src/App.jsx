import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import AppRouter from '@/router';
import Toasts from '@/toast/Toasts';

function App() {
  const restoreAuth = useAuthStore((state) => state.restoreAuth);

  useEffect(() => {
    // Restore auth from localStorage on app load
    restoreAuth();
  }, [restoreAuth]);

  return (
    <>
      <AppRouter />
      <Toasts />
    </>
  );
}

export default App;
