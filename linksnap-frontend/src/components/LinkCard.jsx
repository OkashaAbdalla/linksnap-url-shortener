import { useState, useMemo } from "react";
import { useTheme } from "../context/ThemeContext";
import { SHORT_URL_BASE } from "../services/api";

function LinkCard({ link, onCopy, onDelete, onShowQR }) {
  const [copied, setCopied] = useState(false);
  const { darkMode } = useTheme();

  const shortUrl = `${SHORT_URL_BASE}/${link.slug}`;

  const handleCopy = () => {
    onCopy(link.slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activityBars = useMemo(() => 
    Array.from({ length: 12 }, () => Math.random() * 100), 
    [link.id]
  );

  return (
    <div className={`rounded-xl p-4 md:p-5 border transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] ${
      darkMode ? 'bg-[#1a2332] border-gray-800' : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${link.iconBg}`}>
          <span className={`material-symbols-outlined text-[20px] ${link.iconColor}`}>{link.icon}</span>
        </div>
        <DropdownMenu darkMode={darkMode} onDelete={() => onDelete(link.id)} />
      </div>

      <div className="mb-4">
        <a href={shortUrl} target="_blank" rel="noopener noreferrer" 
           className={`font-medium hover:underline ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
          {shortUrl.replace('http://', '').replace('https://', '')}
        </a>
        <p className={`text-sm truncate mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {link.long}
        </p>
      </div>

      <ActivityChart bars={activityBars} barColor={link.barColor} clicks={link.clicks} darkMode={darkMode} />
      <ActionButtons copied={copied} onCopy={handleCopy} onShowQR={() => onShowQR(link.slug)} darkMode={darkMode} />
    </div>
  );
}

function DropdownMenu({ darkMode, onDelete }) {
  return (
    <div className="relative group">
      <button className={`transition-colors ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
      <div className={`absolute right-0 top-8 w-32 rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 ${
        darkMode ? 'bg-[#252f3f] border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <button onClick={onDelete} className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 rounded-lg transition-colors ${
          darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
        }`}>
          <span className="material-symbols-outlined text-[16px]">delete</span>
          Delete
        </button>
      </div>
    </div>
  );
}

function ActivityChart({ bars, barColor, clicks, darkMode }) {
  return (
    <div className="flex items-end gap-1 h-8 mb-3">
      {bars.map((height, i) => (
        <div key={i} className={`flex-1 rounded-sm ${barColor}`} style={{ height: `${Math.max(15, height)}%` }} />
      ))}
      <span className={`text-xs ml-2 whitespace-nowrap ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{clicks} clicks</span>
    </div>
  );
}

function ActionButtons({ copied, onCopy, onShowQR, darkMode }) {
  const btnClass = darkMode ? 'bg-[#252f3f] hover:bg-[#2d3a4d] text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500';
  return (
    <div className="flex items-center gap-2 pt-3">
      <button onClick={onCopy} className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-white text-sm font-medium transition-all ${
        copied ? 'bg-green-500' : 'bg-cyan-500 hover:bg-cyan-400'
      }`}>
        <span className="material-symbols-outlined text-[16px]">{copied ? "check" : "content_copy"}</span>
        <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
      </button>
      <button onClick={onShowQR} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-colors ${btnClass}`}>
        <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
      </button>
      <button className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-colors ${btnClass}`}>
        <span className="material-symbols-outlined text-[16px]">download</span>
      </button>
    </div>
  );
}

export default LinkCard;
