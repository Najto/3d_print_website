// File service for communicating with the backend
const API_BASE_URL = '/api';

export interface UploadResponse {
  success: boolean;
  message: string;
  files: {
    preview: string | null;
    stlFiles: Array<{
      name: string;
      size: string;
      path: string;
    }>;
  };
  folderPath: string;
}

export interface FileInfo {
  name: string;
  size: string;
  path: string;
  isPreview: boolean;
}

export interface FilesResponse {
  exists: boolean;
  files: FileInfo[];
}

class FileService {
  async uploadFiles(
    allegiance: string,
    faction: string,
    unit: string,
    files: {
      preview?: File;
      stlFiles?: File[];
    }
  ): Promise<UploadResponse> {
    const formData = new FormData();
    
    // Add metadata
    formData.append('allegiance', allegiance);
    formData.append('faction', faction);
    formData.append('unit', unit);
    
    // Add preview image
    if (files.preview) {
      formData.append('preview', files.preview);
    }
    
    // Add STL files
    if (files.stlFiles) {
      files.stlFiles.forEach(file => {
        formData.append('stlFiles', file);
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload fehlgeschlagen');
    }
    
    return response.json();
  }
  
  async getFiles(
    allegiance: string,
    faction: string,
    unit: string
  ): Promise<FilesResponse> {
    const response = await fetch(
      `${API_BASE_URL}/files/${encodeURIComponent(allegiance)}/${encodeURIComponent(faction)}/${encodeURIComponent(unit)}`
    );
    
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Dateien');
    }
    
    return response.json();
  }
  
  async deleteFile(
    allegiance: string,
    faction: string,
    unit: string,
    filename: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await fetch(
      `${API_BASE_URL}/files/${encodeURIComponent(allegiance)}/${encodeURIComponent(faction)}/${encodeURIComponent(unit)}/${encodeURIComponent(filename)}`,
      {
        method: 'DELETE',
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Löschen fehlgeschlagen');
    }
    
    return response.json();
  }
  
  async checkHealth(): Promise<{ status: string; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.json();
    } catch (error) {
      throw new Error('Server nicht erreichbar');
    }
  }
  
  getDownloadUrl(filePath: string): string {
    return `/${filePath}`;
  }
}

export const fileService = new FileService();