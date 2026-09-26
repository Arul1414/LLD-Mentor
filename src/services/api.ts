import {
  Problem,
  Attempt,
  Submission,
  Evaluation,
  HistoryItem,
} from '../types/index.js';

export async function fetchProblems(): Promise<Problem[]> {
  const res = await fetch('/api/problems');
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch problems');
  return json.data;
}

export async function fetchProblem(idOrSlug: string): Promise<Problem> {
  const res = await fetch(`/api/problems/${idOrSlug}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Problem not found');
  return json.data;
}

export async function createAttempt(
  problemId: string,
  userId: string = 'user_default',
  forceNew: boolean = false
): Promise<{ attempt: Attempt; submission: Submission; resumed?: boolean }> {
  const res = await fetch('/api/attempts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problemId, userId, forceNew }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to create attempt');
  return json.data;
}

export async function fetchProblemAttempts(problemId: string, userId: string = 'user_default'): Promise<Attempt[]> {
  const res = await fetch(`/api/problems/${problemId}/attempts?userId=${encodeURIComponent(userId)}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch problem attempts');
  return json.data;
}

export async function fetchAttempt(attemptId: string): Promise<{ attempt: Attempt; submission: Submission | null; problem: Problem }> {
  const res = await fetch(`/api/attempts/${attemptId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch attempt');
  return json.data;
}

export async function saveSubmission(payload: {
  attemptId: string;
  problemId: string;
  classes: any[];
  relationships: any[];
  explanation: string;
  optionalCode?: string;
  status?: 'DRAFT' | 'SUBMITTED';
}): Promise<{ submission: Submission; validation: { isValid: boolean; errors: string[] } }> {
  const res = await fetch('/api/submissions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to save submission');
  return { submission: json.data, validation: json.validation };
}

export async function evaluateSubmission(
  submissionId: string,
  evaluatorStrategy: 'AI' | 'RULE_BASED' | 'AUTO' = 'AUTO',
  isStrict: boolean = true
): Promise<Evaluation> {
  const res = await fetch(`/api/submissions/${submissionId}/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evaluatorStrategy, isStrict }),
  });
  const json = await res.json();
  if (!json.success) {
    const error: any = new Error(json.error || 'Evaluation failed');
    if (json.validationErrors) {
      error.validationErrors = json.validationErrors;
    }
    throw error;
  }
  return json.data;
}

export async function reEvaluateSubmission(
  submissionId: string,
  isStrict: boolean = true
): Promise<Evaluation> {
  const res = await fetch(`/api/evaluations/${submissionId}/re-evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isStrict }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Re-evaluation failed');
  return json.data;
}

export async function fetchEvaluation(submissionId: string): Promise<Evaluation> {
  const res = await fetch(`/api/evaluations/${submissionId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Evaluation not found');
  return json.data;
}

export async function fetchEvaluationByAttempt(attemptId: string): Promise<Evaluation> {
  const res = await fetch(`/api/evaluations/attempt/${attemptId}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Evaluation not found');
  return json.data;
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const res = await fetch('/api/history');
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to fetch history');
  return json.data;
}

export async function resetDatabaseSeeds(): Promise<void> {
  const res = await fetch('/api/seed/reset', { method: 'POST' });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Failed to reset seeds');
}
