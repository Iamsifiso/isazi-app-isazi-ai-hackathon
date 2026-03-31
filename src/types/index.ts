export type NavigationMode = 'voice' | 'visual' | null;

export type OrbState = 'idle' | 'speaking' | 'listening';

export interface UserData {
  name: string;
  medicalConditions: string[];
  otherCondition?: string;
  navigationMode: NavigationMode;
  selectedLanguage: string;
}

export interface MedicalCondition {
  id: string;
  label: string;
  selected: boolean;
}

export interface Language {
  id: string;
  name: string;
  native: string;
  code: string;
}

export interface QuickPhrase {
  id: string;
  text: string;
}

export interface GestureEvent {
  type: 'swipe-left' | 'swipe-right' | 'double-tap';
  timestamp: number;
}

export type ScreenName =
  | 'splash'
  | 'welcome'
  | 'name'
  | 'medical'
  | 'home'
  | 'speak'
  | 'see'
  | 'sign'
  | 'about';
