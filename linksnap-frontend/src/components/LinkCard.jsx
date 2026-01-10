import { useState, useMemo, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { SHORT_URL_BASE, api } from "../services/api";
import PasswordPromptModal from "./PasswordPromptModal";
import MiniActivityChart from "./MiniActivityChart";

function LinkCard({ link, onCopy, onDelete, onShowQR, onEdit }) {
  const [copied, setCopied] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState(null);
  const [checkingDownload, setCheckingDownload] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const { darkMode } = useTheme();

  const shortUrl = `${SHORT_URL_BASE}/${link.slug}`;

  useEffect(() => {
    checkIfDownloadable();
    loadActivityData();
  }, [link.id]);

  const loadActivityData = async () => {
    try {
      const stats = await api.getLinkStats(link.id, 12); // Last 12 days
      if (stats.clickHistory && Array.isArray(stats.clickHistory)) {
        // Map to simple values for mini chart
        const values = stats.clickHistory.map(c => c.count);
        // Pad with zeros if less than 12 days
        while (values.length < 12) {
          values.unshift(0);
        }
        setActivityData(values.slice(-12).map(value => ({ value })));
      } else {
        // No data yet, show zeros
        setActivityData(Array.from({ length: 12 }, () => ({ value: 0 })));
      }
    } catch (error) {
      console.error('Failed to load activity data:', error);
      // Show zeros on error
      setActivityData(Array.from({ length: 12 }, () => ({ value: 0 })));
    }
  };

  const checkIfDownloadable = async () => {
    try {
      setCheckingDownload(true);
      const info = await api.checkDownloadable(link.id);
      setDownloadInfo(info);
    } catch (error) {
      console.error("Failed to check download:", error);
      setDownloadInfo({ downloadable: false });
    } finally {
      setCheckingDownload(false);
    }
  };

  const handleCopy = () => {
    onCopy(link.slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (password = null) => {
    if (!downloadInfo?.downloadable || downloading) return;
    
    // If link has password and no password provided, show prompt
    if (downloadInfo.hasPassword && !password) {
      setPendingAction('download');
      setShowPasswordPrompt(true);
      return;
    }
    
    setDownloading(true);
    setDownloadSuccess(false);
    
    try {
      // Get the download URL with auth token
      const token = localStorage.getItem("snaplink-token");
      let downloadUrl = `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/download/media/${link.id}`;
      
      // Add password if provided
      if (password) {
        downloadUrl += `?password=${encodeURIComponent(password)}`;
      }
      
      // Fetch the file
      const response = await fetch(downloadUrl, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Download failed" }));
        
        // If password required, show prompt
        if (error.requiresPassword) {
          setPendingAction('download');
          setShowPasswordPrompt(true);
          return;
        }
        
        throw new Error(error.message || "Download failed");
      }
      
      // Check if it requires processing
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        if (data.requiresProcessing) {
          alert(`${data.platform} downloads are being processed. This feature will be available soon.`);
          return;
        }
      }
      
      // Get the blob
      const blob = await response.blob();
      
      // Get filename from header with better parsing
      const contentDisposition = response.headers.get("content-disposition");
      let filename = `${downloadInfo.platform || "media"}_${Date.now()}.mp4`;
      
      if (contentDisposition) {
        // Try multiple patterns to extract filename
        const patterns = [
          /filename\*=UTF-8''([^;]+)/,
          /filename="([^"]+)"/,
          /filename=([^;]+)/
        ];
        
        for (const pattern of patterns) {
          const match = contentDisposition.match(pattern);
          if (match && match[1]) {
            filename = decodeURIComponent(match[1].trim());
            break;
          }
        }
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = filename;
      
      // Append to body, click, and remove
      document.body.appendChild(a);
      a.click();
      
      // Show success state
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
      
    } catch (error) {
      console.error("Download failed:", error);
      alert(`Failed to download: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  const handlePasswordSubmit = async (password) => {
    if (pendingAction === 'download') {
      await handleDownload(password);
    } else if (pendingAction === 'qr') {
      // For QR, we just pass the link with password verification flag
      // The QR modal will handle showing the protected QR
      onShowQR(link, password);
    }
    setShowPasswordPrompt(false);
    setPendingAction(null);
  };

  const handleShowQR = () => {
    if (link.has_password) {
      setPendingAction('qr');
      setShowPasswordPrompt(true);
    } else {
      onShowQR(link);
    }
  };

  return (
    <div className={`rounded-xl p-4 md:p-5 border transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] ${
      darkMode ? 'bg-[#1a2332] border-gray-800' : 'bg-white border-gray-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${link.iconBg}`}>
            <span className={`material-symbols-outlined text-[20px] ${link.iconColor}`}>{link.icon}</span>
          </div>
          {link.has_password && (
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-100 text-yellow-600'}`}>
              🔒 Protected
            </span>
          )}
          {downloadInfo?.downloadable && (
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-100 text-green-600'}`}>
              📥 {downloadInfo.platform === "direct" ? "Direct" : downloadInfo.platform}
            </span>
          )}
        </div>
        <DropdownMenu darkMode={darkMode} onDelete={() => onDelete(link.id)} onEdit={() => onEdit(link)} />
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

      <div className="h-8 mb-3">
        <MiniActivityChart 
          data={activityData} 
          color={getColorFromBarColor(link.barColor)} 
          clicks={link.clicks} 
          darkMode={darkMode} 
        />
      </div>
      <ActionButtons 
        copied={copied} 
        onCopy={handleCopy} 
        onShowQR={handleShowQR} 
        onDownload={handleDownload}
        downloadable={downloadInfo?.downloadable}
        checkingDownload={checkingDownload}
        downloading={downloading}
        downloadSuccess={downloadSuccess}
        darkMode={darkMode} 
      />
      
      {showPasswordPrompt && (
        <PasswordPromptModal
          title={pendingAction === 'download' ? "Download Protected Content" : "View QR Code"}
          message={`This ${pendingAction === 'download' ? 'download' : 'QR code'} is password protected. Please enter the password to continue.`}
          onSubmit={handlePasswordSubmit}
          onClose={() => {
            setShowPasswordPrompt(false);
            setPendingAction(null);
          }}
        />
      )}
    </div>
  );
}

function DropdownMenu({ darkMode, onDelete, onEdit }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`transition-colors ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
      >
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className={`absolute right-0 top-8 w-32 rounded-lg shadow-lg border z-20 ${
            darkMode ? 'bg-[#252f3f] border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <button 
              onClick={() => {
                onEdit();
                setIsOpen(false);
              }} 
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
                darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              Edit
            </button>
            <button 
              onClick={() => {
                onDelete();
                setIsOpen(false);
              }} 
              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 rounded-lg transition-colors ${
                darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Helper function to extract color from Tailwind class
function getColorFromBarColor(barColorClass) {
  const colorMap = {
    'bg-cyan-500': '#06B6D4',
    'bg-blue-500': '#3B82F6',
    'bg-purple-500': '#8B5CF6',
    'bg-pink-500': '#EC4899',
    'bg-orange-500': '#F97316',
    'bg-green-500': '#10B981',
    'bg-yellow-500': '#EAB308',
    'bg-red-500': '#EF4444'
  };
  
  return colorMap[barColorClass] || '#06B6D4';
}

function ActionButtons({ copied, onCopy, onShowQR, onDownload, downloadable, checkingDownload, downloading, downloadSuccess, darkMode }) {
  const btnClass = darkMode ? 'bg-[#252f3f] hover:bg-[#2d3a4d] text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500';
  const disabledClass = darkMode ? 'bg-[#1a2332] text-gray-600 cursor-not-allowed' : 'bg-gray-50 text-gray-300 cursor-not-allowed';
  const downloadingClass = darkMode ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-600 border border-cyan-300';
  const downloadableClass = darkMode ? 'bg-[#252f3f] hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-blue-500/10 text-cyan-400 hover:border-cyan-500/30 border border-transparent' : 'bg-gray-100 hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 text-cyan-600 hover:border-cyan-200 border border-transparent';
  const successClass = 'bg-green-500 text-white border border-green-400';
  
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
      <button 
        onClick={onDownload} 
        disabled={!downloadable || checkingDownload || downloading}
        className={`relative flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-all duration-300 overflow-hidden ${
          downloadSuccess ? successClass : downloading ? downloadingClass : (downloadable && !checkingDownload ? downloadableClass : disabledClass)
        }`}
        title={downloadSuccess ? "Downloaded!" : checkingDownload ? "Checking..." : downloading ? "Downloading..." : downloadable ? "Download media" : "Not downloadable"}
      >
        {/* Animated background for downloading state */}
        {downloading && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-shimmer" 
                 style={{ backgroundSize: '200% 100%' }} />
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10" />
          </>
        )}
        
        {/* Circular spinner ring for downloading */}
        {downloading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
          </div>
        )}
        
        {/* Icon with animations */}
        <span className={`material-symbols-outlined relative z-10 transition-all duration-300 ${
          downloading ? 'text-[20px] animate-spin-slow scale-110' : 'text-[16px]'
        } ${
          checkingDownload ? 'animate-pulse' : downloadSuccess ? 'animate-bounce' : ''
        }`}>
          {downloadSuccess ? "check_circle" : downloading ? "downloading" : checkingDownload ? "hourglass_empty" : "download"}
        </span>
        
        {/* Optional text for larger screens */}
        {downloading && (
          <span className="hidden sm:inline text-xs font-medium relative z-10 animate-pulse">
            Downloading...
          </span>
        )}
        {downloadSuccess && (
          <span className="hidden sm:inline text-xs font-medium relative z-10">
            Done!
          </span>
        )}
      </button>
    </div>
  );
}

export default LinkCard;
