export interface User {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: 'LEARNER' | 'MENTOR' | 'EVALUATOR';
  createdAt: string;
}
