import { create } from 'zustand';

function* getId() {
  let id = 0;
  while (true) {
    yield `${++id}`;
  }
}

const id = getId();

export const useToastStore = create((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    set((state) => ({
      toasts: [...state.toasts, { id: id.next().value, toast }],
    }));
  },

  removeToast: (idToRemove) => {
    console.log('Removing toast:', idToRemove, get().toasts);
    set((state) => ({
      toasts: state.toasts.filter((el) => el.id !== idToRemove),
    }));
  },
}));
