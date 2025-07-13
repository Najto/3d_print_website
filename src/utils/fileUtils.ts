// File utility functions for structured folder storage

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!validTypes.includes(file.type)) {
    alert('Ungültiger Dateityp. Bitte wähle JPG, PNG, GIF oder WebP.');
    return false;
  }
  
  if (file.size > maxSize) {
    alert('Datei zu groß. Maximale Größe: 10MB.');
    return false;
  }
  
  return true;
};

export const validateSTLFile = (file: File): boolean => {
  const maxSize = 1024 * 1024 * 1024; // 1GB for archives
  
  if (!file.name.toLowerCase().endsWith('.stl')) {
    alert('Ungültiger Dateityp. Bitte wähle eine STL-Datei oder ein komprimiertes Archiv.');
    return false;
  }
  
  if (file.size > maxSize) {
    alert('Datei zu groß. Maximale Größe: 1GB.');
    return false;
  }
  
  return true;
};

// Generate folder path based on allegiance, faction, and unit
export const generateFolderPath = (allegiance: string, faction: string, unitName: string): string => {
  const sanitize = (str: string) => str.toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  return `files/${sanitize(allegiance)}/${sanitize(faction)}/${sanitize(unitName)}`;
};

// Generate file path for a specific file
export const generateFilePath = (folderPath: string, fileName: string): string => {
  return `${folderPath}/${fileName}`;
};

// Create download link for files in the public folder structure
export const createDownloadLink = (filePath: string, fileName: string): void => {
  const link = document.createElement('a');
  link.href = `/${filePath}`;
  link.download = fileName;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Check if file exists in the expected folder structure
export const checkFileExists = async (filePath: string): Promise<boolean> => {
  try {
    const response = await fetch(`/${filePath}`, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

// Get preview image path
export const getPreviewImagePath = (folderPath: string): string => {
  return `${folderPath}/preview.jpg`;
};

// Get all STL files for a unit (this would need to be populated from a manifest or directory listing)
export const getSTLFiles = (folderPath: string, stlFileNames: string[]): Array<{
  name: string;
  path: string;
  size: string;
  variant?: string;
}> => {
  return stlFileNames.map(fileName => ({
    name: fileName,
    path: generateFilePath(folderPath, fileName),
    size: '0 MB', // Size would need to be determined server-side or from manifest
    variant: fileName.includes('_') ? fileName.split('_').slice(1).join('_').replace('.stl', '') : undefined
  }));
};

// Create folder structure instructions for user
export const getFolderStructureInstructions = (allegiance: string, faction: string, unitName: string): string => {
  const folderPath = generateFolderPath(allegiance, faction, unitName);
  return `
Erstelle folgende Ordnerstruktur in deinem Website-Ordner:

📁 public/
  📁 ${folderPath}/
    🖼️ preview.jpg (Vorschaubild der Einheit)
    📄 einheit_01.stl
    📄 einheit_02.stl
    📄 waffen.stl
    📄 ... (weitere STL-Dateien)

Beispiel-Pfad: public/${folderPath}/preview.jpg
  `;
};

// Helper to extract allegiance from army data
export const getAllegianceFromArmy = (armyId: string): string => {
  // This mapping should match your army structure
  const allegianceMap: { [key: string]: string } = {
    'stormcast-eternals': 'order',
    'cities-of-sigmar': 'order',
    'sylvaneth': 'order',
    'lumineth-realm-lords': 'order',
    'idoneth-deepkin': 'order',
    'daughters-of-khaine': 'order',
    'fyreslayers': 'order',
    'kharadron-overlords': 'order',
    'seraphon': 'order',
    
    'slaves-to-darkness': 'chaos',
    'khorne-bloodbound': 'chaos',
    'disciples-of-tzeentch': 'chaos',
    'maggotkin-of-nurgle': 'chaos',
    'hedonites-of-slaanesh': 'chaos',
    'skaven': 'chaos',
    'beasts-of-chaos': 'chaos',
    
    'nighthaunt': 'death',
    'ossiarch-bonereapers': 'death',
    'flesh-eater-courts': 'death',
    'soulblight-gravelords': 'death',
    
    'orruk-warclans': 'destruction',
    'gloomspite-gitz': 'destruction',
    'sons-of-behemat': 'destruction',
    'ogor-mawtribes': 'destruction'
  };
  
  return allegianceMap[armyId] || 'unknown';
};

// Clean up old localStorage files (no longer needed with folder structure)
export const cleanupOldFiles = (): void => {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('file_')) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    if (keysToRemove.length > 0) {
      console.log(`Cleaned up ${keysToRemove.length} old file entries from localStorage`);
    }
  } catch (error) {
    console.error('Error cleaning up old files:', error);
  }
};