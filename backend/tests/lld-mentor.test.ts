import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { Database } from '../src/infrastructure/database/db.js';
import { ProblemService } from '../src/application/services/ProblemService.js';
import { PracticeService } from '../src/application/services/PracticeService.js';
import { EvaluationService } from '../src/application/services/EvaluationService.js';
import { SubmissionValidator } from '../src/domain/validators/SubmissionValidator.js';
import { RuleBasedEvaluator } from '../src/domain/evaluators/RuleBasedEvaluator.js';
import { Submission } from '../src/domain/models/Submission.js';
import { Problem } from '../src/domain/models/Problem.js';

describe('LLD Mentor Core Domain & Evaluation Tests', () => {
  let db: Database;
  let problemService: ProblemService;
  let practiceService: PracticeService;
  let evaluationService: EvaluationService;

  beforeEach(() => {
    db = Database.getInstance();
    db.resetToSeeds();
    problemService = new ProblemService();
    practiceService = new PracticeService();
    evaluationService = new EvaluationService();
  });

  // Test 1: Creating an attempt
  test('1. Creating an attempt successfully initializes Attempt and draft Submission', async () => {
    const problems = await problemService.getAllProblems();
    assert.ok(problems.length >= 3, 'Should have at least 3 MVP problems');

    const targetProblem = problems[0];
    const { attempt, submission } = await practiceService.startAttempt(targetProblem.id, 'test_user');

    assert.ok(attempt.id, 'Attempt should have an ID');
    assert.equal(attempt.problemId, targetProblem.id);
    assert.equal(attempt.status, 'IN_PROGRESS');
    assert.ok(submission.id, 'Submission draft should have an ID');
    assert.equal(submission.status, 'DRAFT');
    assert.equal(submission.attemptId, attempt.id);
  });

  // Test 2: Valid submission
  test('2. Valid submission is accepted with no validation errors', async () => {
    const problem = await problemService.getProblemById('prob_parking_lot');
    assert.ok(problem);

    const validSubmissionPayload = {
      attemptId: 'temp_att',
      problemId: problem!.id,
      classes: [
        {
          id: 'c1',
          name: 'ParkingLot',
          responsibility: 'Coordinates entry gates, exit gates, and parking spot availability across floors.',
          attributes: ['List<ParkingFloor> floors', 'ParkingStrategy strategy'],
          methods: ['ParkingSpot assignSpot(Vehicle v)', 'Ticket issueTicket(Vehicle v)'],
        },
        {
          id: 'c2',
          name: 'ParkingSpot',
          responsibility: 'Tracks individual spot occupancy, size tier, and assigned vehicle reference.',
          attributes: ['int spotNumber', 'SpotType type', 'boolean isOccupied'],
          methods: ['boolean isAvailable()', 'void occupy(Vehicle v)', 'void vacate()'],
        },
      ],
      relationships: [
        {
          id: 'r1',
          sourceClass: 'ParkingLot',
          targetClass: 'ParkingSpot',
          relationship: 'COMPOSITION',
          reason: 'ParkingLot aggregates and owns spots within floors',
        },
      ],
      explanation: 'We chose to separate the parking lot facade from individual spots to preserve single responsibility and make spot allocation thread-safe.',
    };

    const validation = SubmissionValidator.validate(validSubmissionPayload, problem);
    assert.equal(validation.isValid, true);
    assert.equal(validation.errors.length, 0);
  });

  // Test 3: Empty submission rejection
  test('3. Empty submission rejection by deterministic validator', async () => {
    const problem = await problemService.getProblemById('prob_parking_lot');

    const emptySubmission = {
      classes: [],
      explanation: '',
    };

    const validation = SubmissionValidator.validate(emptySubmission, problem);
    assert.equal(validation.isValid, false);
    assert.ok(
      validation.errors.some(e => e.includes('at least one class')),
      'Should reject submission with no classes'
    );
    assert.ok(
      validation.errors.some(e => e.includes('explanation')),
      'Should reject submission with no explanation'
    );
  });

  // Test 4: Submission status transition
  test('4. Submission status transitions: DRAFT -> SUBMITTED -> EVALUATING -> COMPLETED', async () => {
    const problem = (await problemService.getAllProblems())[0];
    const { attempt, submission } = await practiceService.startAttempt(problem.id, 'user_transition_test');

    assert.equal(submission.status, 'DRAFT');

    // Save as SUBMITTED
    const saved = await practiceService.saveSubmission({
      attemptId: attempt.id,
      problemId: problem.id,
      classes: [
        {
          id: 'c1',
          name: 'ElevatorController',
          responsibility: 'Schedules and coordinates multiple elevator cabins based on floor call requests.',
          attributes: ['List<ElevatorCar> cars'],
          methods: ['void handleHallCall(int floor, Direction dir)'],
        },
      ],
      relationships: [],
      explanation: 'Central scheduler encapsulates call distribution logic to prevent cabin starvation.',
      status: 'SUBMITTED',
    });

    assert.equal(saved.submission.status, 'SUBMITTED');

    // Evaluate submission
    const evalResult = await evaluationService.evaluateSubmission(saved.submission.id, {
      evaluatorStrategy: 'RULE_BASED',
    });

    assert.equal(evalResult.submissionStatus, 'COMPLETED');

    const finalAttempt = await practiceService.getAttempt(attempt.id);
    assert.equal(finalAttempt?.attempt.status, 'COMPLETED');
    assert.ok(typeof finalAttempt?.attempt.score === 'number');
  });

  // Test 5: RuleBasedEvaluator
  test('5. RuleBasedEvaluator evaluates against 8 rubric dimensions with evidence and suggestions', async () => {
    const problem = await problemService.getProblemById('prob_vending_machine');
    assert.ok(problem);

    const testSubmission: Submission = {
      id: 'sub_rule_test',
      submissionId: 'sub_rule_test',
      attemptId: 'att_rule_test',
      problemId: problem!.id,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      classes: [
        {
          id: 'c1',
          name: 'VendingMachine',
          responsibility: 'Acts as state coordinator and delegates user actions to the active machine state.',
          attributes: ['VendingState currentState', 'Inventory inventory', 'CoinBank bank'],
          methods: ['void insertCoin(Coin c)', 'void selectItem(String code)', 'void dispense()'],
        },
        {
          id: 'c2',
          name: 'VendingState',
          responsibility: 'Interface defining state behavior for Idle, HasMoney, Dispensing, and SoldOut.',
          attributes: [],
          methods: ['void insertMoney(int amount)', 'void chooseItem(String code)', 'void refund()'],
        },
      ],
      relationships: [
        {
          id: 'r1',
          sourceClass: 'VendingMachine',
          targetClass: 'VendingState',
          relationship: 'COMPOSITION',
          reason: 'Machine maintains current active state reference.',
        },
      ],
      explanation: 'We applied the State Pattern to prevent deeply nested if/else statements across coin insertion, cancellation, and dispensing flows.',
    };

    const evaluator = new RuleBasedEvaluator();
    const evaluation = await evaluator.evaluate(testSubmission, problem!);

    assert.ok(evaluation.overallScore > 0 && evaluation.overallScore <= 100);
    assert.equal(evaluation.criteria.length, 8, 'Must evaluate all 8 rubric criteria');

    for (const c of evaluation.criteria) {
      assert.ok(c.name, 'Criterion must have a name');
      assert.ok(c.score >= 1 && c.score <= 10, 'Criterion score must be 1-10');
      assert.ok(c.evidence && c.evidence.length > 5, 'Criterion must cite concrete evidence');
      assert.ok(c.suggestion && c.suggestion.length > 5, 'Criterion must offer actionable advice');
      assert.ok(c.confidence > 0 && c.confidence <= 1, 'Confidence must be between 0 and 1');
    }

    assert.ok(evaluation.strengths.length > 0, 'Must provide strengths');
    assert.ok(evaluation.priorityImprovements.length > 0, 'Must provide improvements');
  });

  // Test 6: Evaluation failure handling
  test('6. Evaluation failure handling preserves submission without data loss', async () => {
    const problem = (await problemService.getAllProblems())[0];
    const { attempt, submission } = await practiceService.startAttempt(problem.id, 'user_fail_test');

    // Save with missing class responsibility so deterministic validation fails
    await practiceService.saveSubmission({
      attemptId: attempt.id,
      problemId: problem.id,
      classes: [
        {
          id: 'c1',
          name: 'BrokenClass',
          responsibility: '', // Invalid empty responsibility
          attributes: [],
          methods: [],
        },
      ],
      relationships: [],
      explanation: 'Short',
      status: 'DRAFT',
    });

    try {
      await evaluationService.evaluateSubmission(submission.id, {
        evaluatorStrategy: 'RULE_BASED',
      });
      assert.fail('Should have thrown validation error');
    } catch (err: any) {
      assert.ok(err.message.includes('validation failed') || err.message.includes('responsibility'));
    }

    // Submission MUST NOT be lost!
    const retrieved = await db.submissions.findById(submission.id);
    assert.ok(retrieved, 'Submission must still exist in database');
    assert.equal(retrieved.classes[0].name, 'BrokenClass');
  });

  // Test 7: Attempt history
  test('7. Attempt history retrieves past attempts and demonstrates progression over repeated practice', async () => {
    const history = await practiceService.getHistory('user_default');
    assert.ok(Array.isArray(history));
    assert.ok(history.length >= 1, 'Should contain at least the seed demo attempt');

    const first = history[0];
    assert.ok(first.attemptId);
    assert.ok(first.problemTitle);
    assert.ok(typeof first.score === 'number');
  });

  // Test 8: Duplicate submission handling
  test('8. Duplicate submission handling detects identical submissions', () => {
    const subA: Partial<Submission> = {
      classes: [
        { id: '1', name: 'Car', responsibility: 'Represents vehicle', attributes: [], methods: [] },
      ],
      explanation: 'Exact explanation text',
    };

    const subB: Partial<Submission> = {
      classes: [
        { id: '2', name: 'Car', responsibility: 'Represents vehicle', attributes: [], methods: [] },
      ],
      explanation: 'Exact explanation text',
    };

    const subDifferent: Partial<Submission> = {
      classes: [
        { id: '3', name: 'Truck', responsibility: 'Represents large vehicle', attributes: [], methods: [] },
      ],
      explanation: 'Different explanation text',
    };

    assert.equal(SubmissionValidator.isDuplicate(subA, subB), true);
    assert.equal(SubmissionValidator.isDuplicate(subA, subDifferent), false);
  });

  // Test 9: Strict Mode Evaluation
  test('9. Strict Mode Evaluation enforces senior interview bar with caps on partial models', async () => {
    const problem = await problemService.getProblemById('prob_vending_machine');
    assert.ok(problem);

    const partialSubmission: Submission = {
      id: 'sub_partial_strict',
      submissionId: 'sub_partial_strict',
      attemptId: 'att_partial_strict',
      problemId: problem!.id,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      classes: [
        {
          id: 'c1',
          name: 'VendingMachine',
          responsibility: 'Coordinator',
          attributes: ['int balance'],
          methods: ['void insert(int coin)'],
        },
      ],
      relationships: [],
      explanation: 'Basic explanation with single class.',
    };

    const evaluator = new RuleBasedEvaluator();
    const strictEval = await evaluator.evaluate(partialSubmission, problem!, { isStrict: true });
    assert.equal(strictEval.isStrict, true);
    assert.equal(strictEval.evaluationMode, 'STRICT');
    assert.ok(strictEval.overallScore <= 45, 'Incomplete model in strict mode must have score ceiling <= 45');

    const standardEval = await evaluator.evaluate(partialSubmission, problem!, { isStrict: false });
    assert.equal(standardEval.isStrict, false);
    assert.equal(standardEval.evaluationMode, 'STANDARD');
  });
});
