import { useTheme } from "../context/ThemeContext";
import { SHORT_URL_BASE } from "../services/api";

function QRModal({ url, qrStyle, hasPassword, onClose }) {
  const { darkMode } = useTheme();
  
  const fullUrl = `${SHORT_URL_BASE}/${url}`;
  
  // Use custom QR style if provided, otherwise use defaults
  const fgColor = qrStyle?.fgColor?.replace('#', '') || '000000';
  const bgColor = qrStyle?.bgColor?.replace('#', '') || 'FFFFFF';
  
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(fullUrl)}&color=${fgColor}&bgcolor=${bgColor}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`rounded-2xl p-6 max-w-sm w-full mx-4 ${darkMode ? 'bg-[#1a2332]' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>QR Code</h3>
            {hasPassword && (
              <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${darkMode ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
                <span className="material-symbols-outlined text-[14px]">lock</span>
                Protected
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {hasPassword && (
          <div className={`mb-4 p-3 rounded-lg flex items-start gap-2 text-sm ${darkMode ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-700'}`}>
            <span className="material-symbols-outlined text-[18px]">info</span>
            <p>This QR code leads to a password-protected link. Users will need to enter the password after scanning.</p>
          </div>
        )}
        
        <div className="flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl mb-4">
            <img src={qrCodeUrl} alt="QR Code" className="w-64 h-64" />
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
