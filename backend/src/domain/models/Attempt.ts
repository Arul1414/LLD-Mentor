export type AttemptStatus =
  | 'IN_PROGRESS'
  | 'SUBMITTED'
  | 'EVALUATING'
  | 'COMPLETED'
  | 'FAILED'
  | 'ABANDONED';

export interface Attempt {
  id: string;
  attemptId: string;
  userId: string;
  problemId: string;
  submissionId?: string;
  attemptNumber: number;
  status: AttemptStatus;
  score?: number;
  createdAt: string;
  completedAt?: string;
}
