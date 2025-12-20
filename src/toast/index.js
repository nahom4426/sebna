import { useToastStore } from './store/toastStore';

function addToast(toast) {
  const { addToast: AT } = useToastStore.getState();
  AT(toast);
}

function removeToast(id) {
  const { removeToast: RT } = useToastStore.getState();
  RT(id);
}

export {
  addToast,
  removeToast,
};