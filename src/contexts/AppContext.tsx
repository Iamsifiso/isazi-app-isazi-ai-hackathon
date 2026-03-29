import { createContext, useContext, useState, ReactNode } from 'react';
import { UserData, NavigationMode, ScreenName } from '../types';
import { getStorageItem, setStorageItem } from '../utils/storage';

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
    return getStorageItem<UserData>('izwi-user-data', initialUserData);
  });

  const [currentScreen, setCurrentScreen] = useState<ScreenName>(() => {
    const isOnboarded = getStorageItem<boolean>('izwi-onboarded', false);
    return isOnboarded ? 'home' : 'splash';
  });

  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(() => {
    return !getStorageItem<boolean>('izwi-onboarded', false);
  });

  const updateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => {
      const updated = { ...prev, ...data };
      setStorageItem('izwi-user-data', updated);
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
    setStorageItem('izwi-onboarded', true);
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
