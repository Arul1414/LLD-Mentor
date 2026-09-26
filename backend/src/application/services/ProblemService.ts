import { ProblemRepository, IProblemRepository } from '../../infrastructure/repositories/ProblemRepository.js';
import { Problem } from '../../domain/models/Problem.js';

export class ProblemService {
  constructor(private problemRepo: IProblemRepository = new ProblemRepository()) {}

  public async getAllProblems(): Promise<Problem[]> {
    return this.problemRepo.findAll();
  }

  public async getProblemById(idOrSlug: string): Promise<Problem | null> {
    return this.problemRepo.findById(idOrSlug);
  }
}
