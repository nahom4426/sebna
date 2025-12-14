import React from 'react';
import { useToastStore } from './store/toastStore';
import Toast from './Toast';

const Toasts = () => {
  const { toasts } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(({ id, toast }) => (
        <Toast key={id} toast={toast} id={id} />
      ))}
    </div>
  );
};

export default Toasts;
