const { Client } = require('basic-ftp');
const path = require('path');

class FTPService {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.config = {
      host: process.env.FTP_HOST || 'localhost',
      port: parseInt(process.env.FTP_PORT || '21'),
      user: process.env.FTP_USER || 'anonymous',
      password: process.env.FTP_PASSWORD || '',
      secure: process.env.FTP_SECURE === 'true',
      basePath: process.env.FTP_BASE_PATH || '/files'
    };
  }

  async connect() {
    if (this.isConnected && this.client) {
      return this.client;
    }

    try {
      this.client = new Client();
      this.client.ftp.verbose = process.env.NODE_ENV === 'development';

      await this.client.access({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        secure: this.config.secure
      });

      this.isConnected = true;
      console.log(`✅ FTP connected to ${this.config.host}:${this.config.port}`);
      return this.client;
    } catch (error) {
      this.isConnected = false;
      console.error('❌ FTP connection failed:', error.message);
      throw new Error(`FTP Verbindung fehlgeschlagen: ${error.message}`);
    }
  }

  async disconnect() {
    if (this.client) {
      try {
        this.client.close();
        this.isConnected = false;
        console.log('📴 FTP disconnected');
      } catch (error) {
        console.error('Error disconnecting FTP:', error);
      }
    }
  }

  async ensureConnection() {
    if (!this.isConnected) {
      await this.connect();
    }
    return this.client;
  }

  async ensureDirectory(remotePath) {
    const client = await this.ensureConnection();
    try {
      await client.ensureDir(remotePath);
      return true;
    } catch (error) {
      console.error(`Error creating directory ${remotePath}:`, error);
      throw error;
    }
  }

  async uploadFile(localBuffer, remotePath, fileName) {
    const client = await this.ensureConnection();
    const fullRemotePath = path.posix.join(this.config.basePath, remotePath, fileName);
    const remoteDir = path.posix.dirname(fullRemotePath);

    try {
      await this.ensureDirectory(remoteDir);

      const { Readable } = require('stream');
      const stream = Readable.from(localBuffer);

      await client.uploadFrom(stream, fullRemotePath);
      console.log(`✅ Uploaded: ${fullRemotePath}`);
      return fullRemotePath;
    } catch (error) {
      console.error(`❌ Upload failed for ${fullRemotePath}:`, error.message);
      throw new Error(`Upload fehlgeschlagen: ${error.message}`);
    }
  }

  async downloadFile(remotePath) {
    const client = await this.ensureConnection();
    const fullRemotePath = path.posix.join(this.config.basePath, remotePath);

    try {
      const { Writable } = require('stream');
      const chunks = [];

      const writableStream = new Writable({
        write(chunk, encoding, callback) {
          chunks.push(chunk);
          callback();
        }
      });

      await client.downloadTo(writableStream, fullRemotePath);
      const buffer = Buffer.concat(chunks);
      console.log(`✅ Downloaded: ${fullRemotePath} (${buffer.length} bytes)`);
      return buffer;
    } catch (error) {
      console.error(`❌ Download failed for ${fullRemotePath}:`, error.message);
      throw new Error(`Download fehlgeschlagen: ${error.message}`);
    }
  }

  async deleteFile(remotePath) {
    const client = await this.ensureConnection();
    const fullRemotePath = path.posix.join(this.config.basePath, remotePath);

    try {
      await client.remove(fullRemotePath);
      console.log(`✅ Deleted: ${fullRemotePath}`);
      return true;
    } catch (error) {
      console.error(`❌ Delete failed for ${fullRemotePath}:`, error.message);
      throw new Error(`Löschen fehlgeschlagen: ${error.message}`);
    }
  }

  async listFiles(remotePath) {
    const client = await this.ensureConnection();
    const fullRemotePath = path.posix.join(this.config.basePath, remotePath);

    try {
      const files = await client.list(fullRemotePath);
      return files.map(file => ({
        name: file.name,
        size: file.size,
        isDirectory: file.isDirectory,
        modifiedAt: file.modifiedAt
      }));
    } catch (error) {
      if (error.code === 550) {
        return [];
      }
      console.error(`❌ List failed for ${fullRemotePath}:`, error.message);
      throw new Error(`Dateiliste abrufen fehlgeschlagen: ${error.message}`);
    }
  }

  async directoryExists(remotePath) {
    const client = await this.ensureConnection();
    const fullRemotePath = path.posix.join(this.config.basePath, remotePath);

    try {
      await client.list(fullRemotePath);
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteDirectory(remotePath) {
    const client = await this.ensureConnection();
    const fullRemotePath = path.posix.join(this.config.basePath, remotePath);

    try {
      await client.removeDir(fullRemotePath);
      console.log(`✅ Deleted directory: ${fullRemotePath}`);
      return true;
    } catch (error) {
      console.error(`❌ Delete directory failed for ${fullRemotePath}:`, error.message);
      throw new Error(`Ordner löschen fehlgeschlagen: ${error.message}`);
    }
  }

  async getFileSize(remotePath) {
    const client = await this.ensureConnection();
    const fullRemotePath = path.posix.join(this.config.basePath, remotePath);

    try {
      const fileInfo = await client.size(fullRemotePath);
      return fileInfo;
    } catch (error) {
      console.error(`❌ Get file size failed for ${fullRemotePath}:`, error.message);
      return 0;
    }
  }

  async checkHealth() {
    try {
      await this.connect();
      const baseDirExists = await this.directoryExists('');
      await this.disconnect();
      return {
        status: 'OK',
        connected: true,
        host: this.config.host,
        basePath: this.config.basePath,
        baseDirExists
      };
    } catch (error) {
      return {
        status: 'ERROR',
        connected: false,
        error: error.message
      };
    }
  }
}

const ftpService = new FTPService();

process.on('exit', () => {
  ftpService.disconnect();
});

module.exports = { ftpService };
