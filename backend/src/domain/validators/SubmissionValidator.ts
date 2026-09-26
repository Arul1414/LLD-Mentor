import { Submission } from '../models/Submission.js';
import { Problem } from '../models/Problem.js';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class SubmissionValidator {
  /**
   * Deterministically validates a learner's submission before it enters the evaluation pipeline.
   * AI is never used for basic structural and requirement validation.
   */
  public static validate(submission: Partial<Submission>, problem?: Problem | null): ValidationResult {
    const errors: string[] = [];

    // 1. Problem existence check
    if (!problem) {
      errors.push('The specified problem does not exist in the system catalog.');
      return { isValid: false, errors };
    }

    // 2. Submission object emptiness check
    if (!submission) {
      errors.push('Submission payload cannot be empty.');
      return { isValid: false, errors };
    }

    // 3. Classes validation
    if (!submission.classes || !Array.isArray(submission.classes) || submission.classes.length === 0) {
      errors.push('Please provide at least one class in your design.');
    } else {
      submission.classes.forEach((c, idx) => {
        const classNum = idx + 1;
        if (!c.name || c.name.trim().length === 0) {
          errors.push(`Class #${classNum} must have a valid name.`);
        }
        if (!c.responsibility || c.responsibility.trim().length === 0) {
          errors.push(`Class "${c.name || '#' + classNum}" must have a defined responsibility.`);
        } else if (c.responsibility.trim().length < 8) {
          errors.push(`Responsibility for class "${c.name || '#' + classNum}" is too brief. Describe its primary purpose.`);
        }
      });
    }

    // 4. Explanation validation
    if (!submission.explanation || submission.explanation.trim().length === 0) {
      errors.push('Please provide a design explanation outlining your architectural decisions and trade-offs.');
    } else if (submission.explanation.trim().length < 25) {
      errors.push('Design explanation is too short. Please explain why these classes exist and your key trade-offs (min 25 characters).');
    }

    // 5. Relationships sanity (if provided, verify source and target)
    if (submission.relationships && Array.isArray(submission.relationships)) {
      submission.relationships.forEach((rel, idx) => {
        if (!rel.sourceClass || !rel.sourceClass.trim()) {
          errors.push(`Relationship #${idx + 1} is missing a source class.`);
        }
        if (!rel.targetClass || !rel.targetClass.trim()) {
          errors.push(`Relationship #${idx + 1} is missing a target class.`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Deterministic duplicate submission detection.
   * Compares the semantic core of two submissions.
   */
  public static isDuplicate(current: Partial<Submission>, previous: Partial<Submission>): boolean {
    if (!previous || !previous.classes) return false;
    
    const currClasses = (current.classes || []).map(c => `${c.name}:${c.responsibility}`).sort().join('|');
    const prevClasses = (previous.classes || []).map(c => `${c.name}:${c.responsibility}`).sort().join('|');

    const currExpl = (current.explanation || '').trim();
    const prevExpl = (previous.explanation || '').trim();

    return currClasses === prevClasses && currExpl === prevExpl;
  }
}
