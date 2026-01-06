import { useState } from "react";
import Header from "../components/Header";
import URLForm from "../components/URLForm";
import StatsSection from "../components/StatsSection";
import LinksSection from "../components/LinksSection";
import QRModal from "../components/QRModal";
import Toast from "../components/Toast";
import { useTheme } from "../context/ThemeContext";
import { useLinks } from "../hooks/useLinks";
import { useToast } from "../hooks/useToast";
import { SHORT_URL_BASE } from "../services/api";

function Home() {
  const [qrModalUrl, setQrModalUrl] = useState(null);
  const { darkMode } = useTheme();
  const { links, isLoading, addLink, deleteLink } = useLinks();
  const { toast, showToast, hideToast } = useToast();

  const handleShorten = async (url) => {
    try {
      await addLink(url);
      showToast("Link shortened successfully!", "success");
    } catch (err) {
      showToast(err.message || "Failed to shorten link", "error");
    }
  };

  const handleCopy = (slug) => {
    const fullUrl = `${SHORT_URL_BASE}/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    showToast("Link copied to clipboard!", "success");
  };

  const handleDelete = async (id) => {
    try {
      await deleteLink(id);
      showToast("Link deleted", "info");
    } catch (err) {
      showToast(err.message || "Failed to delete link", "error");
    }
  };

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 md:px-8 pb-12">
        <URLForm onShorten={handleShorten} isLoading={isLoading} />
        <StatsSection />
        <LinksSection 
          links={links}
          darkMode={darkMode}
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

export default Home;
