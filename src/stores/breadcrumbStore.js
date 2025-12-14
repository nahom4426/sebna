import { create } from 'zustand';

export const useBreadcrumbStore = create((set) => ({
  breadcrumbs: [],
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
}));
