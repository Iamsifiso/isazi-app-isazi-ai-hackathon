import { createContext, useContext, useState, ReactNode } from 'react';
import { UserData, NavigationMode, ScreenName } from '../types';

interface AppContextType {
  userData: UserData;
  currentScreen: ScreenName;
  isFirstTimeUser: boolean;
  updateUserData: (data: Partial<UserData>) => void;
  navigateToScreen: (screen: ScreenName) => void;
  setNavigationMode: (mode: NavigationMode) => void;
  completeOnboarding: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialUserData: UserData = {
  name: '',
  medicalConditions: [],
  otherCondition: '',
  navigationMode: null,
  selectedLanguage: 'en-ZA',
};

export const clearAllData = () => {
  localStorage.clear();
  window.location.reload();
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(() => {
    const stored = localStorage.getItem('izwi-user-data');
    return stored ? JSON.parse(stored) : initialUserData;
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenName>(() => {
    const isOnboarded = localStorage.getItem('izwi-onboarded');
    return isOnboarded === 'true' ? 'home' : 'splash';
  });

  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(() => {
    return localStorage.getItem('izwi-onboarded') !== 'true';
  });

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('izwi-user-data', JSON.stringify(updated));
      return updated;
    });
  };

  const navigateToScreen = (screen: ScreenName) => {
    setCurrentScreen(screen);
  };

  const setNavigationMode = (mode: NavigationMode) => {
    updateUserData({ navigationMode: mode });
  };

  const completeOnboarding = () => {
    localStorage.setItem('izwi-onboarded', 'true');
    setIsFirstTimeUser(false);
    navigateToScreen('home');
  };

  return (
    <AppContext.Provider
      value={{
        userData,
        currentScreen,
        isFirstTimeUser,
        updateUserData,
        navigateToScreen,
        setNavigationMode,
        completeOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
