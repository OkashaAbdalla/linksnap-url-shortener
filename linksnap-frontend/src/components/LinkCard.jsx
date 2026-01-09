import { useState, useMemo, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { SHORT_URL_BASE, api } from "../services/api";

function LinkCard({ link, onCopy, onDelete, onShowQR, onEdit }) {
  const [copied, setCopied] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState(null);
  const [checkingDownload, setCheckingDownload] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const { darkMode } = useTheme();

  const shortUrl = `${SHORT_URL_BASE}/${link.slug}`;

  useEffect(() => {
    checkIfDownloadable();
  }, [link.id]);

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

  const handleDownload = async () => {
    if (!downloadInfo?.downloadable || downloading) return;
    
    setDownloading(true);
    
    try {
      // Get the download URL with auth token
      const token = localStorage.getItem("snaplink-token");
      const downloadUrl = `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/download/media/${link.id}`;
      
      // Fetch the file
      const response = await fetch(downloadUrl, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Download failed" }));
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

  const activityBars = useMemo(() => 
    Array.from({ length: 12 }, () => Math.random() * 100), 
    [link.id]
  );

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

      <ActivityChart bars={activityBars} barColor={link.barColor} clicks={link.clicks} darkMode={darkMode} />
      <ActionButtons 
        copied={copied} 
        onCopy={handleCopy} 
        onShowQR={() => onShowQR(link.slug)} 
        onDownload={handleDownload}
        downloadable={downloadInfo?.downloadable}
        checkingDownload={checkingDownload}
        downloading={downloading}
        darkMode={darkMode} 
      />
    </div>
  );
}

function DropdownMenu({ darkMode, onDelete, onEdit }) {
  return (
    <div className="relative group">
      <button className={`transition-colors ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
      <div className={`absolute right-0 top-8 w-32 rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 ${
        darkMode ? 'bg-[#252f3f] border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <button onClick={onEdit} className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 transition-colors ${
          darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
        }`}>
          <span className="material-symbols-outlined text-[16px]">edit</span>
          Edit
        </button>
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

function ActionButtons({ copied, onCopy, onShowQR, onDownload, downloadable, checkingDownload, downloading, darkMode }) {
  const btnClass = darkMode ? 'bg-[#252f3f] hover:bg-[#2d3a4d] text-gray-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-500';
  const disabledClass = darkMode ? 'bg-[#1a2332] text-gray-600 cursor-not-allowed' : 'bg-gray-50 text-gray-300 cursor-not-allowed';
  const downloadingClass = darkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-600';
  
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
        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition-colors ${
          downloading ? downloadingClass : (downloadable && !checkingDownload ? btnClass : disabledClass)
        }`}
        title={checkingDownload ? "Checking..." : downloading ? "Downloading..." : downloadable ? "Download media" : "Not downloadable"}
      >
        <span className="material-symbols-outlined text-[16px]">
          {checkingDownload || downloading ? "hourglass_empty" : "download"}
        </span>
      </button>
    </div>
  );
}

export default LinkCard;
