const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { authMiddleware, requireRole } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Apply authentication to all routes except health check
app.use('/api', (req, res, next) => {
  if (req.path === '/health') {
    return next();
  }
  authMiddleware(req, res, next);
});

app.use(express.static('public'));

// Ensure files directory exists
const filesDir = path.join(__dirname, '../public/files');
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir, { recursive: true });
}

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
    const allowedTypes = /jpeg|jpg|png|gif|webp|stl/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/octet-stream';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Nur Bilder (JPG, PNG, GIF, WebP) und STL-Dateien sind erlaubt!'));
    }
  }
});

// Upload endpoint for multiple files
app.post('/api/upload', requireRole('admin'), upload.fields([
  { name: 'preview', maxCount: 1 },
  { name: 'stlFiles', maxCount: 20 }
]), (req, res) => {
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

    // Process STL files
    if (req.files.stlFiles) {
      uploadedFiles.stlFiles = req.files.stlFiles.map(file => ({
        name: file.filename,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        path: `${folderPath}/${file.filename}`
      }));
    }

    res.json({
      success: true,
      message: 'Dateien erfolgreich hochgeladen',
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
      
      return {
        name: filename,
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
app.delete('/api/files/:allegiance/:faction/:unit/:filename', requireRole('admin'), (req, res) => {
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