import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { get, put } from '@vercel/blob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use Vercel Blob when configured for durable production storage.
// Fall back to local JSON files for development.
const isProduction = process.env.NODE_ENV === 'production';
const blobAccess = process.env.BLOB_ACCESS === 'public' ? 'public' : 'private';
const useBlobStorage = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const BLOB_PREFIX = 'portfolio-data';
const DATA_DIR = isProduction ? '/tmp/portfolio-data' : path.join(process.cwd(), '.data');

if (!useBlobStorage && !fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JSONStorage {
  constructor(filename) {
    this.filename = filename;
    this.filepath = path.join(DATA_DIR, `${filename}.json`);
    this.blobPath = `${BLOB_PREFIX}/${filename}.json`;
  }

  async ensureFile() {
    if (useBlobStorage) {
      const existing = await get(this.blobPath, { access: blobAccess });
      if (!existing) {
        await put(this.blobPath, JSON.stringify([], null, 2), {
          access: blobAccess,
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: 'application/json',
          cacheControlMaxAge: 0,
        });
      }
      return;
    }

    if (!fs.existsSync(this.filepath)) {
      fs.writeFileSync(this.filepath, JSON.stringify([], null, 2));
    }
  }

  async read() {
    try {
      await this.ensureFile();

      if (useBlobStorage) {
        const result = await get(this.blobPath, { access: blobAccess });
        if (!result || result.statusCode !== 200 || !result.stream) {
          return [];
        }

        const data = await new Response(result.stream).text();
        return JSON.parse(data);
      }

      const data = fs.readFileSync(this.filepath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${useBlobStorage ? this.blobPath : this.filepath}:`, error);
      return [];
    }
  }

  async write(data) {
    try {
      if (useBlobStorage) {
        await put(this.blobPath, JSON.stringify(data, null, 2), {
          access: blobAccess,
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: 'application/json',
          cacheControlMaxAge: 0,
        });
        return true;
      }

      fs.writeFileSync(this.filepath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${useBlobStorage ? this.blobPath : this.filepath}:`, error);
      return false;
    }
  }

  // Basic CRUD operations
  async findAll() {
    return this.read();
  }

  async findById(id) {
    const items = await this.read();
    return items.find(item => item._id === id) || null;
  }

  async findOne(query) {
    const items = await this.read();
    return items.find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    }) || null;
  }

  async findMany(query) {
    const items = await this.read();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  async create(data) {
    const items = await this.read();
    const newItem = {
      _id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    await this.write(items);
    return newItem;
  }

  async updateById(id, updateData) {
    const items = await this.read();
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return null;
    
    const updated = {
      ...items[index],
      ...updateData,
      _id: items[index]._id, // Don't change ID
      createdAt: items[index].createdAt, // Don't change creation date
      updatedAt: new Date().toISOString(),
    };
    items[index] = updated;
    await this.write(items);
    return updated;
  }

  async deleteById(id) {
    const items = await this.read();
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return false;
    
    items.splice(index, 1);
    await this.write(items);
    return true;
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  sort(items, field, order = 1) {
    return items.sort((a, b) => {
      if (a[field] < b[field]) return -order;
      if (a[field] > b[field]) return order;
      return 0;
    });
  }
}

// Export storage instances for each data type
export const usersStorage = new JSONStorage('users');
export const skillsStorage = new JSONStorage('skills');
export const projectsStorage = new JSONStorage('projects');
export const experiencesStorage = new JSONStorage('experiences');
export const achievementsStorage = new JSONStorage('achievements');
export const contactStorage = new JSONStorage('contact');
export const portFolioStorage = new JSONStorage('portfolio');
export const caseStudiesStorage = new JSONStorage('case-studies');

export default JSONStorage;
