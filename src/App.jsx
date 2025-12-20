import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import AppRouter from '@/router';
import Toasts from '@/toast/Toasts';
import { getMyInstitutionMembership } from '@/pages/admin/institutions/api/InstitutionsApi';

function App() {
  const restoreAuth = useAuthStore((state) => state.restoreAuth);
  const auth = useAuthStore((state) => state.auth);
  const setInstitutionId = useAuthStore((state) => state.setInstitutionId);

  useEffect(() => {
    // Restore auth from localStorage on app load
    restoreAuth();
  }, [restoreAuth]);

  useEffect(() => {
    const hydrateInstitution = async () => {
      if (!auth?.accessToken) return;
      if (auth?.user?.institutionId) return;
      try {
        const res = await getMyInstitutionMembership();
        if (!res?.success) return;
        const data = res.data;
        const institutionId =
          data?.institutionId ||
          data?.institutionUuid ||
          data?.institution?.id ||
          data?.institution?.institutionId ||
          data?.institution?.uuid;
        if (institutionId) {
          setInstitutionId(institutionId);
        }
      } catch (e) {
      }
    };

    hydrateInstitution();
  }, [auth?.accessToken, auth?.user?.institutionId, setInstitutionId]);

  return (
    <>
      <AppRouter />
      <Toasts />
    </>
  );
}

export default App;
