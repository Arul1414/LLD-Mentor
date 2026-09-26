import { Evaluator } from './Evaluator.js';
import { RuleBasedEvaluator } from './RuleBasedEvaluator.js';
import { AIEvaluator } from './AIEvaluator.js';

export type EvaluatorStrategy = 'AI' | 'RULE_BASED' | 'AUTO';

export class EvaluatorFactory {
  private static ruleBasedEvaluator = new RuleBasedEvaluator();
  private static aiEvaluator = new AIEvaluator();

  /**
   * Factory method to obtain an Evaluator implementation.
   * If strategy is 'AUTO', chooses AI if GEMINI_API_KEY is present, else RULE_BASED.
   */
  public static getEvaluator(strategy: EvaluatorStrategy = 'AUTO'): Evaluator {
    if (strategy === 'RULE_BASED') {
      return this.ruleBasedEvaluator;
    }
    if (strategy === 'AI') {
      return this.aiEvaluator;
    }
    // AUTO selection
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 0) {
      return this.aiEvaluator;
    }
    return this.ruleBasedEvaluator;
  }
}
