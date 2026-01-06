import { useState, useEffect } from "react";
import { api } from "../services/api";

export function useLinks() {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    try {
      const data = await api.getLinks();
      setLinks(data.map(formatLink));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const addLink = async (url, customSlug) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.createLink(url, customSlug);
      const newLink = formatLink(data);
      setLinks(prev => [newLink, ...prev]);
      return newLink;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLink = async (id) => {
    setError(null);
    try {
      await api.deleteLink(id);
      setLinks(prev => prev.filter(link => link.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateLink = async (id, updates) => {
    try {
      const data = await api.updateLink(id, updates);
      setLinks(prev => prev.map(link => 
        link.id === id ? formatLink(data) : link
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return { links, isLoading, isInitialLoading, error, addLink, deleteLink, updateLink, loadLinks };
}

function formatLink(data) {
  return {
    id: data.id,
    slug: data.slug,
    long: data.original_url || data.originalUrl,
    clicks: String(data.clicks || 0),
    createdAt: data.created_at,
    expiresAt: data.expires_at,
    icon: "link",
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
    slugColor: "text-cyan-400",
    barColor: "bg-cyan-400",
  };
}
