import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { translations } from './translations';

const STORAGE_KEY = 'sebna_lang';

const defaultLang = (() => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && ['en', 'am', 'ti'].includes(saved)) return saved;
  } catch {
    // ignore
  }
  return 'en';
})();

const I18nContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(defaultLang);

  const setLang = useCallback((next) => {
    const normalized = String(next || '').toLowerCase();
    const safe = ['en', 'am', 'ti'].includes(normalized) ? normalized : 'en';
    setLangState(safe);
    try {
      window.localStorage.setItem(STORAGE_KEY, safe);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback(
    (key) => {
      const parts = String(key || '').split('.').filter(Boolean);
      if (parts.length === 0) return '';

      const dict = translations?.[lang] || translations?.en || {};
      let cur = dict;
      for (const p of parts) {
        cur = cur?.[p];
      }

      if (typeof cur === 'string') return cur;

      // fallback to en
      const fallbackDict = translations?.en || {};
      let cur2 = fallbackDict;
      for (const p of parts) {
        cur2 = cur2?.[p];
      }
      if (typeof cur2 === 'string') return cur2;

      return key;
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

I18nProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useI18n() {
  return useContext(I18nContext);
}
