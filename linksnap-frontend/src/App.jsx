import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import MyLinks from "./pages/MyLinks";
import Auth from "./pages/Auth";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { NavigationProvider, useNavigation } from "./context/NavigationContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

function AppContent() {
  const { darkMode } = useTheme();
  const { activeTab } = useNavigation();
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#0c1222]' : 'bg-[#f8fafc]'}`}>
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Auth />;
  }
  
  const renderPage = () => {
    switch (activeTab) {
      case "analytics":
        return <Analytics />;
      case "links":
        return <MyLinks />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen font-[Inter,sans-serif] transition-colors duration-300 ${
      darkMode ? 'bg-[#0c1222] text-white' : 'bg-[#f8fafc] text-[#0f172a]'
    }`}>
      <Header />
      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NavigationProvider>
          <AppContent />
        </NavigationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
