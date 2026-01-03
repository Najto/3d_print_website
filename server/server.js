require('dotenv').config();
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { initDB, getData, setData, clearData } = require('./dataStore');
const { ftpService } = require('./services/ftpService');
initDB();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure data directory exists (for local database)
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}


// Data persistence endpoints
app.get('/api/data', async (req, res) => {
  try {
    const data = await getData();
    res.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});


app.post('/api/data', async (req, res) => {
  try {
    await setData(req.body);
    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});


app.delete('/api/data', async (req, res) => {
  try {
    await clearData();
    res.json({ success: true, message: 'Data cleared successfully' });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({ error: 'Failed to clear data' });
  }
});

// Configure multer for file uploads (using memory storage for FTP)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024 // 1GB limit for ZIP archives
  },
  fileFilter: (req, file, cb) => {
    console.log(`🔍 File filter check:`, {
      fieldname: file.fieldname,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Allow images and STL files
    const allowedTypes = /\.(jpeg|jpg|png|gif|webp|stl|xz|gz|zip|7z|rar)$/i;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    // Extended MIME type support for ZIP files
    const allowedMimeTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/octet-stream',
      'application/x-xz',
      'application/gzip',
      'application/zip',
      'application/x-zip-compressed',
      'application/x-7z-compressed',
      'application/x-rar-compressed',
      'application/vnd.rar',
      'model/stl',
      'application/sla'
    ];
    
    const mimetype = allowedMimeTypes.includes(file.mimetype) || 
                     file.mimetype === 'application/octet-stream' ||
                     file.mimetype.includes('zip') ||
                     file.mimetype.includes('compressed');
    
    console.log(`📋 Validation result:`, {
      extname: extname,
      mimetype: mimetype,
      accepted: mimetype && extname
    });
    
    if (mimetype && extname) {
      console.log(`✅ File accepted: ${file.originalname}`);
      return cb(null, true);
    } else {
      console.log(`❌ File rejected: ${file.originalname} (${file.mimetype})`);
      cb(new Error(`Ungültiger Dateityp: ${file.mimetype}. Nur Bilder (JPG, PNG, GIF, WebP), STL-Dateien und komprimierte Archive (.stl, .xz, .gz, .zip, .7z, .rar) sind erlaubt!`));
    }
  }
});

// Upload endpoint for multiple files (FTP version)
app.post('/api/upload', upload.fields([
  { name: 'preview', maxCount: 1 },
  { name: 'stlFiles', maxCount: 20 }
]), async (req, res, next) => {
  console.log(`\n🚀 === UPLOAD REQUEST START (FTP) ===`);
  console.log(`📅 Timestamp: ${new Date().toISOString()}`);
  console.log(`🌐 Request URL: ${req.url}`);
  console.log(`📋 Request method: ${req.method}`);
  console.log(`📦 Content-Type: ${req.get('Content-Type')}`);

  try {
    console.log('📤 Upload request body:', {
      body: req.body,
      files: req.files ? Object.keys(req.files).map(key => ({
        field: key,
        count: req.files[key].length,
        files: req.files[key].map(f => ({
          name: f.originalname,
          size: f.size,
          mimetype: f.mimetype
        }))
      })) : 'no files'
    });

    const { allegiance, faction, unit } = req.body;

    if (!allegiance || !faction || !unit) {
      console.log('❌ Missing required fields:', {
        allegiance: allegiance || 'MISSING',
        faction: faction || 'MISSING',
        unit: unit || 'MISSING'
      });
      return res.status(400).json({
        error: 'Allegiance, Faction und Unit sind erforderlich'
      });
    }

    const sanitize = (str) => str.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const remotePath = `${sanitize(allegiance)}/${sanitize(faction)}/${sanitize(unit)}`;
    const folderPath = `files/${remotePath}`;

    const uploadedFiles = {
      preview: null,
      stlFiles: []
    };

    // Process preview image
    if (req.files.preview && req.files.preview[0]) {
      const previewFile = req.files.preview[0];
      console.log(`📸 Uploading preview image to FTP...`);

      try {
        await ftpService.uploadFile(
          previewFile.buffer,
          remotePath,
          'preview.jpg'
        );
        uploadedFiles.preview = `${folderPath}/preview.jpg`;
        console.log(`✅ Preview uploaded successfully`);
      } catch (error) {
        console.error(`❌ Preview upload failed:`, error.message);
        throw new Error(`Preview-Upload fehlgeschlagen: ${error.message}`);
      }
    }

    // Process STL files
    if (req.files.stlFiles) {
      console.log(`📁 Processing ${req.files.stlFiles.length} files...`);
      for (const file of req.files.stlFiles) {
        console.log(`📄 Processing file:`, {
          original: file.originalname,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          mimetype: file.mimetype
        });

        try {
          await ftpService.uploadFile(
            file.buffer,
            remotePath,
            file.originalname
          );

          uploadedFiles.stlFiles.push({
            name: file.originalname,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            path: `${folderPath}/${file.originalname}`
          });

          console.log(`✅ File uploaded successfully: ${file.originalname}`);
        } catch (error) {
          console.error(`❌ File upload failed for ${file.originalname}:`, error.message);
          throw new Error(`Upload fehlgeschlagen für ${file.originalname}: ${error.message}`);
        }
      }
    }

    const responseData = {
      success: true,
      message: 'Dateien erfolgreich hochgeladen',
      files: uploadedFiles,
      folderPath: folderPath
    };

    console.log('✅ Upload processing completed successfully');
    console.log('📋 Response data:', responseData);
    console.log(`🏁 === UPLOAD REQUEST END ===\n`);

    res.json(responseData);

  } catch (error) {
    console.error('❌ === UPLOAD ERROR ===');
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Request body:', req.body);
    console.error('❌ === END ERROR ===\n');

    const errorResponse = {
      error: 'Fehler beim Hochladen der Dateien',
      details: error.message
    };

    res.status(500).json(errorResponse);
  }
});

