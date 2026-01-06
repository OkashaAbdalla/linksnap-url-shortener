import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "../context/NavigationContext";
import { useAuth } from "../context/AuthContext";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const { activeTab, setActiveTab } = useNavigation();
  const { user, logout } = useAuth();

  const navItems = [
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "analytics", icon: "bar_chart", label: "Analytics" },
    { id: "links", icon: "link", label: "My Links" },
  ];

  const userInitial = user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
      darkMode ? 'bg-[#0c1222] border-gray-800' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between px-4 md:px-8 h-16 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
            </div>
            <h1 className={`text-xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>SnapLink</h1>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "text-cyan-400 border-b-2 border-cyan-400 rounded-none"
                    : `${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={toggleTheme} className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <span className="material-symbols-outlined">{darkMode ? "light_mode" : "dark_mode"}</span>
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-sm font-medium"
            >
              {userInitial}
            </button>
            
            {userMenuOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-xl border shadow-lg ${
                darkMode ? 'bg-[#1a2332] border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className={`px-4 py-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user?.name || "User"}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user?.email}
                  </p>
                </div>
                <button
                  onClick={() => { logout(); setUserMenuOpen(false); }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                    darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Sign Out
                </button>
              </div>
            )}
          </div>
          
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`md:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <span className="material-symbols-outlined">{mobileMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className={`md:hidden border-t ${darkMode ? 'border-gray-800 bg-[#0c1222]' : 'border-gray-200 bg-white'}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 w-full px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === item.id ? "text-cyan-400 bg-cyan-500/10" : `${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-50'}`
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Header;
