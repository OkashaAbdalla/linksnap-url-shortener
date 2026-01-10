import { useTheme } from "../context/ThemeContext";
import { useLinks } from "../hooks/useLinks";
import StatsSection from "../components/StatsSection";
import ClickTrendsChart from "../components/ClickTrendsChart";
import TopLinksChart from "../components/TopLinksChart";

function Analytics() {
  const { darkMode } = useTheme();
  const { links, isLoading } = useLinks();

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Analytics Overview
      </h2>
      
      <StatsSection />

      {/* Click trends chart */}
      <div className={`rounded-xl p-6 border mb-6 ${
        darkMode ? 'bg-[#1a2332] border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Click Trends
          </h3>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Last 30 Days
          </span>
        </div>
        {isLoading ? (
          <div className={`h-[300px] flex items-center justify-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <div className="animate-pulse">Loading chart...</div>
          </div>
        ) : (
          <ClickTrendsChart />
        )}
      </div>

      {/* Top performing links */}
      <div className={`rounded-xl p-6 border ${
        darkMode ? 'bg-[#1a2332] border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Top Performing Links
          </h3>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Top 5
          </span>
        </div>
        {isLoading ? (
          <div className={`h-[300px] flex items-center justify-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <div className="animate-pulse">Loading chart...</div>
          </div>
        ) : links.length === 0 ? (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <span className="material-symbols-outlined text-[48px] mb-2">leaderboard</span>
            <p>Create some links to see performance data</p>
          </div>
        ) : (
          <TopLinksChart links={links} />
        )}
      </div>
    </main>
  );
}

export default Analytics;
