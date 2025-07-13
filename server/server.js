const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

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