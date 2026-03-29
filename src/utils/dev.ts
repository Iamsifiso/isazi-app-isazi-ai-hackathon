/**
 * Development utilities for testing
 */

/**
 * Clear all app data and reload
 * Use in browser console: window.clearAppData()
 */
export const clearAppData = () => {
  if (confirm('Clear all app data and restart? This cannot be undone.')) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  }
};

// Expose to window for easy access in console
if (typeof window !== 'undefined') {
  (window as any).clearAppData = clearAppData;
}

/**
 * Reset to specific screen for testing
 */
export const goToScreen = (screen: string) => {
  localStorage.setItem('izwi-onboarded', screen === 'home' ? 'true' : 'false');
  window.location.reload();
};

if (typeof window !== 'undefined') {
  (window as any).goToScreen = goToScreen;
}

/**
 * Log current app state
 */
export const debugState = () => {
  console.log('=== IZWI App State ===');
  console.log('User Data:', localStorage.getItem('izwi-user-data'));
  console.log('Onboarded:', localStorage.getItem('izwi-onboarded'));
  console.log('All Storage:', { ...localStorage });
};

if (typeof window !== 'undefined') {
  (window as any).debugState = debugState;
}
