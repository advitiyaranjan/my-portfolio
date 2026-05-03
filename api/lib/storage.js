import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use /tmp for Vercel serverless (ephemeral storage)
// but also support local ./data directory for development
const isProduction = process.env.NODE_ENV === 'production';
const DATA_DIR = isProduction ? '/tmp/portfolio-data' : path.join(process.cwd(), '.data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class JSONStorage {
  constructor(filename) {
    this.filepath = path.join(DATA_DIR, `${filename}.json`);
    this.ensureFile();
  }

  ensureFile() {
    if (!fs.existsSync(this.filepath)) {
      fs.writeFileSync(this.filepath, JSON.stringify([], null, 2));
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.filepath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${this.filepath}:`, error);
      return [];
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.filepath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${this.filepath}:`, error);
      return false;
    }
  }

  // Basic CRUD operations
  findAll() {
    return this.read();
  }

  findById(id) {
    const items = this.read();
    return items.find(item => item._id === id) || null;
  }

  findOne(query) {
    const items = this.read();
    return items.find(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    }) || null;
  }

  findMany(query) {
    const items = this.read();
    return items.filter(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });
  }

  create(data) {
    const items = this.read();
    const newItem = {
      _id: this.generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.push(newItem);
    this.write(items);
    return newItem;
  }

  updateById(id, updateData) {
    const items = this.read();
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
    this.write(items);
    return updated;
  }

  deleteById(id) {
    const items = this.read();
    const index = items.findIndex(item => item._id === id);
    if (index === -1) return false;
    
    items.splice(index, 1);
    this.write(items);
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
