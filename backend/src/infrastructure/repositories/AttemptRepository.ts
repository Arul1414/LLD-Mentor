import { Database } from '../database/db.js';
import { Attempt, AttemptStatus } from '../../domain/models/Attempt.js';

export interface IAttemptRepository {
  create(attempt: Attempt): Promise<Attempt>;
  findById(id: string): Promise<Attempt | null>;
  findByUser(userId: string): Promise<Attempt[]>;
  findByProblem(problemId: string, userId: string): Promise<Attempt[]>;
  update(id: string, updates: Partial<Attempt>): Promise<Attempt | null>;
  countByProblem(problemId: string, userId: string): Promise<number>;
}

export class AttemptRepository implements IAttemptRepository {
  private db = Database.getInstance();

  public async create(attempt: Attempt): Promise<Attempt> {
    return this.db.attempts.insertOne(attempt);
  }

  public async findById(id: string): Promise<Attempt | null> {
    return this.db.attempts.findOne((a: Attempt) => a.id === id || a.attemptId === id);
  }

  public async findByUser(userId: string): Promise<Attempt[]> {
    const list = await this.db.attempts.find((a: Attempt) => a.userId === userId);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async findByProblem(problemId: string, userId: string): Promise<Attempt[]> {
    const list = await this.db.attempts.find(
      (a: Attempt) => a.problemId === problemId && a.userId === userId
    );
    return list.sort((a, b) => a.attemptNumber - b.attemptNumber);
  }

  public async update(id: string, updates: Partial<Attempt>): Promise<Attempt | null> {
    return this.db.attempts.updateOne(
      (a: Attempt) => a.id === id || a.attemptId === id,
      updates
    );
  }

  public async countByProblem(problemId: string, userId: string): Promise<number> {
    const items = await this.findByProblem(problemId, userId);
    return items.length;
  }
}