// Download endpoint (FTP proxy)
app.get('/api/download/:allegiance/:faction/:unit/:filename', async (req, res) => {
  try {
    const { allegiance, faction, unit, filename } = req.params;

    const sanitize = (str) => str.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const remotePath = `${sanitize(allegiance)}/${sanitize(faction)}/${sanitize(unit)}/${filename}`;

    console.log(`📥 Downloading file from FTP: ${remotePath}`);

    const fileBuffer = await ftpService.downloadFile(remotePath);

    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Length', fileBuffer.length);
    res.send(fileBuffer);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Fehler beim Herunterladen der Datei' });
  }
});

// Bulk download endpoint
app.get('/api/download-all/:allegiance/:faction/:unit', (req, res) => {
  try {
    const { allegiance, faction, unit } = req.params;
    
    const sanitize = (str) => str.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const folderPath = path.join(
      filesDir,
      sanitize(allegiance),
      sanitize(faction),
      sanitize(unit)
    );

    if (!fs.existsSync(folderPath)) {
      return res.status(404).json({ error: 'Ordner nicht gefunden' });
    }

    const files = fs.readdirSync(folderPath);
    const stlFiles = files.filter(file => 
      file.endsWith('.stl') || 
      file.endsWith('.xz') || 
      file.endsWith('.gz') || 
      file.endsWith('.zip') || 
      file.endsWith('.7z') || 
      file.endsWith('.rar')
    );
    
    if (stlFiles.length === 0) {
      return res.status(404).json({ error: 'Keine STL-Dateien gefunden' });
    }

    // For now, just return the first file or suggest individual downloads
    res.json({
      message: 'Bulk download not available. Please download files individually.',
      files: stlFiles.map(file => ({
        name: file,
        downloadUrl: `/api/download/${allegiance}/${faction}/${unit}/${file}`
      }))
    });

  } catch (error) {
    console.error('Bulk download error:', error);
    res.status(500).json({ error: 'Fehler beim Herunterladen der Dateien' });
  }
});

// Get file info endpoint (FTP version)
app.get('/api/files/:allegiance/:faction/:unit', async (req, res) => {
  try {
    const { allegiance, faction, unit } = req.params;

    const sanitize = (str) => str.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const remotePath = `${sanitize(allegiance)}/${sanitize(faction)}/${sanitize(unit)}`;

    const exists = await ftpService.directoryExists(remotePath);

    if (!exists) {
      return res.json({
        exists: false,
        files: []
      });
    }

    const files = await ftpService.listFiles(remotePath);
    const fileInfo = files
      .filter(file => !file.isDirectory)
      .map(file => {
        const isCompressed = file.name.endsWith('.xz');
        const displayName = isCompressed ? file.name.replace('.xz', '') : file.name;

        return {
          name: displayName,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          path: `files/${remotePath}/${file.name}`,
          isPreview: file.name === 'preview.jpg'
        };
      });

    res.json({
      exists: true,
      files: fileInfo
    });

  } catch (error) {
    console.error('File info error:', error);
    res.status(500).json({
      error: 'Fehler beim Abrufen der Dateiinformationen'
    });
  }
});

