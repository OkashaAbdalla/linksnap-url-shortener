import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useLinks } from "../hooks/useLinks";
import { useToast } from "../hooks/useToast";
import LinkCard from "../components/LinkCard";
import SearchBar from "../components/SearchBar";
import QRModal from "../components/QRModal";
import Toast from "../components/Toast";
import EmptyState from "../components/EmptyState";
import LinksSkeleton from "../components/LinksSkeleton";
import { SHORT_URL_BASE } from "../services/api";

function MyLinks() {
  const { darkMode } = useTheme();
  const { links, isInitialLoading, deleteLink } = useLinks();
  const { toast, showToast, hideToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [qrModalUrl, setQrModalUrl] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const filteredLinks = links.filter(link => 
    link.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    link.long.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (slug) => {
    navigator.clipboard.writeText(`${SHORT_URL_BASE}/${slug}`);
    showToast("Link copied!", "success");
  };

  const handleDelete = async (id) => {
    try {
      await deleteLink(id);
      showToast("Link deleted", "info");
    } catch {
      showToast("Failed to delete", "error");
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          My Links ({links.length})
        </h2>
        <div className="flex items-center gap-3">
          <SearchBar value={searchQuery} onChange={setSearchQuery} darkMode={darkMode} />
        </div>
      </div>

      {isInitialLoading ? (
        <LinksSkeleton darkMode={darkMode} />
      ) : links.length === 0 ? (
        <EmptyState />
      ) : filteredLinks.length === 0 ? (
        <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No links match your search
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLinks.map((link) => (
            <LinkCard 
              key={link.id} 
              link={link} 
              onCopy={handleCopy}
              onDelete={handleDelete}
              onShowQR={setQrModalUrl}
            />
          ))}
        </div>
      )}

      {qrModalUrl && <QRModal url={qrModalUrl} onClose={() => setQrModalUrl(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </main>
  );
}

export default MyLinks;
