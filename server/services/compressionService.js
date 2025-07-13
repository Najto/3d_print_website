const lzma = require('lzma-native');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const yauzl = require('yauzl');

class CompressionService {
  constructor() {
    this.compressionLevel = 9; // Maximum compression
    this.compressionPreset = lzma.PRESET_EXTREME;
  }

  /**
   * Compress STL file using LZMA2
   * @param {string} inputPath - Path to original STL file
   * @param {string} outputPath - Path for compressed file (without extension)
   * @returns {Promise<{compressedPath: string, originalSize: number, compressedSize: number, compressionRatio: number}>}
   */
  async compressSTL(inputPath, outputPath) {
    try {
      const originalStats = fs.statSync(inputPath);
      const originalSize = originalStats.size;
      
      const compressedPath = `${outputPath}.xz`;
      
      // Read original file
      const inputData = fs.readFileSync(inputPath);
      
      // Compress with LZMA2
      const compressedData = await new Promise((resolve, reject) => {
        lzma.compress(inputData, {
          preset: this.compressionPreset,
          check: lzma.CHECK_CRC64
        }, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      
      // Write compressed file
      fs.writeFileSync(compressedPath, compressedData);
      
      const compressedSize = fs.statSync(compressedPath).size;
      const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      
      console.log(`✅ STL compressed: ${path.basename(inputPath)}`);
      console.log(`   Original: ${this.formatFileSize(originalSize)}`);
      console.log(`   Compressed: ${this.formatFileSize(compressedSize)}`);
      console.log(`   Saved: ${compressionRatio}%`);
      
      return {
        compressedPath,
        originalSize,
        compressedSize,
        compressionRatio: parseFloat(compressionRatio)
      };
      
    } catch (error) {
      console.error('❌ Compression failed:', error);
      throw error;
    }
  }

  /**
   * Decompress STL file using LZMA2
   * @param {string} compressedPath - Path to compressed file
   * @param {string} outputPath - Path for decompressed file
   * @returns {Promise<string>} - Path to decompressed file
   */
  async decompressSTL(compressedPath, outputPath) {
    try {
      // Read compressed file
      const compressedData = fs.readFileSync(compressedPath);
      
      // Decompress with LZMA2
      const decompressedData = await new Promise((resolve, reject) => {
        lzma.decompress(compressedData, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      
      // Write decompressed file
      fs.writeFileSync(outputPath, decompressedData);
      
      console.log(`✅ STL decompressed: ${path.basename(outputPath)}`);
      
      return outputPath;
      
    } catch (error) {
      console.error('❌ Decompression failed:', error);
      throw error;
    }
  }

  /**
   * Create compressed archive with multiple STL files
   * @param {Array<string>} stlPaths - Array of STL file paths
   * @param {string} archivePath - Output archive path
   * @returns {Promise<{archivePath: string, originalSize: number, compressedSize: number, compressionRatio: number}>}
   */
  async createCompressedArchive(stlPaths, archivePath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(archivePath);
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Maximum compression for ZIP container
        forceLocalTime: true
      });

      let originalSize = 0;

      output.on('close', () => {
        const compressedSize = archive.pointer();
        const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
        
        console.log(`✅ Archive created: ${path.basename(archivePath)}`);
        console.log(`   Original: ${this.formatFileSize(originalSize)}`);
        console.log(`   Compressed: ${this.formatFileSize(compressedSize)}`);
        console.log(`   Saved: ${compressionRatio}%`);
        
        resolve({
          archivePath,
          originalSize,
          compressedSize,
          compressionRatio: parseFloat(compressionRatio)
        });
      });

      archive.on('error', reject);
      archive.pipe(output);

      // Add each STL file to archive with LZMA2 compression
      stlPaths.forEach(stlPath => {
        if (fs.existsSync(stlPath)) {
          const stats = fs.statSync(stlPath);
          originalSize += stats.size;
          
          // Add file with individual LZMA2 compression
          archive.file(stlPath, { 
            name: path.basename(stlPath),
            store: false // Enable compression
          });
        }
      });

      archive.finalize();
    });
  }

  /**
   * Extract compressed archive
   * @param {string} archivePath - Path to compressed archive
   * @param {string} extractPath - Directory to extract to
   * @returns {Promise<Array<string>>} - Array of extracted file paths
   */
  async extractArchive(archivePath, extractPath) {
    return new Promise((resolve, reject) => {
      const extractedFiles = [];
      
      yauzl.open(archivePath, { lazyEntries: true }, (err, zipfile) => {
        if (err) return reject(err);
        
        zipfile.readEntry();
        
        zipfile.on('entry', (entry) => {
          if (/\/$/.test(entry.fileName)) {
            // Directory entry
            zipfile.readEntry();
          } else {
            // File entry
            const outputPath = path.join(extractPath, entry.fileName);
            
            // Ensure directory exists
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            
            zipfile.openReadStream(entry, (err, readStream) => {
              if (err) return reject(err);
              
              const writeStream = fs.createWriteStream(outputPath);
              readStream.pipe(writeStream);
              
              writeStream.on('close', () => {
                extractedFiles.push(outputPath);
                zipfile.readEntry();
              });
            });
          }
        });
        
        zipfile.on('end', () => {
          console.log(`✅ Archive extracted: ${extractedFiles.length} files`);
          resolve(extractedFiles);
        });
      });
    });
  }

  /**
   * Get compression info for a file
   * @param {string} filePath - Path to file
   * @returns {Object} - File information
   */
  getFileInfo(filePath) {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const stats = fs.statSync(filePath);
    const isCompressed = filePath.endsWith('.xz') || filePath.endsWith('.zip');
    
    return {
      path: filePath,
      size: stats.size,
      formattedSize: this.formatFileSize(stats.size),
      isCompressed,
      lastModified: stats.mtime
    };
  }

  /**
   * Format file size in human readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} - Formatted size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * Clean up temporary files
   * @param {Array<string>} filePaths - Array of file paths to delete
   */
  cleanupFiles(filePaths) {
    filePaths.forEach(filePath => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          console.log(`🗑️ Cleaned up: ${path.basename(filePath)}`);
        }
      } catch (error) {
        console.error(`❌ Failed to cleanup ${filePath}:`, error.message);
      }
    });
  }
}

module.exports = new CompressionService();