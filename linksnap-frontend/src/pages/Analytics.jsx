import { useTheme } from "../context/ThemeContext";
import StatsSection from "../components/StatsSection";

function Analytics() {
  const { darkMode } = useTheme();

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Analytics Overview
      </h2>
      
      <StatsSection />

      {/* Click trends chart placeholder */}
      <div className={`rounded-xl p-6 border mb-6 ${
        darkMode ? 'bg-[#1a2332] border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Click Trends (Last 30 Days)
        </h3>
        <div className={`h-48 flex items-center justify-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <div className="text-center">
            <span className="material-symbols-outlined text-[48px] mb-2">show_chart</span>
            <p>Chart visualization coming soon</p>
          </div>
        </div>
      </div>

      {/* Top performing links */}
      <div className={`rounded-xl p-6 border ${
        darkMode ? 'bg-[#1a2332] border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Top Performing Links
        </h3>
        <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <span className="material-symbols-outlined text-[48px] mb-2">leaderboard</span>
          <p>Performance data will appear here</p>
        </div>
      </div>
    </main>
  );
}

export default Analytics;
