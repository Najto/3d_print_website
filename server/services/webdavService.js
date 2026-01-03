const { createClient } = require('webdav');
const path = require('path');
const https = require('https');

class WebDAVService {
  constructor() {
    this.client = null;
    this.config = {
      url: process.env.WEBDAV_URL || 'https://localhost:6008',
      username: process.env.WEBDAV_USER || 'anonymous',
      password: process.env.WEBDAV_PASSWORD || '',
      basePath: process.env.WEBDAV_BASE_PATH || '/disk1_part1/3d'
    };
  }

  getClient() {
    if (this.client) {
      return this.client;
    }

    const httpsAgent = new https.Agent({
      rejectUnauthorized: false
    });

    this.client = createClient(this.config.url, {
      username: this.config.username,
      password: this.config.password,
      httpsAgent: httpsAgent
    });

    console.log(`✅ WebDAV client created for ${this.config.url}`);
    return this.client;
  }

  async connect() {
    try {
      const client = this.getClient();
      const exists = await client.exists(this.config.basePath);

      if (exists) {
        console.log(`✅ WebDAV connected to ${this.config.url}${this.config.basePath}`);
        return client;
      } else {
        throw new Error(`Base path ${this.config.basePath} does not exist`);
      }
    } catch (error) {
      console.error('❌ WebDAV connection failed:', error.message);
      throw new Error(`WebDAV Verbindung fehlgeschlagen: ${error.message}`);
    }
  }

  async disconnect() {
    console.log('📴 WebDAV disconnected');
  }

  async ensureConnection() {
    return this.getClient();
  }

  async ensureDirectory(remotePath) {
    const client = this.getClient();
    const fullRemotePath = path.posix.join(this.config.basePath, remotePath);

    try {
      const exists = await client.exists(fullRemotePath);
      if (!exists) {
        await client.createDirectory(fullRemotePath, { recursive: true });
        console.log(`📁 Created directory: ${fullRemotePath}`);
      }
      return true;
    } catch (error) {
      console.error(`Error creating directory ${fullRemotePath}:`, error);
      throw error;
    }
  }

  async uploadFile(localBuffer, remotePath, fileName) {
    const client = this.getClient();
    const fullRemotePath = path.posix.join(this.config.basePath, remotePath, fileName);
    const remoteDir = path.posix.dirname(fullRemotePath);

    try {
      await this.ensureDirectory(remotePath);

      await client.putFileContents(fullRemotePath, localBuffer, {
        overwrite: true
      });

      console.log(`✅ Uploaded: ${fullRemotePath}`);
      return fullRemotePath;
    } catch (error) {
      console.error(`❌ Upload failed for ${fullRemotePath}:`, error.message);
      throw new Error(`Upload fehlgeschlagen: ${error.message}`);
    }
  }

  async downloadFile(remotePath) {
    const client = this.getClient();
    const fullRemotePath = path.posix.join(this.config.basePath, remotePath);

    try {
      const buffer = await client.getFileContents(fullRemotePath);
      console.log(`✅ Downloaded: ${fullRemotePath} (${buffer.length} bytes)`);
      return buffer;
    } catch (error) {
      console.error(`❌ Download failed for ${fullRemotePath}:`, error.message);
      throw new Error(`Download fehlgeschlagen: ${error.message}`);
    }
  }

  async deleteFile(remotePath) {
    const client = this.getClient();
    const fullRemotePath = path.posix.join(this.config.basePath, remotePath);

    try {
      await client.deleteFile(fullRemotePath);
      console.log(`✅ Deleted: ${fullRemotePath}`);
      return true;
    } catch (error) {
      console.error(`❌ Delete failed for ${fullRemotePath}:`, error.message);
      throw new Error(`Löschen fehlgeschlagen: ${error.message}`);
    }
  }

  async listFiles(remotePath) {
    const client = this.getClient();
    const fullRemotePath = path.posix.join(this.config.basePath, remotePath);

    try {
      const exists = await client.exists(fullRemotePath);
      if (!exists) {
        return [];
      }

      const contents = await client.getDirectoryContents(fullRemotePath);
      return contents.map(item => ({
        name: path.basename(item.filename),
        size: item.size || 0,
        isDirectory: item.type === 'directory',
        modifiedAt: item.lastmod ? new Date(item.lastmod) : new Date()
      }));
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return [];
      }
      console.error(`❌ List failed for ${fullRemotePath}:`, error.message);
      throw new Error(`Dateiliste abrufen fehlgeschlagen: ${error.message}`);
    }
  }

  async directoryExists(remotePath) {
    const client = this.getClient();
    const fullRemotePath = path.posix.join(this.config.basePath, remotePath);

    try {
      const exists = await client.exists(fullRemotePath);
      if (!exists) return false;

      const stat = await client.stat(fullRemotePath);
      return stat.type === 'directory';
    } catch (error) {
      return false;
    }
  }

  async deleteDirectory(remotePath) {
    const client = this.getClient();
    const fullRemotePath = path.posix.join(this.config.basePath, remotePath);

    try {
      await client.deleteFile(fullRemotePath);
      console.log(`✅ Deleted directory: ${fullRemotePath}`);
      return true;
    } catch (error) {
      console.error(`❌ Delete directory failed for ${fullRemotePath}:`, error.message);
      throw new Error(`Ordner löschen fehlgeschlagen: ${error.message}`);
    }
  }

  async getFileSize(remotePath) {
    const client = this.getClient();
    const fullRemotePath = path.posix.join(this.config.basePath, remotePath);

    try {
      const stat = await client.stat(fullRemotePath);
      return stat.size || 0;
    } catch (error) {
      console.error(`❌ Get file size failed for ${fullRemotePath}:`, error.message);
      return 0;
    }
  }

  async checkHealth() {
    try {
      await this.connect();
      const baseDirExists = await this.directoryExists('');
      return {
        status: 'OK',
        connected: true,
        host: this.config.url,
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

const webdavService = new WebDAVService();

process.on('exit', () => {
  webdavService.disconnect();
});

module.exports = { webdavService };
