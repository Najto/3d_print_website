const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const compressionService = require('./services/compressionService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
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

const dataFile = path.join(dataDir, 'aos-data.json');

// Data persistence endpoints
app.get('/api/data', (req, res) => {
  try {
    if (fs.existsSync(dataFile)) {
      const data = fs.readFileSync(dataFile, 'utf8');
      res.json(JSON.parse(data));
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (error) {
    console.error('Error reading data:', error);
    res.status(500).json({ error: 'Failed to read data' });
  }
});

app.post('/api/data', (req, res) => {
  try {
    const data = req.body;
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
});

app.delete('/api/data', (req, res) => {
  try {
    if (fs.existsSync(dataFile)) {
      fs.unlinkSync(dataFile);
    }
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
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and STL files
    const allowedTypes = /jpeg|jpg|png|gif|webp|stl|xz|gz|zip|7z/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || 
                     file.mimetype === 'application/octet-stream' ||
                     file.mimetype === 'application/x-xz' ||
                     file.mimetype === 'application/gzip' ||
                     file.mimetype === 'application/zip' ||
                     file.mimetype === 'application/x-7z-compressed';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Nur Bilder (JPG, PNG, GIF, WebP), STL-Dateien und komprimierte Archive sind erlaubt!'));
    }
  }
});

// Upload endpoint for multiple files
app.post('/api/upload', upload.fields([
  { name: 'preview', maxCount: 1 },
  { name: 'stlFiles', maxCount: 20 }
]), async (req, res) => {
  try {
    const { allegiance, faction, unit } = req.body;
    
    if (!allegiance || !faction || !unit) {
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
      for (const file of req.files.stlFiles) {
        const originalPath = file.path;
        const originalSize = file.size;
        const isAlreadyCompressed = /\.(xz|gz|zip|7z)$/i.test(file.filename);
        
        if (isAlreadyCompressed) {
          // File is already compressed - keep as is
          console.log(`📦 Pre-compressed file detected: ${file.filename}`);
          uploadedFiles.stlFiles.push({
            name: file.filename,
            compressedName: file.filename,
            originalSize: `${(originalSize / (1024 * 1024)).toFixed(1)} MB`,
            compressedSize: `${(originalSize / (1024 * 1024)).toFixed(1)} MB`,
            compressionRatio: 'Pre-compressed',
            path: `${folderPath}/${file.filename}`,
            isCompressed: true,
            preCompressed: true
          });
        } else {
          // Try to compress uncompressed STL files
          try {
            // Compress STL file
            const compressionResult = await compressionService.compressSTL(
              originalPath,
              path.join(path.dirname(originalPath), path.parse(file.filename).name)
            );
            
            // Remove original uncompressed file
            fs.unlinkSync(originalPath);
            
            // Add compressed file info
            uploadedFiles.stlFiles.push({
              name: file.filename,
              compressedName: path.basename(compressionResult.compressedPath),
              originalSize: `${(originalSize / (1024 * 1024)).toFixed(1)} MB`,
              compressedSize: `${(compressionResult.compressedSize / (1024 * 1024)).toFixed(1)} MB`,
              compressionRatio: `${compressionResult.compressionRatio}%`,
              path: `${folderPath}/${path.basename(compressionResult.compressedPath)}`,
              isCompressed: true,
              preCompressed: false
            });
            
          } catch (compressionError) {
            console.error('Compression failed for', file.filename, '- keeping original:', compressionError);
            
            // Keep original file if compression fails
            uploadedFiles.stlFiles.push({
              name: file.filename,
              originalSize: `${(originalSize / (1024 * 1024)).toFixed(1)} MB`,
              compressedSize: `${(originalSize / (1024 * 1024)).toFixed(1)} MB`,
              compressionRatio: '0%',
              path: `${folderPath}/${file.filename}`,
              isCompressed: false,
              preCompressed: false
            });
          }
        }
      }
    }

    res.json({
      success: true,
      message: 'Dateien erfolgreich hochgeladen und komprimiert',
      files: uploadedFiles,
      folderPath: folderPath
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Fehler beim Hochladen der Dateien',
      details: error.message 
    });
  }
});

// Download endpoint with decompression
app.get('/api/download/:allegiance/:faction/:unit/:filename/:compressed?', async (req, res) => {
  try {
    const { allegiance, faction, unit, filename, compressed } = req.params;
    
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

    // Check if user wants compressed version or file should be decompressed
    const wantsCompressed = compressed === 'compressed';
    const isCompressedFile = /\.(xz|gz|zip|7z)$/i.test(filename);
    
    if (isCompressedFile && !wantsCompressed) {
      // Decompress on-the-fly
      const tempDir = path.join(__dirname, 'temp');
      fs.mkdirSync(tempDir, { recursive: true });
      
      const originalFilename = filename.replace(/\.(xz|gz|zip|7z)$/i, '.stl');
      const tempPath = path.join(tempDir, `${Date.now()}_${originalFilename}`);
      
      try {
        if (filename.endsWith('.xz')) {
          await compressionService.decompressSTL(filePath, tempPath);
        } else {
          // For other compression formats, copy as-is for now
          // Could be extended with additional decompression methods
          fs.copyFileSync(filePath, tempPath);
        }
        
        res.setHeader('Content-Disposition', `attachment; filename="${originalFilename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        
        const stream = fs.createReadStream(tempPath);
        stream.pipe(res);
        
        // Cleanup temp file after download
        stream.on('end', () => {
          setTimeout(() => {
            compressionService.cleanupFiles([tempPath]);
          }, 1000);
        });
        
      } catch (decompressionError) {
        console.error('Decompression failed:', decompressionError);
        res.status(500).json({ error: 'Fehler beim Dekomprimieren der Datei' });
      }
    } else {
      // Serve file directly (either uncompressed or user wants compressed version)
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.sendFile(filePath);
    }

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Fehler beim Herunterladen der Datei' });
  }
});

// Bulk download endpoint with compression
app.get('/api/download-all/:allegiance/:faction/:unit', async (req, res) => {
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
    const stlFiles = files.filter(file => file.endsWith('.stl') || file.endsWith('.xz'));
    
    if (stlFiles.length === 0) {
      return res.status(404).json({ error: 'Keine STL-Dateien gefunden' });
    }

    // Create temporary archive
    const tempDir = path.join(__dirname, 'temp');
    fs.mkdirSync(tempDir, { recursive: true });
    
    const archiveName = `${sanitize(unit)}_stl_files.zip`;
    const archivePath = path.join(tempDir, archiveName);
    
    // Prepare file paths for archiving
    const filePaths = stlFiles.map(file => path.join(folderPath, file));
    
    try {
      const archiveResult = await compressionService.createCompressedArchive(filePaths, archivePath);
      
      res.setHeader('Content-Disposition', `attachment; filename="${archiveName}"`);
      res.setHeader('Content-Type', 'application/zip');
      
      const stream = fs.createReadStream(archivePath);
      stream.pipe(res);
      
      // Cleanup temp file after download
      stream.on('end', () => {
        setTimeout(() => {
          compressionService.cleanupFiles([archivePath]);
        }, 1000);
      });
      
    } catch (archiveError) {
      console.error('Archive creation failed:', archiveError);
      res.status(500).json({ error: 'Fehler beim Erstellen des Archivs' });
    }

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
        actualName: filename,
        size: `${(stats.size / (1024 * 1024)).toFixed(1)} MB`,
        path: `files/${sanitize(allegiance)}/${sanitize(faction)}/${sanitize(unit)}/${filename}`,
        isPreview: filename === 'preview.jpg',
        isCompressed: isCompressed
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

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'Datei zu groß. Maximum: 100MB'
      });
    }
  }
  
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