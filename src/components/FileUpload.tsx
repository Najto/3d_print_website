import React, { useRef, useState } from 'react';
import { Upload, X, File, Image, FolderOpen, Info, CheckCircle, AlertCircle } from 'lucide-react';
import { fileService } from '../services/fileService';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  onUploadComplete?: (filePath: string) => void;
  accept: string;
  type: 'image' | 'stl';
  currentValue?: string;
  onRemove?: () => void;
  allegiance?: string;
  faction?: string;
  unit?: string;
  autoUpload?: boolean;
}

export function FileUpload({ 
  onFileSelect, 
  onUploadComplete,
  accept, 
  type, 
  currentValue, 
  onRemove, 
  allegiance,
  faction,
  unit,
  autoUpload = false
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileSelect = async (file: File) => {
    // Validate file type
    if (type === 'image' && !file.type.startsWith('image/')) {
      alert('Bitte wähle eine Bilddatei aus.');
      return;
    }
    if (type === 'stl' && !/\.(stl|xz|gz|zip|7z)$/i.test(file.name)) {
      alert('Bitte wähle eine STL-Datei oder komprimierte Datei aus (.stl, .xz, .gz, .zip, .7z).');
      return;
    }

    // Call the old callback if provided
    if (onFileSelect) {
      onFileSelect(file);
    }

    // Auto-upload if enabled and we have the required data
    if (autoUpload && allegiance && faction && unit) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    if (!allegiance || !faction || !unit) {
      setUploadStatus('error');
      setUploadMessage('Allegiance, Faction und Unit sind erforderlich');
      return;
    }

    setUploading(true);
    setUploadStatus('idle');
    setUploadMessage('');

    try {
      const uploadData = type === 'image' 
        ? { preview: file }
        : { stlFiles: [file] };

      const result = await fileService.uploadFiles(
        allegiance,
        faction,
        unit,
        uploadData
      );

      setUploadStatus('success');
      setUploadMessage('Datei erfolgreich hochgeladen');
      
      // Call completion callback with the file path
      if (onUploadComplete) {
        const filePath = type === 'image' 
          ? result.files.preview 
          : result.files.stlFiles[0]?.path;
        if (filePath) {
          onUploadComplete(filePath);
        }
      }

    } catch (error) {
      setUploadStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Upload fehlgeschlagen';
      setUploadMessage(errorMessage);
      console.error('Upload error details:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const getIcon = () => {
    return type === 'image' ? <Image className="w-8 h-8" /> : <File className="w-8 h-8" />;
  };

  const getLabel = () => {
    return type === 'image' ? 'Bild hochladen' : 'STL-Datei hochladen';
  };

  const getDescription = () => {
    return type === 'image' 
      ? 'JPG, PNG oder GIF bis 10MB' 
      : 'STL-Dateien oder komprimierte Archive (.stl, .xz, .gz, .zip, .7z) bis 100MB';
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
        disabled={uploading}
      />
      
      {/* Upload Status */}
      {uploadStatus !== 'idle' && (
        <div className={`rounded-lg p-3 mb-4 flex items-center space-x-2 ${
          uploadStatus === 'success' 
            ? 'bg-green-900 border border-green-700' 
            : 'bg-red-900 border border-red-700'
        }`}>
          {uploadStatus === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span className={`text-sm ${
            uploadStatus === 'success' ? 'text-green-300' : 'text-red-300'
          }`}>
            {uploadMessage}
          </span>
        </div>
      )}
      
      {currentValue ? (
        <div className="bg-gray-600 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {type === 'image' && currentValue ? (
              <img 
                src={currentValue.startsWith('http') ? currentValue : `http://localhost:3001/${currentValue}`} 
                alt="Preview" 
                className="w-12 h-12 object-cover rounded"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-12 h-12 bg-green-600 rounded flex items-center justify-center">
                <File className="w-6 h-6 text-white" />
              </div>
            )}
            <div>
              <div className="text-white text-sm font-medium">
                {type === 'image' ? 'Vorschaubild' : currentValue}
              </div>
              {autoUpload && (
                <div className="text-green-400 text-xs">
                  ✓ Auf Server gespeichert
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onRemove && (
              <button
                onClick={onRemove}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
            uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          } ${
            dragOver
              ? 'border-blue-500 bg-blue-500 bg-opacity-10'
              : 'border-gray-600 hover:border-gray-500 bg-gray-700 hover:bg-gray-650'
          }`}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className={`${dragOver ? 'text-blue-400' : 'text-gray-400'}`}>
              {uploading ? (
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                getIcon()
              )}
            </div>
            <div className="text-white font-medium">
              {uploading ? 'Wird hochgeladen...' : getLabel()}
            </div>
            <div className="text-gray-400 text-sm">{getDescription()}</div>
            {!uploading && (
              <div className="text-gray-500 text-xs">
                Klicken oder Datei hierher ziehen
              </div>
            )}
            {autoUpload && allegiance && faction && unit && (
              <div className="text-green-400 text-xs">
                🚀 Automatischer Upload aktiviert
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}