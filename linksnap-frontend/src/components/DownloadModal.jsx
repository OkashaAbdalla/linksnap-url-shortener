import { useTheme } from "../context/ThemeContext";

function DownloadModal({ isOpen, onClose, downloadInfo, originalUrl }) {
  const { darkMode } = useTheme();

  if (!isOpen) return null;

  const platformLogos = {
    tiktok: "🎵",
    instagram: "📷",
    facebook: "👥",
    twitter: "🐦",
    youtube: "▶️",
    pinterest: "📌",
    reddit: "🤖",
    imgur: "🖼️"
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl p-6 max-w-md w-full shadow-2xl ${
        darkMode ? 'bg-[#1a2332] border border-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Download Media
          </h3>
          <button onClick={onClose} className={`transition-colors ${
            darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
          }`}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mb-6">
          <div className={`flex items-center gap-3 p-4 rounded-lg mb-4 ${
            darkMode ? 'bg-[#252f3f]' : 'bg-gray-50'
          }`}>
            <span className="text-3xl">{platformLogos[downloadInfo?.platform] || "📥"}</span>
            <div>
              <p className={`font-medium capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {downloadInfo?.platform || "Unknown"} Media
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {downloadInfo?.type || "Video/Image"}
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-lg mb-4 ${
            darkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'
          }`}>
            <p className={`text-sm mb-2 font-medium ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
              📋 Instructions:
            </p>
            <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}>
              {downloadInfo?.instructions}
            </p>
          </div>

          <div className={`p-3 rounded-lg ${darkMode ? 'bg-[#252f3f]' : 'bg-gray-50'}`}>
            <p className={`text-xs mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Original URL:
            </p>
            <p className={`text-sm break-all ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {originalUrl}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(originalUrl);
            }}
            className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-colors ${
              darkMode 
                ? 'bg-[#252f3f] hover:bg-[#2d3a4d] text-gray-300' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            Copy URL
          </button>
          <button
            onClick={() => {
              window.open(originalUrl, "_blank");
              onClose();
            }}
            className="flex-1 py-2.5 px-4 rounded-lg font-medium bg-cyan-500 hover:bg-cyan-400 text-white transition-colors"
          >
            Open Link
          </button>
        </div>
      </div>
    </div>
  );
}

export default DownloadModal;