// Delete file endpoint (FTP version)
app.delete('/api/files/:allegiance/:faction/:unit/:filename', async (req, res) => {
  try {
    const { allegiance, faction, unit, filename } = req.params;

    const sanitize = (str) => str.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const remotePath = `${sanitize(allegiance)}/${sanitize(faction)}/${sanitize(unit)}/${filename}`;

    await ftpService.deleteFile(remotePath);
    res.json({
      success: true,
      message: 'Datei erfolgreich gelöscht'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: 'Fehler beim Löschen der Datei'
    });
  }
});

// Health check (including FTP)
app.get('/api/health', async (req, res) => {
  try {
    const ftpHealth = await ftpService.checkHealth();
    res.json({
      status: 'OK',
      message: 'Server läuft',
      timestamp: new Date().toISOString(),
      ftp: ftpHealth
    });
  } catch (error) {
    res.json({
      status: 'DEGRADED',
      message: 'Server läuft, aber FTP nicht erreichbar',
      timestamp: new Date().toISOString(),
      ftp: {
        status: 'ERROR',
        error: error.message
      }
    });
  }
});

// Image proxy endpoint for preview images
app.get('/files/*', async (req, res) => {
  try {
    const filePath = req.params[0];
    console.log(`🖼️ Image proxy request: ${filePath}`);

    const fileBuffer = await ftpService.downloadFile(filePath);

    const ext = path.extname(filePath).toLowerCase();
    const contentTypeMap = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp'
    };

    const contentType = contentTypeMap[ext] || 'application/octet-stream';

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', fileBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(fileBuffer);

  } catch (error) {
    console.error('Image proxy error:', error);
    res.status(404).send('Image not found');
  }
});

// Auto-scan folders for new units (FTP version)
app.get('/api/scan-folders/:armyId', async (req, res) => {
  try {
    const { armyId } = req.params;

    const allegianceMap = {
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
      'ogor-mawtribes': 'destruction',

      'endless-spells': 'others',
      'buildings': 'others'
    };

    const allegiance = allegianceMap[armyId];
    if (!allegiance) {
      return res.status(400).json({ error: 'Unknown army ID' });
    }

    const sanitize = (str) => str.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const armyFolderPath = `${sanitize(allegiance)}/${sanitize(armyId)}`;

    const exists = await ftpService.directoryExists(armyFolderPath);
    if (!exists) {
      return res.json({ newUnits: [] });
    }

    const newUnits = [];
    const folders = await ftpService.listFiles(armyFolderPath);
    const unitFolders = folders.filter(f => f.isDirectory);

    for (const folder of unitFolders) {
      const folderName = folder.name;
      const unitFolderPath = `${armyFolderPath}/${folderName}`;
      const files = await ftpService.listFiles(unitFolderPath);

      if (files.length === 0) continue;

      const unitName = folderName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const unitId = folderName;

      const previewImage = files.find(file => file.name.toLowerCase() === 'preview.jpg');
      const previewPath = previewImage
        ? `files/${armyFolderPath}/${folderName}/preview.jpg`
        : '';

      const stlFiles = files
        .filter(file => {
          const ext = path.extname(file.name).toLowerCase();
          return ['.stl', '.zip', '.7z', '.rar', '.xz', '.gz'].includes(ext);
        })
        .map(file => ({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          path: `files/${armyFolderPath}/${folderName}/${file.name}`
        }));

      if (stlFiles.length > 0 || previewImage) {
        const newUnit = {
          id: unitId,
          name: unitName,
          points: 0,
          move: '6"',
          health: 1,
          save: '6+',
          control: 1,
          weapons: [],
          abilities: [],
          keywords: ['Infantry'],
          unitSize: '1',
          reinforcement: '',
          notes: `Automatisch erstellt aus Ordner: ${folderName}`,
          stlFiles: stlFiles,
          previewImage: previewPath,
          printNotes: stlFiles.length > 0 ? 'STL-Dateien aus Ordner-Scan verfügbar' : ''
        };

        newUnits.push(newUnit);
      }
    }

    res.json({
      newUnits,
      scannedPath: armyFolderPath,
      foundFolders: unitFolders.length
    });

  } catch (error) {
    console.error('Folder scan error:', error);
    res.status(500).json({
      error: 'Fehler beim Scannen der Ordner',
      details: error.message
    });
  }
});

