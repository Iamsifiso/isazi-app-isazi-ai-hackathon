import { useApp } from './contexts/AppContext';
import { SplashScreen } from './screens/SplashScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';
import { NameScreen } from './screens/NameScreen';
import { MedicalScreen } from './screens/MedicalScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SpeakScreen } from './screens/SpeakScreen';
import { SeeScreen } from './screens/SeeScreen';
import './App.css';

function App() {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen />;
      case 'welcome':
        return <WelcomeScreen />;
      case 'name':
        return <NameScreen />;
      case 'medical':
        return <MedicalScreen />;
      case 'home':
        return <HomeScreen />;
      case 'speak':
        return <SpeakScreen />;
      case 'see':
        return <SeeScreen />;
      default:
        return <SplashScreen />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

export default App;
