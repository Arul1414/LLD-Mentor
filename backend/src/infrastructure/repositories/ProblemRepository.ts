import { Database } from '../database/db.js';
import { Problem } from '../../domain/models/Problem.js';

export interface IProblemRepository {
  findAll(): Promise<Problem[]>;
  findById(id: string): Promise<Problem | null>;
  findBySlug(slug: string): Promise<Problem | null>;
}

export class ProblemRepository implements IProblemRepository {
  private db = Database.getInstance();

  public async findAll(): Promise<Problem[]> {
    return this.db.problems.find();
  }

  public async findById(id: string): Promise<Problem | null> {
    return this.db.problems.findOne((p: Problem) => p.id === id || p.slug === id);
  }

  public async findBySlug(slug: string): Promise<Problem | null> {
    return this.db.problems.findOne({ slug });
  }
}
