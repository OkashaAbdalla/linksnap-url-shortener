import StatsCard from "./StatsCard";
import { useStats } from "../hooks/useStats";
import { statsData } from "../data/sampleData";
import { useTheme } from "../context/ThemeContext";

function StatsSection() {
  const { stats, isLoading } = useStats();
  const { darkMode } = useTheme();
  
  // Use sample data as fallback
  const displayStats = stats || statsData;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className={`rounded-xl p-4 md:p-5 border animate-pulse ${
              darkMode ? 'bg-[#1a2332] border-gray-800' : 'bg-white border-gray-200'
            }`}
          >
            <div className={`h-3 w-20 rounded mb-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className={`h-6 w-16 rounded mb-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            <div className={`h-3 w-24 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
      {displayStats.map((stat, i) => (
        <StatsCard key={i} {...stat} />
      ))}
    </div>
  );
}

export default StatsSection;
