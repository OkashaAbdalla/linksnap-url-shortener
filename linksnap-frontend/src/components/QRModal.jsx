import { useTheme } from "../context/ThemeContext";
import { SHORT_URL_BASE } from "../services/api";

function QRModal({ url, onClose }) {
  const { darkMode } = useTheme();
  
  const fullUrl = `${SHORT_URL_BASE}/${url}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}`;

  console.log('QR Code URL:', fullUrl); // Debug log

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`rounded-2xl p-6 max-w-sm w-full mx-4 ${darkMode ? 'bg-[#1a2332]' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>QR Code</h3>
          <button 
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl mb-4">
            <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
          </div>
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {fullUrl.replace('http://', '').replace('https://', '')}
          </p>
          <a 
            href={qrCodeUrl} 
            download={`qr-${url}.png`}
            className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download QR Code
          </a>
        </div>
      </div>
    </div>
  );
}

export default QRModal;
