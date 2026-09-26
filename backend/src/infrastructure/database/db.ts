import fs from 'fs';
import path from 'path';
import { User } from '../../domain/models/User.js';
import { Problem } from '../../domain/models/Problem.js';
import { Attempt } from '../../domain/models/Attempt.js';
import { Submission } from '../../domain/models/Submission.js';
import { Evaluation } from '../../domain/models/Evaluation.js';
import {
  SEED_USERS,
  SEED_PROBLEMS,
  SEED_ATTEMPTS,
  SEED_SUBMISSIONS,
  SEED_EVALUATIONS,
} from './seedData.js';

export interface DatabaseSchema {
  users: User[];
  problems: Problem[];
  attempts: Attempt[];
  submissions: Submission[];
  evaluations: Evaluation[];
}

export class MemoryMongoCollection<T extends { id: string }> {
  constructor(private getItems: () => T[], private saveItems: (items: T[]) => void) {}

  public async find(filter?: Partial<T> | ((item: T) => boolean)): Promise<T[]> {
    const items = this.getItems();
    if (!filter) return [...items];
    if (typeof filter === 'function') {
      return items.filter(filter);
    }
    return items.filter(item => {
      for (const [key, val] of Object.entries(filter)) {
        if ((item as any)[key] !== val) return false;
      }
      return true;
    });
  }

  public async findOne(filter: Partial<T> | ((item: T) => boolean)): Promise<T | null> {
    const results = await this.find(filter);
    return results[0] || null;
  }

  public async findById(id: string): Promise<T | null> {
    return this.findOne({ id } as any);
  }

  public async insertOne(doc: T): Promise<T> {
    const items = this.getItems();
    const existingIndex = items.findIndex(i => i.id === doc.id);
    if (existingIndex >= 0) {
      items[existingIndex] = { ...doc };
    } else {
      items.push({ ...doc });
    }
    this.saveItems(items);
    return doc;
  }

  public async updateOne(filter: Partial<T> | ((item: T) => boolean), update: Partial<T>): Promise<T | null> {
    const items = this.getItems();
    const index = typeof filter === 'function'
      ? items.findIndex(filter)
      : items.findIndex(item => {
          for (const [key, val] of Object.entries(filter)) {
            if ((item as any)[key] !== val) return false;
          }
          return true;
        });

    if (index === -1) return null;

    items[index] = { ...items[index], ...update };
    this.saveItems(items);
    return items[index];
  }

  public async deleteOne(filter: Partial<T> | ((item: T) => boolean)): Promise<boolean> {
    const items = this.getItems();
    const initialLen = items.length;
    const remaining = typeof filter === 'function'
      ? items.filter(i => !filter(i))
      : items.filter(item => {
          for (const [key, val] of Object.entries(filter)) {
            if ((item as any)[key] === val) return false;
          }
          return true;
        });

    if (remaining.length !== initialLen) {
      this.saveItems(remaining);
      return true;
    }
    return false;
  }

  public async count(filter?: Partial<T>): Promise<number> {
    const items = await this.find(filter);
    return items.length;
  }
}

export class Database {
  private static instance: Database;
  private data: DatabaseSchema;
  private storageFilePath: string;

  private constructor() {
    this.storageFilePath = path.resolve(process.cwd(), '.lld_mentor_db.json');
    this.data = this.loadData();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(this.storageFilePath)) {
        const fileRaw = fs.readFileSync(this.storageFilePath, 'utf-8');
        const parsed = JSON.parse(fileRaw);
        if (parsed.problems && parsed.attempts) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('[Database] Initializing fresh database storage.');
    }

    const initialData: DatabaseSchema = {
      users: [...SEED_USERS],
      problems: [...SEED_PROBLEMS],
      attempts: [...SEED_ATTEMPTS],
      submissions: [...SEED_SUBMISSIONS],
      evaluations: [...SEED_EVALUATIONS],
    };
    this.persist(initialData);
    return initialData;
  }

  private persist(data: DatabaseSchema): void {
    try {
      fs.writeFileSync(this.storageFilePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      // In constrained environments where disk is read-only, keep in memory
    }
  }

  public resetToSeeds(): void {
    this.data = {
      users: [...SEED_USERS],
      problems: [...SEED_PROBLEMS],
      attempts: [...SEED_ATTEMPTS],
      submissions: [...SEED_SUBMISSIONS],
      evaluations: [...SEED_EVALUATIONS],
    };
    this.persist(this.data);
  }

  public get users(): MemoryMongoCollection<User> {
    return new MemoryMongoCollection<User>(
      () => this.data.users,
      items => {
        this.data.users = items;
        this.persist(this.data);
      }
    );
  }

  public get problems(): MemoryMongoCollection<Problem> {
    return new MemoryMongoCollection<Problem>(
      () => this.data.problems,
      items => {
        this.data.problems = items;
        this.persist(this.data);
      }
    );
  }

  public get attempts(): MemoryMongoCollection<Attempt> {
    return new MemoryMongoCollection<Attempt>(
      () => this.data.attempts,
      items => {
        this.data.attempts = items;
        this.persist(this.data);
      }
    );
  }

  public get submissions(): MemoryMongoCollection<Submission> {
    return new MemoryMongoCollection<Submission>(
      () => this.data.submissions,
      items => {
        this.data.submissions = items;
        this.persist(this.data);
      }
    );
  }

  public get evaluations(): MemoryMongoCollection<Evaluation> {
    return new MemoryMongoCollection<Evaluation>(
      () => this.data.evaluations,
      items => {
        this.data.evaluations = items;
        this.persist(this.data);
      }
    );
  }
}
