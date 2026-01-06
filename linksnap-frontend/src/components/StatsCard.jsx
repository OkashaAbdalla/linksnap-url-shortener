import { useTheme } from "../context/ThemeContext";

function StatsCard({ title, value, subtitle, subtitleColor = "text-cyan-400", icon }) {
  const { darkMode } = useTheme();

  return (
    <div className={`rounded-xl p-4 md:p-5 border transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] ${
      darkMode 
        ? 'bg-[#1a2332] border-gray-800' 
        : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <p className={`text-xs uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{title}</p>
      <p className={`text-xl md:text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      <p className={`text-xs flex items-center gap-1 ${subtitleColor}`}>
        {icon && <span className="material-symbols-outlined text-[14px]">{icon}</span>}
        {subtitle}
      </p>
    </div>
  );
}

export default StatsCard;