// Global scan for all armies (FTP version)
app.get('/api/scan-all-folders', async (req, res) => {
  try {
    console.log('🔍 Starting global folder scan (FTP)...');

    const dbData = await getData();

    const sanitize = (str) => str.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const allegianceMap = {
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
      'ogor-mawtribes': 'destruction',

      'endless-spells': 'others',
      'buildings': 'others'
    };

    const updatedData = { ...dbData };
    const allNewUnits = {};
    let totalNewUnits = 0;

    for (const [armyId, allegiance] of Object.entries(allegianceMap)) {
      const armyFolderPath = `${sanitize(allegiance)}/${sanitize(armyId)}`;

      const exists = await ftpService.directoryExists(armyFolderPath);
      if (!exists) continue;

      const folders = await ftpService.listFiles(armyFolderPath);
      const unitFolders = folders.filter(d => d.isDirectory).map(d => d.name);

      for (const folderName of unitFolders) {
        const unitFolderPath = `${armyFolderPath}/${folderName}`;
        const files = await ftpService.listFiles(unitFolderPath);

        if (files.length === 0) continue;

        const unitName = folderName
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        const unitId = folderName;
        const previewImage = files.find(file => file.name.toLowerCase() === 'preview.jpg');
        const previewPath = previewImage
          ? `files/${armyFolderPath}/${folderName}/preview.jpg`
          : '';

        const stlFiles = files
          .filter(file => ['.stl', '.zip', '.7z', '.rar', '.xz', '.gz'].includes(path.extname(file.name).toLowerCase()))
          .map(file => ({
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            path: `files/${armyFolderPath}/${folderName}/${file.name}`
          }));

        const existingUnits = updatedData.armies.find(a => a.id === armyId)?.units || [];
        const existingUnit = existingUnits.find(u => u.id === unitId);

        if (existingUnit) {
          const currentFileNames = stlFiles.map(f => f.name);

          const originalLength = existingUnit.stlFiles.length;
          existingUnit.stlFiles = existingUnit.stlFiles.filter(f => currentFileNames.includes(f.name));
          const removed = originalLength - existingUnit.stlFiles.length;

          let addedFiles = 0;
          for (const file of stlFiles) {
            if (!existingUnit.stlFiles.some(f => f.name === file.name)) {
              existingUnit.stlFiles.push(file);
              addedFiles++;
            }
          }

          if (!existingUnit.previewImage && previewPath) {
            existingUnit.previewImage = previewPath;
          }

          if (addedFiles > 0 || removed > 0) {
            console.log(`🔄 Updated unit: ${unitName} (+${addedFiles} / -${removed} files)`);
            totalNewUnits++;
          }

        } else {
          const newUnit = {
            id: unitId,
            name: unitName,
            points: 0,
            move: '6"',
            health: 1,
            save: '6+',
            control: 1,
            weapons: [],
            abilities: [],
            keywords: ['Infantry'],
            unitSize: '1',
            reinforcement: '',
            notes: `Automatisch erstellt aus Ordner: ${folderName}`,
            stlFiles,
            previewImage: previewPath,
            printNotes: stlFiles.length > 0 ? 'STL-Dateien aus Ordner-Scan verfügbar' : ''
          };

          if (!updatedData.armies.find(a => a.id === armyId)) {
            updatedData.armies.push({ id: armyId, units: [] });
          }

          const armyEntry = updatedData.armies.find(a => a.id === armyId);
          armyEntry.units.push(newUnit);

          if (!allNewUnits[armyId]) {
            allNewUnits[armyId] = [];
          }
          allNewUnits[armyId].push(newUnit);

          console.log(`✅ Found new unit: ${unitName} (${stlFiles.length} files)`);
          totalNewUnits++;
        }
      }
    }

    await setData(updatedData);

    console.log(`🎉 Global scan complete. ${totalNewUnits} units added or updated.`);
    res.json({
      totalNewUnits,
      scannedArmies: Object.keys(allegianceMap).length,
      summary: Object.entries(allNewUnits).map(([armyId, units]) => ({
        armyName: armyId,
        newUnitsCount: units.length,
        unitNames: units.map(u => u.name)
      }))
    });

  } catch (err) {
    console.error('❌ Scan error:', err);
    res.status(500).json({ error: 'Scan failed', details: err.message });
  }
});



