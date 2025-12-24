import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import AppRouter from '@/router';
import Toasts from '@/toast/Toasts';
import { useLocation } from 'react-router-dom';

function App() {
  const restoreAuth = useAuthStore((state) => state.restoreAuth);
  const location = useLocation();
  const [routeLoading, setRouteLoading] = useState(true);

  useEffect(() => {
    // Restore auth from localStorage on app load
    restoreAuth();
  }, [restoreAuth]);

  useEffect(() => {
    const el = document.getElementById('app-preloader');
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }, []);

  useEffect(() => {
    setRouteLoading(true);
    const id = window.setTimeout(() => setRouteLoading(false), 350);
    return () => window.clearTimeout(id);
  }, [location.pathname]);

  return (
    <>
      {routeLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_circle_at_20%_20%,rgba(244,59,17,0.22),transparent_55%),radial-gradient(1000px_circle_at_80%_70%,rgba(0,23,75,0.30),transparent_55%),linear-gradient(135deg,#00174b_0%,#f43b11_100%)]" />
          <div className="relative text-center text-white/90">
            <div className="text-4xl md:text-5xl font-extrabold tracking-[0.18em] mb-4">SEBNA</div>
            <div className="h-2 w-64 bg-white/20 rounded-full overflow-hidden mx-auto">
              <div className="h-full w-1/2 bg-gradient-to-r from-white/20 via-white to-white/20 animate-loading-bar" />
            </div>
          </div>
        </div>
      )}
      <AppRouter />
      <Toasts />
    </>
  );
}

export default App;
