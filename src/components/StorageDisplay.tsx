import React from 'react';
import { HardDrive, Database, FileText, Image, Archive, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useStorageInfo } from '../hooks/useStorageInfo';

export function StorageDisplay() {
  const { storageInfo, loading, error, formatFileSize } = useStorageInfo();

  if (loading) {
    return (
      <div className="flex items-center space-x-2 text-gray-400 text-sm">
        <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Speicher wird geladen...</span>
      </div>
    );
  }

  if (error || !storageInfo) {
    return (
      <div className="flex items-center space-x-2 text-gray-500 text-sm">
        <AlertTriangle className="w-4 h-4" />
        <span>Speicher-Info nicht verfügbar</span>
      </div>
    );
  }

  const { disk, uploads } = storageInfo;
  
  // Calculate upload percentage of total disk
  const uploadPercentage = disk.total > 0 ? (uploads.totalSize / disk.total) * 100 : 0;
  
  // Determine disk usage status
  const getDiskStatus = () => {
    if (disk.usedPercentage >= 90) return { color: 'text-red-400', icon: AlertTriangle, status: 'Kritisch' };
    if (disk.usedPercentage >= 75) return { color: 'text-yellow-400', icon: AlertTriangle, status: 'Warnung' };
    return { color: 'text-green-400', icon: CheckCircle, status: 'OK' };
  };

  const diskStatus = getDiskStatus();
  const StatusIcon = diskStatus.icon;

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <HardDrive className="w-5 h-5 text-blue-400" />
          <span>Speicher-Status</span>
        </h3>
        <div className={`flex items-center space-x-1 ${diskStatus.color}`}>
          <StatusIcon className="w-4 h-4" />
          <span className="text-sm font-medium">{diskStatus.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Disk Usage */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Festplatte</span>
            <span className="text-white font-medium">{disk.usedPercentage}% belegt</span>
          </div>
          
          {/* Disk Usage Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                disk.usedPercentage >= 90 ? 'bg-red-500' :
                disk.usedPercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(disk.usedPercentage, 100)}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatFileSize(disk.used)} belegt</span>
            <span>{formatFileSize(disk.available)} frei</span>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            Gesamt: {formatFileSize(disk.total)}
          </div>
        </div>

        {/* Upload Statistics */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300 text-sm">Hochgeladene Dateien</span>
            <span className="text-white font-medium">{formatFileSize(uploads.totalSize)}</span>
          </div>
          
          {/* Upload Usage Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div 
              className="h-3 rounded-full bg-blue-500 transition-all duration-300"
              style={{ width: `${Math.min(uploadPercentage, 100)}%` }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1 text-gray-400">
              <Archive className="w-3 h-3 text-green-400" />
              <span>{uploads.stlFiles} STL/Archive</span>
            </div>
            <div className="flex items-center space-x-1 text-gray-400">
              <Image className="w-3 h-3 text-blue-400" />
              <span>{uploads.imageFiles} Bilder</span>
            </div>
          </div>
          
          <div className="text-center text-xs text-gray-500">
            {uploads.totalFiles} Dateien • {uploadPercentage.toFixed(1)}% der Festplatte
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-gray-400">
              <FileText className="w-3 h-3" />
              <span>3D-Dateien</span>
            </div>
            <span className="text-white">{formatFileSize(uploads.filesSize)}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-gray-400">
              <Database className="w-3 h-3" />
              <span>Datenbank</span>
            </div>
            <span className="text-white">{formatFileSize(uploads.dataSize)}</span>
          </div>
        </div>
      </div>

      {/* Warning for low space */}
      {disk.usedPercentage >= 85 && (
        <div className="mt-4 p-3 bg-yellow-900 border border-yellow-700 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-yellow-300 text-xs">
              <p className="font-semibold mb-1">Speicherplatz wird knapp!</p>
              <p>Nur noch {formatFileSize(disk.available)} verfügbar. Erwägen Sie das Löschen alter Dateien oder die Erweiterung des Speichers.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}