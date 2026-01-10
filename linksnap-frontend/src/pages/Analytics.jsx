import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useLinks } from "../hooks/useLinks";
import { api } from "../services/api";
import StatsSection from "../components/StatsSection";
import ClickTrendsChart from "../components/ClickTrendsChart";
import TopLinksChart from "../components/TopLinksChart";

function Analytics() {
  const { darkMode } = useTheme();
  const { links, isLoading } = useLinks();
  const [clickTrendsData, setClickTrendsData] = useState([]);
  const [loadingTrends, setLoadingTrends] = useState(true);

  useEffect(() => {
    loadClickTrends();
  }, [links]);

  const loadClickTrends = async () => {
    if (links.length === 0) {
      setClickTrendsData([]);
      setLoadingTrends(false);
      return;
    }

    try {
      setLoadingTrends(true);
      
      // Aggregate clicks from all links
      const allClicksMap = new Map();
      
      // Fetch click data for each link
      const clickDataPromises = links.map(link => 
        api.getLinkStats(link.id, 30).catch(() => ({ clicks: [] }))
      );
      
      const allLinkStats = await Promise.all(clickDataPromises);
      
      // Aggregate clicks by date
      allLinkStats.forEach(stats => {
        if (stats.clickHistory && Array.isArray(stats.clickHistory)) {
          stats.clickHistory.forEach(({ date, count }) => {
            const existing = allClicksMap.get(date) || 0;
            allClicksMap.set(date, existing + count);
          });
        }
      });
      
      // Create array for last 30 days
      const trendsData = [];
      const today = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
        const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        trendsData.push({
          date: displayDate,
          clicks: allClicksMap.get(dateStr) || 0
        });
      }
      
      setClickTrendsData(trendsData);
    } catch (error) {
      console.error('Failed to load click trends:', error);
      setClickTrendsData([]);
    } finally {
      setLoadingTrends(false);
    }
  };

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
        {loadingTrends ? (
          <div className={`h-[300px] flex items-center justify-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <div className="animate-pulse">Loading chart...</div>
          </div>
        ) : clickTrendsData.length === 0 || clickTrendsData.every(d => d.clicks === 0) ? (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <span className="material-symbols-outlined text-[48px] mb-2">trending_up</span>
            <p>No click data yet. Share your links to see trends!</p>
          </div>
        ) : (
          <ClickTrendsChart data={clickTrendsData} />
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
