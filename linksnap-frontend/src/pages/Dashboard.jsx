import { useState } from "react";
import URLForm from "../components/URLForm";
import StatsSection from "../components/StatsSection";
import LinksSection from "../components/LinksSection";
import QRModal from "../components/QRModal";
import Toast from "../components/Toast";
import { useTheme } from "../context/ThemeContext";
import { useLinks } from "../hooks/useLinks";
import { useToast } from "../hooks/useToast";
import { useStats } from "../hooks/useStats";
import { SHORT_URL_BASE } from "../services/api";

function Dashboard() {
  const [qrModalUrl, setQrModalUrl] = useState(null);
  const { darkMode } = useTheme();
  const { links, isLoading, isInitialLoading, addLink, deleteLink } = useLinks();
  const { toast, showToast, hideToast } = useToast();
  const { loadStats } = useStats();

  const handleShorten = async (url, customSlug) => {
    try {
      await addLink(url, customSlug);
      showToast("Link shortened successfully!", "success");
      loadStats();
    } catch (err) {
      showToast(err.message || "Failed to shorten link", "error");
    }
  };

  const handleCopy = (slug) => {
    navigator.clipboard.writeText(`${SHORT_URL_BASE}/${slug}`);
    showToast("Link copied to clipboard!", "success");
  };

  const handleDelete = async (id) => {
    try {
      await deleteLink(id);
      showToast("Link deleted", "info");
      loadStats();
    } catch (err) {
      showToast(err.message || "Failed to delete link", "error");
    }
  };

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 md:px-8 pb-12">
        <URLForm onShorten={handleShorten} isLoading={isLoading} />
        <StatsSection />
        <LinksSection 
          links={links}
          darkMode={darkMode}
          isLoading={isInitialLoading}
          onCopy={handleCopy}
          onDelete={handleDelete}
          onShowQR={setQrModalUrl}
        />
      </main>

      {qrModalUrl && <QRModal url={qrModalUrl} onClose={() => setQrModalUrl(null)} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </>
  );
}

export default Dashboard;
