import { useEffect, useState, useCallback } from 'react';

export function useTelegram() {
  const [webApp, setWebApp] = useState(null);
  const [user, setUser] = useState(null);
  const [colorScheme, setColorScheme] = useState('dark');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user || null);
      setColorScheme(tg.colorScheme || 'dark');

      const handleThemeChange = () => {
        setColorScheme(tg.colorScheme || 'dark');
      };

      tg.onEvent('themeChanged', handleThemeChange);
      return () => {
        tg.offEvent('themeChanged', handleThemeChange);
      };
    }
  }, []);

  const triggerHaptic = useCallback((style = 'light') => {
    try {
      const tg = window.Telegram?.WebApp;
      if (tg?.HapticFeedback) {
        if (style === 'success' || style === 'warning' || style === 'error') {
          tg.HapticFeedback.notificationOccurred(style);
        } else if (style === 'selection') {
          tg.HapticFeedback.selectionChanged();
        } else {
          tg.HapticFeedback.impactOccurred(style); // 'light', 'medium', 'heavy', 'rigid', 'soft'
        }
      }
    } catch (e) {
      console.warn('Haptic feedback not supported:', e);
    }
  }, []);

  const closeApp = useCallback(() => {
    webApp?.close();
  }, [webApp]);

  return {
    webApp,
    user: user || {
      first_name: 'Алексей',
      last_name: 'Фитнес',
      username: 'alex_fit',
      photo_url: null
    },
    colorScheme,
    triggerHaptic,
    closeApp
  };
}
