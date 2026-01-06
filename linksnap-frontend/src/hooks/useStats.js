import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useStats() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getStats();
      setStats(formatStats(data));
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { stats, isLoading, loadStats };
}

function formatStats(data) {
  const changePrefix = data.weeklyChange >= 0 ? "+" : "";
  
  return [
    { 
      title: "TOTAL CLICKS", 
      value: formatNumber(data.totalClicks), 
      subtitle: `${changePrefix}${data.weeklyChange}% this week`, 
      subtitleColor: data.weeklyChange >= 0 ? "text-cyan-400" : "text-red-400", 
      icon: data.weeklyChange >= 0 ? "trending_up" : "trending_down" 
    },
    { 
      title: "ACTIVE LINKS", 
      value: String(data.totalLinks), 
      subtitle: "~ Stable", 
      subtitleColor: "text-gray-500", 
      icon: null 
    },
    { 
      title: "TOP SOURCE", 
      value: data.topSource, 
      subtitle: `${data.topSourcePercentage}% of traffic`, 
      subtitleColor: "text-cyan-400", 
      icon: "share" 
    },
    { 
      title: "AVG. CTR", 
      value: "4.8%", 
      subtitle: "+0.5% vs last mo", 
      subtitleColor: "text-cyan-400", 
      icon: "trending_up" 
    },
  ];
}

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return String(num);
}
