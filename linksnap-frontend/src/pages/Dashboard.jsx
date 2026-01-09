import { useState } from "react";
import URLForm from "../components/URLForm";
import StatsSection from "../components/StatsSection";
import LinksSection from "../components/LinksSection";
import QRModal from "../components/QRModal";
import EditLinkModal from "../components/EditLinkModal";
import Toast from "../components/Toast";
import { useTheme } from "../context/ThemeContext";
import { useLinks } from "../hooks/useLinks";
import { useToast } from "../hooks/useToast";
import { useStats } from "../hooks/useStats";
import { SHORT_URL_BASE, api } from "../services/api";

function Dashboard() {
  const [qrModalData, setQrModalData] = useState(null);
  const [editingLink, setEditingLink] = useState(null);
  const { darkMode } = useTheme();
  const { links, isLoading, isInitialLoading, addLink, deleteLink, refreshLinks } = useLinks();
  const { toast, showToast, hideToast } = useToast();
  const { loadStats } = useStats();

  const handleShorten = async (url, customSlug, password, qrStyle) => {
    try {
      await addLink(url, customSlug, password, qrStyle);
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

  const handleShowQR = (link, password = null) => {
    // Even owner must enter password if link is protected
    // This respects the user's security choice
    setQrModalData({ slug: link.slug, qrStyle: link.qr_style, hasPassword: link.has_password });
  };

  const handleEdit = (link) => {
    setEditingLink(link);
  };

  const handleSaveEdit = async (id, updates) => {
    try {
      await api.updateLink(id, updates);
      await refreshLinks();
      showToast("Link updated successfully!", "success");
      loadStats();
    } catch (err) {
      showToast(err.message || "Failed to update link", "error");
      throw err;
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
          onShowQR={handleShowQR}
          onEdit={handleEdit}
        />
      </main>

      {qrModalData && (
        <QRModal 
          url={qrModalData.slug} 
          qrStyle={qrModalData.qrStyle}
          hasPassword={qrModalData.hasPassword}
          onClose={() => setQrModalData(null)} 
        />
      )}
      {editingLink && (
        <EditLinkModal
          link={editingLink}
          onClose={() => setEditingLink(null)}
          onSave={handleSaveEdit}
        />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </>
  );
}

export default Dashboard;
