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
    
    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      // Check if response is actually JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);
        
        if (textResponse.includes('<html>')) {
          throw new Error('Server-Fehler: Backend nicht erreichbar. Prüfen Sie ob der Server läuft.');
        } else {
          throw new Error(`Server-Antwort: ${textResponse.substring(0, 200)}...`);
        }
      }
      
      if (!response.ok) {
        try {
          const error = await response.json();
          throw new Error(error.error || `Upload fehlgeschlagen (${response.status})`);
        } catch (jsonError) {
          throw new Error(`Upload fehlgeschlagen: HTTP ${response.status}`);
        }
      }
      
      return response.json();
      
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Netzwerk-Fehler: Backend nicht erreichbar. Prüfen Sie die Verbindung.');
      }
      throw error;
    }
  }
  
  async getFiles(
    allegiance: string,
    faction: string,
    unit: string
  ): Promise<FilesResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/files/${encodeURIComponent(allegiance)}/${encodeURIComponent(faction)}/${encodeURIComponent(unit)}`
      );
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        if (textResponse.includes('<html>')) {
          throw new Error('Backend nicht erreichbar');
        }
        throw new Error('Unerwartete Server-Antwort');
      }
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Fehler beim Abrufen der Dateien');
      }
      
      return response.json();
      
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Backend nicht erreichbar');
      }
      throw error;
    }
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
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Backend antwortet nicht korrekt');
      }
      
      return response.json();
    } catch (error) {
      throw new Error('Backend nicht erreichbar - prüfen Sie ob der Server läuft');
    }
  }
  
  getDownloadUrl(filePath: string): string {
    return `/${filePath}`;
  }
}

export const fileService = new FileService();