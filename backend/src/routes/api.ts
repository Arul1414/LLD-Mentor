import express, { Request, Response, Router } from 'express';
import { ProblemService } from '../application/services/ProblemService.js';
import { PracticeService } from '../application/services/PracticeService.js';
import { EvaluationService } from '../application/services/EvaluationService.js';
import { Database } from '../infrastructure/database/db.js';

export function createApiRouter(): Router {
  const router = express.Router();
  const problemService = new ProblemService();
  const practiceService = new PracticeService();
  const evaluationService = new EvaluationService();

  // GET /api/problems
  router.get('/problems', async (_req: Request, res: Response) => {
    try {
      const problems = await problemService.getAllProblems();
      res.json({ success: true, data: problems });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/problems/:id
  router.get('/problems/:id', async (req: Request, res: Response) => {
    try {
      const problem = await problemService.getProblemById(req.params.id);
      if (!problem) {
        return res.status(404).json({ success: false, error: `Problem "${req.params.id}" not found` });
      }
      res.json({ success: true, data: problem });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/attempts
  router.post('/attempts', async (req: Request, res: Response) => {
    try {
      const { problemId, userId, forceNew } = req.body;
      if (!problemId) {
        return res.status(400).json({ success: false, error: 'problemId is required' });
      }
      const result = await practiceService.startAttempt(problemId, userId, Boolean(forceNew));
      res.status(201).json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // GET /api/problems/:id/attempts
  router.get('/problems/:id/attempts', async (req: Request, res: Response) => {
    try {
      const userId = (req.query.userId as string) || 'user_default';
      const attempts = await practiceService.getAttemptsByProblem(req.params.id, userId);
      res.json({ success: true, data: attempts });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/attempts/:id
  router.get('/attempts/:id', async (req: Request, res: Response) => {
    try {
      const result = await practiceService.getAttempt(req.params.id);
      if (!result) {
        return res.status(404).json({ success: false, error: `Attempt "${req.params.id}" not found` });
      }
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/submissions
  router.post('/submissions', async (req: Request, res: Response) => {
    try {
      const { attemptId, problemId, classes, relationships, explanation, optionalCode, status } = req.body;
      if (!attemptId || !problemId) {
        return res.status(400).json({ success: false, error: 'attemptId and problemId are required' });
      }

      const result = await practiceService.saveSubmission({
        attemptId,
        problemId,
        classes: classes || [],
        relationships: relationships || [],
        explanation: explanation || '',
        optionalCode: optionalCode || '',
        status: status || 'DRAFT',
      });

      res.json({
        success: true,
        data: result.submission,
        validation: result.validation,
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  });

  // POST /api/submissions/:id/evaluate
  router.post('/submissions/:id/evaluate', async (req: Request, res: Response) => {
    try {
      const { evaluatorStrategy, isStrict } = req.body || {};
      const result = await evaluationService.evaluateSubmission(req.params.id, {
        evaluatorStrategy,
        isStrict: isStrict ?? true,
      });
      res.json({ success: true, data: result.evaluation });
    } catch (err: any) {
      const validationErrors = (err as any).validationErrors;
      if (validationErrors) {
        return res.status(422).json({
          success: false,
          error: err.message,
          validationErrors,
        });
      }
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/evaluations/:submissionId/re-evaluate
  router.post('/evaluations/:submissionId/re-evaluate', async (req: Request, res: Response) => {
    try {
      const { evaluatorStrategy, isStrict } = req.body || {};
      const result = await evaluationService.evaluateSubmission(req.params.submissionId, {
        evaluatorStrategy,
        isStrict: isStrict ?? true,
      });
      res.json({ success: true, data: result.evaluation });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/evaluations/:submissionId
  router.get('/evaluations/:submissionId', async (req: Request, res: Response) => {
    try {
      const evaluation = await evaluationService.getEvaluationBySubmission(req.params.id || req.params.submissionId);
      if (!evaluation) {
        return res.status(404).json({ success: false, error: 'Evaluation not found for this submission' });
      }
      res.json({ success: true, data: evaluation });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/evaluations/attempt/:attemptId
  router.get('/evaluations/attempt/:attemptId', async (req: Request, res: Response) => {
    try {
      const evaluation = await evaluationService.getEvaluationByAttempt(req.params.attemptId);
      if (!evaluation) {
        return res.status(404).json({ success: false, error: 'Evaluation not found for this attempt' });
      }
      res.json({ success: true, data: evaluation });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // GET /api/history
  router.get('/history', async (req: Request, res: Response) => {
    try {
      const userId = (req.query.userId as string) || 'user_default';
      const history = await practiceService.getHistory(userId);
      res.json({ success: true, data: history });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // POST /api/seed/reset
  router.post('/seed/reset', async (_req: Request, res: Response) => {
    try {
      Database.getInstance().resetToSeeds();
      res.json({ success: true, message: 'Database reset to default seed data successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  return router;
}
