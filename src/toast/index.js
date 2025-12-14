import { useToastStore } from './store/toastStore';

function addToast(toast) {
  const { addToast: AT } = useToastStore();
  AT(toast);
}

function removeToast(id) {
  const { removeToast: RT } = useToastStore();
  RT(id);
}

export {
  addToast,
  removeToast,
};