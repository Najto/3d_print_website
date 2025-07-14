const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { initDB, getData, setData, clearData } = require('./dataStore');
initDB();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Ensure files directory exists
const filesDir = path.join(__dirname, '../public/files');
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
}

// Ensure data directory exists
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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { allegiance, faction, unit } = req.body;
    
    // Sanitize folder names
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
    
    // Create directory if it doesn't exist
    fs.mkdirSync(folderPath, { recursive: true });
    
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    // Use original filename or default names
    let filename = file.originalname;
    
    if (file.fieldname === 'preview') {
      filename = 'preview.jpg';
    }
    
    cb(null, filename);
  }
});

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

// Upload endpoint for multiple files
app.post('/api/upload', upload.fields([
  { name: 'preview', maxCount: 1 },
  { name: 'stlFiles', maxCount: 20 }
]), (req, res, next) => {
  console.log(`\n🚀 === UPLOAD REQUEST START ===`);
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

    const folderPath = `files/${sanitize(allegiance)}/${sanitize(faction)}/${sanitize(unit)}`;
    
    const uploadedFiles = {
      preview: null,
      stlFiles: []
    };

    // Process preview image
    if (req.files.preview) {
      uploadedFiles.preview = `${folderPath}/preview.jpg`;
    }

    // Process STL files with compression
    if (req.files.stlFiles) {
      console.log(`📁 Processing ${req.files.stlFiles.length} files...`);
      for (const file of req.files.stlFiles) {
        console.log(`📄 Processing file:`, {
          original: file.originalname,
          saved: file.filename,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          mimetype: file.mimetype,
          path: file.path
        });
        
        uploadedFiles.stlFiles.push({
          name: file.filename,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          path: `${folderPath}/${file.filename}`
        });
        
        console.log(`✅ File processed successfully: ${file.filename}`);
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
    console.error('❌ Request files:', req.files);
    console.error('❌ === END ERROR ===\n');
    
    // Ensure we always send a JSON response
    const errorResponse = { 
      error: 'Fehler beim Hochladen der Dateien',
      details: error.message 
    };
    
    res.status(500).json(errorResponse);
  }
});

// Download endpoint
app.get('/api/download/:allegiance/:faction/:unit/:filename', (req, res) => {
  try {
    const { allegiance, faction, unit, filename } = req.params;
    
    const sanitize = (str) => str.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const filePath = path.join(
      filesDir,
      sanitize(allegiance),
      sanitize(faction),
      sanitize(unit),
      filename
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Datei nicht gefunden' });
    }

    // Serve file directly
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.sendFile(filePath);

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

// Get file info endpoint
app.get('/api/files/:allegiance/:faction/:unit', (req, res) => {
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
      return res.json({
        exists: false,
        files: []
      });
    }

    const files = fs.readdirSync(folderPath);
    const fileInfo = files.map(filename => {
      const filePath = path.join(folderPath, filename);
      const stats = fs.statSync(filePath);
      const isCompressed = filename.endsWith('.xz');
      const displayName = isCompressed ? filename.replace('.xz', '') : filename;
      
      return {
        name: displayName,
        size: `${(stats.size / (1024 * 1024)).toFixed(1)} MB`,
        path: `files/${sanitize(allegiance)}/${sanitize(faction)}/${sanitize(unit)}/${filename}`,
        isPreview: filename === 'preview.jpg'
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

// Delete file endpoint
app.delete('/api/files/:allegiance/:faction/:unit/:filename', (req, res) => {
  try {
    const { allegiance, faction, unit, filename } = req.params;
    
    const sanitize = (str) => str.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const filePath = path.join(
      filesDir,
      sanitize(allegiance),
      sanitize(faction),
      sanitize(unit),
      filename
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ 
        success: true, 
        message: 'Datei erfolgreich gelöscht' 
      });
    } else {
      res.status(404).json({ 
        error: 'Datei nicht gefunden' 
      });
    }

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ 
      error: 'Fehler beim Löschen der Datei' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server läuft',
    timestamp: new Date().toISOString()
  });
});

// Auto-scan folders for new units
app.get('/api/scan-folders/:armyId', (req, res) => {
  try {
    const { armyId } = req.params;
    
    // Get allegiance from army mapping
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
      
      // Others categories
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
    
    const armyFolderPath = path.join(filesDir, sanitize(allegiance), sanitize(armyId));
    
    if (!fs.existsSync(armyFolderPath)) {
      return res.json({ newUnits: [] });
    }
    
    const newUnits = [];
    const folders = fs.readdirSync(armyFolderPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    for (const folderName of folders) {
      const unitFolderPath = path.join(armyFolderPath, folderName);
      const files = fs.readdirSync(unitFolderPath);
      
      // Check if folder has any files
      if (files.length === 0) continue;
      
      // Create unit name from folder name
      const unitName = folderName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Generate unit ID
      const unitId = folderName;
      
      // Check for preview image
      const previewImage = files.find(file => file.toLowerCase() === 'preview.jpg');
      const previewPath = previewImage ? 
        `files/${sanitize(allegiance)}/${sanitize(armyId)}/${folderName}/preview.jpg` : '';
      
      // Get STL and archive files
      const stlFiles = files
        .filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.stl', '.zip', '.7z', '.rar', '.xz', '.gz'].includes(ext);
        })
        .map(fileName => {
          const filePath = path.join(unitFolderPath, fileName);
          const stats = fs.statSync(filePath);
          return {
            name: fileName,
            size: `${(stats.size / (1024 * 1024)).toFixed(1)} MB`,
            path: `files/${sanitize(allegiance)}/${sanitize(armyId)}/${folderName}/${fileName}`
          };
        });
      
      // Only create unit if it has STL files or preview image
      if (stlFiles.length > 0 || previewImage) {
        const newUnit = {
          id: unitId,
          name: unitName,
          points: 0, // Default values - user can edit later
          move: '6"',
          health: 1,
          save: '6+',
          control: 1,
          weapons: [],
          abilities: [],
          keywords: ['Infantry'], // Default keyword
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
      foundFolders: folders.length
    });
    
  } catch (error) {
    console.error('Folder scan error:', error);
    res.status(500).json({ 
      error: 'Fehler beim Scannen der Ordner',
      details: error.message 
    });
  }
});

// Global scan for all armies
const { getData, setData } = require('./dataStore'); // Wichtig!

app.get('/api/scan-all-folders', async (req, res) => {
  try {
    console.log('🔍 Starting global folder scan...');

    const allegianceMap = {
      // Ordnung
      'stormcast-eternals': 'order',
      'cities-of-sigmar': 'order',
      'sylvaneth': 'order',
      'lumineth-realm-lords': 'order',
      'idoneth-deepkin': 'order',
      'daughters-of-khaine': 'order',
      'fyreslayers': 'order',
      'kharadron-overlords': 'order',
      'seraphon': 'order',
      // Chaos
      'slaves-to-darkness': 'chaos',
      'khorne-bloodbound': 'chaos',
      'disciples-of-tzeentch': 'chaos',
      'maggotkin-of-nurgle': 'chaos',
      'hedonites-of-slaanesh': 'chaos',
      'skaven': 'chaos',
      'beasts-of-chaos': 'chaos',
      // Tod
      'nighthaunt': 'death',
      'ossiarch-bonereapers': 'death',
      'flesh-eater-courts': 'death',
      'soulblight-gravelords': 'death',
      // Zerstörung
      'orruk-warclans': 'destruction',
      'gloomspite-gitz': 'destruction',
      'sons-of-behemat': 'destruction',
      'ogor-mawtribes': 'destruction',
      // Sonstiges
      'endless-spells': 'others',
      'buildings': 'others'
    };

    const sanitize = (str) => str.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    const mergeUnitData = (existingUnit, newUnit) => {
      const merged = { ...existingUnit };

      // Aktualisiere Preview, wenn neu vorhanden
      if (newUnit.previewImage && !existingUnit.previewImage) {
        merged.previewImage = newUnit.previewImage;
      }

      // Neue Dateien ergänzen
      const existingFiles = new Set(existingUnit.stlFiles.map(f => f.name));
      const newFiles = newUnit.stlFiles.filter(f => !existingFiles.has(f.name));
      merged.stlFiles = [...existingUnit.stlFiles, ...newFiles];

      return merged;
    };

    const existingData = await getData();
    const updatedArmies = [];
    let totalNewUnits = 0;
    let scannedArmies = 0;

    for (const [armyId, allegiance] of Object.entries(allegianceMap)) {
      const armyFolderPath = path.join(filesDir, sanitize(allegiance), sanitize(armyId));
      if (!fs.existsSync(armyFolderPath)) {
        console.log(`⏭️ Skipping ${armyId} - folder not found`);
        continue;
      }

      console.log(`📁 Scanning ${armyId}...`);
      scannedArmies++;

      const folders = fs.readdirSync(armyFolderPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      let updatedUnits = [];

      for (const folderName of folders) {
        const unitFolderPath = path.join(armyFolderPath, folderName);
        const files = fs.readdirSync(unitFolderPath);

        if (files.length === 0) continue;

        const unitName = folderName
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        const unitId = folderName;

        const previewImage = files.find(f => f.toLowerCase() === 'preview.jpg');
        const previewPath = previewImage
          ? `files/${sanitize(allegiance)}/${sanitize(armyId)}/${folderName}/preview.jpg`
          : '';

        const stlFiles = files
          .filter(file => ['.stl', '.zip', '.7z', '.rar', '.xz', '.gz']
            .includes(path.extname(file).toLowerCase()))
          .map(fileName => {
            const filePath = path.join(unitFolderPath, fileName);
            const stats = fs.statSync(filePath);
            return {
              name: fileName,
              size: `${(stats.size / (1024 * 1024)).toFixed(1)} MB`,
              path: `files/${sanitize(allegiance)}/${sanitize(armyId)}/${folderName}/${fileName}`
            };
          });

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

        const existingArmy = existingData.armies.find(a => a.id === armyId);
        if (!existingArmy) {
          updatedUnits.push(newUnit);
          totalNewUnits++;
          console.log(`  ✅ New unit: ${unitName} (${stlFiles.length} files)`);
        } else {
          const existingUnitIndex = existingArmy.units.findIndex(u => u.id === unitId);
          if (existingUnitIndex === -1) {
            existingArmy.units.push(newUnit);
            totalNewUnits++;
            console.log(`  ➕ Added new unit to existing army: ${unitName}`);
          } else {
            const oldUnit = existingArmy.units[existingUnitIndex];
            const merged = mergeUnitData(oldUnit, newUnit);
            existingArmy.units[existingUnitIndex] = merged;
            console.log(`  🔄 Updated existing unit: ${unitName}`);
          }

          updatedUnits = existingArmy.units;
        }
      }

      if (updatedUnits.length > 0) {
        updatedArmies.push({ id: armyId, units: updatedUnits });
      }
    }

    await setData({
      armies: updatedArmies,
      otherCategories: existingData.otherCategories || []
    });

    console.log(`🎉 Global scan complete: ${totalNewUnits} new or updated units across ${scannedArmies} armies`);

    res.json({
      totalNewUnits,
      scannedArmies,
      summary: updatedArmies.map(a => ({
        armyId: a.id,
        newUnitsCount: a.units.length,
        unitNames: a.units.map(u => u.name)
      }))
    });

  } catch (error) {
    console.error('Global folder scan error:', error);
    res.status(500).json({
      error: 'Fehler beim globalen Ordner-Scan',
      details: error.message
    });
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

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
  console.log(`📁 Dateien werden gespeichert in: ${filesDir}`);
  console.log(`🌐 Frontend URL: http://localhost:5173`);
  console.log(`🔧 API URL: http://localhost:${PORT}/api`);
});
