import React, { useRef, useEffect, useState } from 'react';
import { useToastStore } from './store/toastStore';
import './toast.css';

const Toast = ({ toast, id }) => {
  const { removeToast } = useToastStore();
  const toastRef = useRef(null);
  const [height, setHeight] = useState(0);
  const timeoutRef = useRef(null);

  const removeT = () => {
    clearTimeout(timeoutRef.current);
    if (toastRef.current) {
      toastRef.current.classList.remove('enter');
      toastRef.current.classList.add('leave');
      toastRef.current.onanimationend = () => {
        id && removeToast(id);
      };
    } else {
      id && removeToast(id);
    }
  };

  const stay = () => {
    clearTimeout(timeoutRef.current);
  };

  const out = () => {
    timeoutRef.current = setTimeout(() => id && removeT(), 6000);
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(() => id && removeT(), 6000);
    return () => clearTimeout(timeoutRef.current);
  }, [id]);

  useEffect(() => {
    if (toastRef.current) {
      const h = toastRef.current.offsetHeight;
      setHeight(h);
      toastRef.current.style.setProperty('--height', `${h}px`);
      toastRef.current.classList.add('enter');
    }
  }, []);

  const getCloseIcon = () => {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>`;
  };

  const toastClasses = `
    relative rounded-md max-w-[50%] flex items-center p-4 gap-3 text-base shadow-md min-w-72 justify-between
    ${toast?.type === 'success' ? 'bg-[#02676B] text-[#F6F7FA]' : 'bg-yellow-200 border-l-4 border-red-500'}
  `;

  return (
    <div
      onMouseOut={out}
      onMouseOver={stay}
      ref={toastRef}
      onClick={removeT}
      className={toastClasses}
    >
      <p className="text-sm">{toast?.message}</p>
      <button
        className="min-w-4 min-h-4 flex-shrink-0 bg-dark/20 shadow-md rounded-full text-base-clr2 right-0 top-0 w-8 h-8 flex items-center justify-center self-start"
        dangerouslySetInnerHTML={{ __html: getCloseIcon() }}
      />
    </div>
  );
};

export default Toast;