// Storage info endpoint
app.get('/api/storage', (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Get disk usage for the files directory
    const filesDir = path.join(__dirname, '../public/files');
    const dataDir = path.join(__dirname, '../data');
    
    // Calculate used space by uploaded files
    const calculateDirectorySize = (dirPath) => {
      if (!fs.existsSync(dirPath)) return 0;
      
      let totalSize = 0;
      const files = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const file of files) {
        const filePath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
          totalSize += calculateDirectorySize(filePath);
        } else {
          const stats = fs.statSync(filePath);
          totalSize += stats.size;
        }
      }
      return totalSize;
    };
    
    // Calculate sizes
    const uploadedFilesSize = calculateDirectorySize(filesDir);
    const dataSize = calculateDirectorySize(dataDir);
    const totalUsed = uploadedFilesSize + dataSize;
    
    // Get system disk usage (Linux/Unix)
    const { execSync } = require('child_process');
    let diskInfo = { total: 0, available: 0, used: 0 };
    
    try {
      // Get disk usage for the current directory
      const dfOutput = execSync('df -B1 .', { encoding: 'utf8' });
      const lines = dfOutput.trim().split('\n');
      if (lines.length > 1) {
        const parts = lines[1].split(/\s+/);
        diskInfo = {
          total: parseInt(parts[1]) || 0,
          used: parseInt(parts[2]) || 0,
          available: parseInt(parts[3]) || 0
        };
      }
    } catch (error) {
      console.warn('Could not get disk usage:', error.message);
    }
    
    // Count files
    const countFiles = (dirPath, extensions = []) => {
      if (!fs.existsSync(dirPath)) return 0;
      
      let count = 0;
      const files = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const file of files) {
        const filePath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
          count += countFiles(filePath, extensions);
        } else if (extensions.length === 0 || extensions.some(ext => file.name.toLowerCase().endsWith(ext))) {
          count++;
        }
      }
      return count;
    };
    
    const stlCount = countFiles(filesDir, ['.stl', '.zip', '.7z', '.rar', '.xz', '.gz']);
    const imageCount = countFiles(filesDir, ['.jpg', '.jpeg', '.png', '.gif', '.webp']);
    const totalFiles = countFiles(filesDir);
    
    res.json({
      storage: {
        disk: {
          total: diskInfo.total,
          used: diskInfo.used,
          available: diskInfo.available,
          usedPercentage: diskInfo.total > 0 ? Math.round((diskInfo.used / diskInfo.total) * 100) : 0
        },
        uploads: {
          totalSize: totalUsed,
          filesSize: uploadedFilesSize,
          dataSize: dataSize,
          stlFiles: stlCount,
          imageFiles: imageCount,
          totalFiles: totalFiles
        }
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Storage info error:', error);
    res.status(500).json({ 
      error: 'Fehler beim Abrufen der Speicherinformationen',
      details: error.message 
    });
  }
});
// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 === MIDDLEWARE ERROR ===');
  console.error('🚨 Error type:', error.constructor.name);
  console.error('🚨 Error message:', error.message);
  console.error('🚨 Request URL:', req.url);
  console.error('🚨 Request method:', req.method);
  
  if (error instanceof multer.MulterError) {
    console.error('🚨 Multer error code:', error.code);
    console.error('🚨 Multer error field:', error.field);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      console.error('🚨 File too large');
      return res.status(400).json({
        error: 'Datei zu groß. Maximum: 100MB'
      });
    }
    
    if (error.code === 'LIMIT_FILE_COUNT') {
      console.error('🚨 Too many files');
      return res.status(400).json({
        error: 'Zu viele Dateien. Maximum: 20 STL-Dateien'
      });
    }
    
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      console.error('🚨 Unexpected file field');
      return res.status(400).json({
        error: 'Unerwartetes Dateifeld'
      });
    }
  }
  
  console.error('🚨 === END MIDDLEWARE ERROR ===\n');
  
  res.status(500).json({
    error: 'Server-Fehler',
    details: error.message
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
  console.log(`🌐 Frontend URL: http://localhost:5173`);
  console.log(`🔧 API URL: http://localhost:${PORT}/api`);
  console.log(`📁 Datenbank: Lokal (LowDB)`);
  console.log(`📦 Dateispeicher: FTP-Server`);

  try {
    const ftpHealth = await ftpService.checkHealth();
    if (ftpHealth.status === 'OK') {
      console.log(`✅ FTP verbunden: ${ftpHealth.host}${ftpHealth.basePath}`);
    } else {
      console.log(`⚠️  FTP nicht verbunden - bitte .env konfigurieren`);
      console.log(`📖 Siehe server/FTP-SETUP.md für Anweisungen`);
    }
  } catch (error) {
    console.log(`⚠️  FTP nicht verbunden - bitte .env konfigurieren`);
    console.log(`📖 Siehe server/FTP-SETUP.md für Anweisungen`);
  }
});
