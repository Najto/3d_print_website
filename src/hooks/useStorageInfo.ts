import { useState, useEffect } from 'react';

export interface StorageInfo {
  disk: {
    total: number;
    used: number;
    available: number;
    usedPercentage: number;
  };
  uploads: {
    totalSize: number;
    filesSize: number;
    dataSize: number;
    stlFiles: number;
    imageFiles: number;
    totalFiles: number;
  };
}

export function useStorageInfo() {
  const [storageInfo, setStorageInfo] = useState<StorageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStorageInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/storage');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setStorageInfo(data.storage);
      
    } catch (err) {
      console.error('Error fetching storage info:', err);
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStorageInfo();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchStorageInfo, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return {
    storageInfo,
    loading,
    error,
    formatFileSize,
    refresh: fetchStorageInfo
  };
}