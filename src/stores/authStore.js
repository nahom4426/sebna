import { create } from 'zustand';

const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const LOGIN_TIMESTAMP_KEY = 'login_timestamp';
const AUTH_DATA_KEY = 'auth_data';
const IMAGE_DATA_KEY = 'image_data';

export const useAuthStore = create((set, get) => ({
  auth: null,
  imageData: '',
  logoutTimer: null,

  setAuth: (auth) => {
    console.log('[AuthStore] setAuth called with:', auth);
    set({ auth });

    if (auth) {
      localStorage.setItem(AUTH_DATA_KEY, JSON.stringify(auth));
      localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
      get().startLogoutTimer();
      console.log('[AuthStore] Auth set, session timer started', { auth });
    } else {
      get().clearAuthData();
    }
  },

  patchAuthUser: (patch = {}) => {
    const current = get().auth;
    if (!current?.user) return;
    const next = { ...current, user: { ...current.user, ...patch } };
    get().setAuth(next);
    localStorage.setItem('userDetail', JSON.stringify(next.user));
  },

  setProfile: (imageData) => {
    set({ imageData });
    if (imageData) {
      localStorage.setItem(IMAGE_DATA_KEY, imageData);
    } else {
      localStorage.removeItem(IMAGE_DATA_KEY);
    }
  },

  logout: () => {
    set({ auth: null, imageData: '' });
    get().clearLogoutTimer();

    // Clear all auth-related localStorage
    localStorage.removeItem('userDetail');
    localStorage.removeItem(AUTH_DATA_KEY);
    localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
    localStorage.removeItem(IMAGE_DATA_KEY);

    console.log('User logged out, session cleared');
  },

  resetLogoutTimer: () => {
    const { auth } = get();
    if (auth) {
      localStorage.setItem(LOGIN_TIMESTAMP_KEY, Date.now().toString());
      get().startLogoutTimer();
    }
  },

  startLogoutTimer: (duration = SESSION_DURATION) => {
    get().clearLogoutTimer();
    console.log('[AuthStore] Session timer started - will logout in', duration, 'ms');

    const timer = setTimeout(() => {
      console.log('[AuthStore] Session expired - executing logout');
      get().logout();
    }, duration);

    set({ logoutTimer: timer });
  },

  clearLogoutTimer: () => {
    const { logoutTimer } = get();
    if (logoutTimer) {
      clearTimeout(logoutTimer);
      set({ logoutTimer: null });
    }
  },

  clearAuthData: () => {
    localStorage.removeItem(AUTH_DATA_KEY);
    localStorage.removeItem(LOGIN_TIMESTAMP_KEY);
    localStorage.removeItem(IMAGE_DATA_KEY);
  },

  initializeSession: () => {
    const loginTime = localStorage.getItem(LOGIN_TIMESTAMP_KEY);
    const authData = localStorage.getItem(AUTH_DATA_KEY);
    const imgData = localStorage.getItem(IMAGE_DATA_KEY);

    if (authData) {
      try {
        set({ auth: JSON.parse(authData) });
      } catch (e) {
        console.error('Failed to parse auth data', e);
        localStorage.removeItem(AUTH_DATA_KEY);
      }
    }

    if (imgData) {
      set({ imageData: imgData });
    }

    if (loginTime && get().auth) {
      const elapsed = Date.now() - parseInt(loginTime);
      const remaining = SESSION_DURATION - elapsed;

      if (remaining > 0) {
        get().startLogoutTimer(remaining);
      } else {
        get().logout();
      }
    }
  },

  restoreAuth: () => {
    const userDetail = localStorage.getItem('userDetail');
    if (userDetail) {
      try {
        const parsedDetail = JSON.parse(userDetail);
        get().setAuth({
          user: parsedDetail,
          accessToken: parsedDetail?.token,
        });
        return true;
      } catch (e) {
        localStorage.removeItem('userDetail');
        console.error('Failed to parse userDetail from localStorage', e);
        return false;
      }
    }
    return false;
  },
}));
