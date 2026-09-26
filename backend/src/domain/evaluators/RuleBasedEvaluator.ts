import { Evaluator, EvaluatorOptions } from './Evaluator.js';
import { Submission } from '../models/Submission.js';
import { Problem } from '../models/Problem.js';
import { Evaluation, EvaluationCriterionResult } from '../models/Evaluation.js';

export class RuleBasedEvaluator implements Evaluator {
  public readonly id = 'rule-based-evaluator';
  public readonly name = 'Rule-Based Heuristic Evaluator';

  public async evaluate(
    submission: Submission,
    problem: Problem,
    options?: EvaluatorOptions
  ): Promise<Evaluation> {
    const isStrict = options?.isStrict ?? true;
    const classes = submission.classes || [];
    const relationships = submission.relationships || [];
    const explanation = submission.explanation || '';
    const code = submission.optionalCode || '';
    const classNames = classes.map(c => c.name.toLowerCase());
    const allMethods = classes.flatMap(c => c.methods || []).map(m => m.toLowerCase());
    const allAttributes = classes.flatMap(c => c.attributes || []).map(a => a.toLowerCase());
    const totalMethods = classes.reduce((sum, c) => sum + (c.methods?.length || 0), 0);

    const criteria: EvaluationCriterionResult[] = [];

    // 1. Requirement Understanding (Completeness of domain decomposition)
    let reqScore = 5;
    let reqEvidence = `Defined ${classes.length} class${classes.length === 1 ? '' : 'es'}: ${classes.map(c => c.name).join(', ') || 'None'}.`;
    let reqConcern = 'Domain coverage is partial or incomplete.';
    let reqSuggestion = 'Model the full set of collaborating domain entities to satisfy all problem requirements.';

    if (problem.slug.includes('parking')) {
      const hasVehicle = classNames.some(c => c.includes('vehicle') || c.includes('car') || c.includes('truck') || c.includes('bike'));
      const hasSpot = classNames.some(c => c.includes('spot') || c.includes('space') || c.includes('slot'));
      const hasFloor = classNames.some(c => c.includes('floor') || c.includes('level'));
      const hasTicket = classNames.some(c => c.includes('ticket') || c.includes('receipt') || c.includes('session'));
      const hasPricingOrPayment = classNames.some(c => c.includes('price') || c.includes('payment') || c.includes('rate') || c.includes('fee'));

      const domainScoreCount = [hasVehicle, hasSpot, hasFloor, hasTicket, hasPricingOrPayment].filter(Boolean).length;

      if (classes.length < 3) {
        reqScore = 4;
        reqEvidence = `Defined only ${classes.length} classes (${classes.map(c => c.name).join(', ')}). Missing core parking entities: ${[!hasSpot && 'ParkingSpot', !hasVehicle && 'Vehicle', !hasTicket && 'ParkingTicket', !hasPricingOrPayment && 'PricingStrategy'].filter(Boolean).join(', ')}.`;
        reqConcern = 'Severely limited domain scope. A production parking lot requires separate abstractions for spots, vehicles, tickets, and billing.';
        reqSuggestion = 'Expand the design with dedicated ParkingSpot, Vehicle hierarchy, ParkingTicket, and PricingStrategy classes.';
      } else if (domainScoreCount >= 4) {
        reqScore = isStrict ? 8 : 9;
        reqEvidence = `Strong domain coverage across floors, spots, vehicle types, and tickets (${classes.map(c => c.name).join(', ')}).`;
        reqConcern = 'Ensure multithreaded capacity checks are accounted for when parking is at maximum occupancy.';
        reqSuggestion = 'Explicitly define how vehicle sizing dynamically bounds to spot sizing via an enum or strategy.';
      } else if (domainScoreCount >= 2) {
        reqScore = isStrict ? 5 : 6;
        reqEvidence = `Found ${classes.length} classes, but omitted essential entities like ${[!hasTicket && 'ParkingTicket', !hasPricingOrPayment && 'PricingStrategy', !hasSpot && 'ParkingSpot'].filter(Boolean).join(', ')}.`;
        reqConcern = 'Critical domain entities like parking ticket generation or vehicle polymorphism are omitted.';
        reqSuggestion = 'Separate the vehicle types and ticket/invoice lifecycle into dedicated classes.';
      } else {
        reqScore = 4;
        reqEvidence = `Modeled only ${classes.length} classes without spot management or ticketing.`;
        reqConcern = 'Inadequate functional coverage of core parking requirements.';
        reqSuggestion = 'Introduce distinct classes for ParkingFloor, ParkingSpot, and Vehicle.';
      }
    } else if (problem.slug.includes('vending')) {
      const hasItem = classNames.some(c => c.includes('item') || c.includes('product') || c.includes('slot') || c.includes('inventory'));
      const hasState = classNames.some(c => c.includes('state') || c.includes('status') || c.includes('idle') || c.includes('dispens'));
      const hasMoney = classNames.some(c => c.includes('coin') || c.includes('cash') || c.includes('payment') || c.includes('money') || c.includes('balance'));

      if (classes.length < 3) {
        reqScore = 4;
        reqEvidence = `Defined only ${classes.length} classes. Missing critical vending machine entities for product slots, payments, and states.`;
        reqConcern = 'State and inventory management are conflated or missing.';
        reqSuggestion = 'Introduce ProductSlot, Payment, and VendingState classes.';
      } else if (hasItem && hasState && hasMoney) {
        reqScore = isStrict ? 8 : 9;
        reqEvidence = 'Good modeling of hardware interaction with item inventory, money handling, and machine states.';
        reqConcern = 'Handling exact change shortages and transaction rollback under cancellation.';
        reqSuggestion = 'Formalize state transitions (e.g. Ready, HasMoney, Dispensing, SoldOut) using the State pattern.';
      } else {
        reqScore = isStrict ? 5 : 6;
        reqEvidence = `Modeled basic vending flow across ${classes.length} classes, but missing ${[!hasState && 'VendingState', !hasMoney && 'Payment', !hasItem && 'ProductSlot'].filter(Boolean).join(' and ')}.`;
        reqConcern = 'The state machine lifecycle may suffer from nested conditionals without a state pattern.';
        reqSuggestion = 'Introduce an explicit VendingState interface to manage coin insertion, selection, and refund states.';
      }
    } else if (problem.slug.includes('elevator')) {
      const hasCar = classNames.some(c => c.includes('car') || c.includes('elevator') || c.includes('cabin'));
      const hasDispatcher = classNames.some(c => c.includes('dispatch') || c.includes('controller') || c.includes('system') || c.includes('scheduler'));
      const hasRequest = classNames.some(c => c.includes('request') || c.includes('button') || c.includes('call') || c.includes('floor'));
      const hasDoor = classNames.some(c => c.includes('door') || c.includes('gate'));

      if (classes.length < 3) {
        reqScore = 4;
        reqEvidence = `Defined only ${classes.length} classes. Missing elevator controller, request dispatching, or door state models.`;
        reqConcern = 'Cabin physics and request orchestration cannot be cleanly handled in fewer than 3 classes.';
        reqSuggestion = 'Separate the ElevatorSystem, Elevator, Request, and ElevatorController.';
      } else if (hasCar && hasDispatcher && hasRequest) {
        reqScore = isStrict ? 8 : 9;
        reqEvidence = 'Well-decoupled architecture with elevator cabins, dispatch scheduler, and floor request abstractions.';
        reqConcern = 'Starvation of edge floor requests during peak directional travel.';
        reqSuggestion = 'Incorporate SCAN/LOOK or proximity-based scheduling algorithms in the dispatcher.';
      } else {
        reqScore = isStrict ? 5 : 6;
        reqEvidence = `Classes focus on the elevator cabin but lack clear dispatching and request queue separation.`;
        reqConcern = 'Directly coupling request polling inside the elevator cabin violates single-responsibility.';
        reqSuggestion = 'Introduce an ElevatorController or Dispatcher to orchestrate multiple cabins.';
      }
    }

    criteria.push({
      name: 'Requirement Understanding',
      score: reqScore,
      evidence: reqEvidence,
      concern: reqConcern,
      suggestion: reqSuggestion,
      confidence: 0.94,
    });

    // 2. Class Responsibilities (Single Responsibility Principle & God Class Detection)
    let respScore = 5;
    let respEvidence = '';
    let respConcern = '';
    let respSuggestion = '';

    if (classes.length < 3) {
      respScore = isStrict ? 4 : 5;
      respEvidence = `With only ${classes.length} classes, class "${classes[0]?.name || 'Main'}" acts as a God object taking on multiple uncohesive duties.`;
      respConcern = 'Violates Single Responsibility Principle (SRP). A single class manages domain coordination, state tracking, and business logic.';
      respSuggestion = 'Extract distinct sub-responsibilities (e.g. spot assignment, ticket creation, state transitions) into dedicated classes.';
    } else {
      const overloadedClasses = classes.filter(c => {
        const resp = (c.responsibility || '').toLowerCase();
        const hasMultipleAnds = (resp.match(/\band\b/g) || []).length >= 2;
        const methodsCount = (c.methods || []).length;
        return hasMultipleAnds || methodsCount > 5;
      });

      if (overloadedClasses.length > 0) {
        respScore = isStrict ? 5 : 6;
        respEvidence = `Class "${overloadedClasses[0].name}" combines multiple concerns: "${overloadedClasses[0].responsibility}".`;
        respConcern = `"${overloadedClasses[0].name}" risks becoming a god-class by orchestrating domain storage and business computation simultaneously.`;
        respSuggestion = `Refactor "${overloadedClasses[0].name}" by extracting sub-responsibilities into cohesive helper or strategy classes.`;
      } else {
        respScore = isStrict ? 8 : 9;
        respEvidence = `Each class focuses on a single primary responsibility (e.g. ${classes.slice(0, 2).map(c => `${c.name} handles ${(c.responsibility || '').slice(0, 35)}...`).join('; ')}).`;
        respConcern = 'Minimal overlap observed; keep vigilance against leaking presentation or persistence logic.';
        respSuggestion = 'Keep method signatures lean and focused purely on core domain contracts.';
      }
    }

    criteria.push({
      name: 'Class Responsibilities',
      score: respScore,
      evidence: respEvidence,
      concern: respConcern,
      suggestion: respSuggestion,
      confidence: 0.92,
    });

    // 3. Coupling / Cohesion
    let ccScore = 5;
    let ccEvidence = `${relationships.length} explicit relationships defined across ${classes.length} classes.`;
    let ccConcern = '';
    let ccSuggestion = '';

    if (classes.length < 3 || relationships.length === 0) {
      ccScore = isStrict ? 3 : 4;
      ccEvidence = `Only ${relationships.length} relationship declared across ${classes.length} classes.`;
      ccConcern = 'Lacks relational cohesion. Without explicit composition or aggregation links, the architecture does not demonstrate lifecycle ownership.';
      ccSuggestion = 'Model explicit Composition (part-of lifecycle) and Association relationships between domain entities.';
    } else if (relationships.length >= 3) {
      ccScore = isStrict ? 8 : 8;
      ccEvidence = `Clear compositional structure modeled (${relationships.map(r => `${r.sourceClass} ──[${r.relationship}]──> ${r.targetClass}`).slice(0, 3).join(', ')}).`;
      ccConcern = 'Ensure bidirectional navigation is avoided unless strictly necessary.';
      ccSuggestion = 'Enforce unidirectional relationships from controller/manager down to domain entities.';
    } else {
      ccScore = isStrict ? 5 : 6;
      ccEvidence = `${relationships.length} class relationships declared for ${classes.length} classes.`;
      ccConcern = 'Low relational density makes it harder to assess inter-class collaboration and object lifetimes.';
      ccSuggestion = 'Explicitly document aggregation vs composition between container and item entities.';
    }

    criteria.push({
      name: 'Coupling / Cohesion',
      score: ccScore,
      evidence: ccEvidence,
      concern: ccConcern,
      suggestion: ccSuggestion,
      confidence: 0.90,
    });

    // 4. Encapsulation / Interfaces
    let encScore = 5;
    let encEvidence = 'Domain attributes and accessors declared across classes.';
    let encConcern = 'Direct public field exposure can compromise internal invariants.';
    let encSuggestion = 'Ensure fields are marked private and state mutations occur solely through behavioral domain methods.';

    const privateIndications = classes.some(c => (c.attributes || []).some(a => a.toLowerCase().includes('private') || a.startsWith('-')));
    const allAttributesHaveVisibility = classes.every(c => (c.attributes || []).every(a => a.includes('private') || a.includes('protected') || a.startsWith('-') || a.startsWith('#')));

    if (classes.length < 3 || totalMethods < 2) {
      encScore = isStrict ? 4 : 5;
      encEvidence = `Classes define few behavioral methods (${totalMethods} total methods across ${classes.length} classes).`;
      encConcern = 'Anemic domain model: classes behave like data structures rather than encapsulated entities with behavior.';
      encSuggestion = 'Add public behavioral methods that enforce state validation instead of relying on getter/setter access.';
    } else if (privateIndications && (allAttributesHaveVisibility || code.includes('private'))) {
      encScore = isStrict ? 8 : 9;
      encEvidence = 'Encapsulation conventions used with private state access and public behavioral methods.';
      encConcern = 'Ensure getters do not leak mutable internal collections (e.g. returning unmodifiable lists).';
      encSuggestion = 'Return immutable views or defensive copies when exposing collection attributes.';
    } else {
      encScore = isStrict ? 5 : 6;
      encEvidence = `Classes define attributes such as: ${allAttributes.slice(0, 4).join(', ') || 'implicit fields'}.`;
      encConcern = 'Encapsulation level not explicitly demonstrated in all class models.';
      encSuggestion = 'Explicitly denote access modifiers (- for private, + for public) and guard against public setters.';
    }

    criteria.push({
      name: 'Encapsulation / Interfaces',
      score: encScore,
      evidence: encEvidence,
      concern: encConcern,
      suggestion: encSuggestion,
      confidence: 0.91,
    });

    // 5. Abstraction / Design Patterns
    let patScore = 4;
    let patEvidence = 'Found foundational OO structures in the submission.';
    let patConcern = 'Potential procedural flow disguised as classes if pattern abstractions are missing.';
    let patSuggestion = 'Identify opportunities for Strategy, Factory, or State patterns.';

    const combinedText = `${explanation} ${code} ${classes.map(c => c.name + ' ' + c.responsibility).join(' ')}`.toLowerCase();
    const detectedPatterns: string[] = [];
    if (combinedText.includes('factory')) detectedPatterns.push('Factory Pattern');
    if (combinedText.includes('strategy')) detectedPatterns.push('Strategy Pattern');
    if (combinedText.includes('singleton')) detectedPatterns.push('Singleton Pattern');
    if (combinedText.includes('state')) detectedPatterns.push('State Pattern');
    if (combinedText.includes('observer') || combinedText.includes('listener')) detectedPatterns.push('Observer Pattern');
    if (combinedText.includes('command')) detectedPatterns.push('Command Pattern');

    if (classes.length < 3) {
      patScore = isStrict ? 3 : 4;
      patEvidence = 'No design pattern abstractions implemented in this minimal class structure.';
      patConcern = 'Lacks polymorphic decoupling. Dynamic policies (pricing, dispensing, dispatching) cannot be varied independently.';
      patSuggestion = 'Apply the Strategy or State pattern to decouple dynamic business policies from entity storage.';
    } else if (detectedPatterns.length > 0) {
      patScore = isStrict ? 8 : 9;
      patEvidence = `Applied patterns recognized in architecture: ${detectedPatterns.join(', ')}.`;
      patConcern = 'Beware of over-engineering patterns where simple polymorphism or function delegates suffice.';
      patSuggestion = 'Document the trade-off of introducing these patterns versus simpler static alternatives.';
    } else {
      patScore = isStrict ? 4 : 5;
      patEvidence = 'Design relies primarily on direct inheritance or concrete classes without pattern abstractions.';
      patConcern = 'Hardcoded instantiation reduces testability and makes behavior swapping inflexible.';
      patSuggestion = 'Consider applying Strategy pattern for algorithmic policies (e.g. parking fee calculation or elevator dispatching).';
    }

    criteria.push({
      name: 'Abstraction / Design Patterns',
      score: patScore,
      evidence: patEvidence,
      concern: patConcern,
      suggestion: patSuggestion,
      confidence: 0.89,
    });

    // 6. Extensibility (Open-Closed Principle)
    let extScore = 4;
    let extEvidence = `System supports base operations with classes: ${classes.map(c => c.name).slice(0, 3).join(', ')}.`;
    let extConcern = 'Adding new types requires modifying existing classes (violating OCP).';
    let extSuggestion = 'Ensure new variant types can be plugged in by implementing existing base interfaces without altering orchestrators.';

    if (classes.length < 3) {
      extScore = isStrict ? 3 : 4;
      extEvidence = `Only ${classes.length} classes defined; cannot accommodate new requirements without extensive modifications.`;
      extConcern = 'Rigid architecture: adding new vehicle types or payment methods requires modifying existing classes directly.';
      extSuggestion = 'Introduce interfaces and polymorphic abstractions to make the design open for extension.';
    } else if (combinedText.includes('open-closed') || combinedText.includes('interface') || combinedText.includes('abstract') || detectedPatterns.length > 0) {
      extScore = isStrict ? 7 : 8;
      extEvidence = 'Architecture incorporates interfaces or pattern abstractions supporting extension.';
      extConcern = 'Extension points should be documented so third-party integrations do not break invariants.';
      extSuggestion = 'Provide default baseline implementations for interfaces to ease extension.';
    } else {
      extScore = isStrict ? 5 : 6;
      extEvidence = `Classes rely on concrete implementations without explicit interfaces.`;
      extConcern = 'Adding new domain variants will require modifying core logic.';
      extSuggestion = 'Extract common interfaces for polymorphic entities.';
    }

    criteria.push({
      name: 'Extensibility',
      score: extScore,
      evidence: extEvidence,
      concern: extConcern,
      suggestion: extSuggestion,
      confidence: 0.88,
    });

    // 7. Edge Cases / Testability (Concurrency, Locks, Error Recovery)
    let testScore = 4;
    let testEvidence = `Methods declared: ${allMethods.slice(0, 4).join(', ') || 'No explicit method signatures'}.`;
    let testConcern = 'Edge cases (full capacity, payment timeout, hardware failure, concurrency) are unaddressed.';
    let testSuggestion = 'Specify exception handling, custom Result types, or status enums to handle edge conditions.';

    const hasConcurrencyMention = combinedText.includes('concurrency') ||
      combinedText.includes('synchronized') ||
      combinedText.includes('lock') ||
      combinedText.includes('atomic') ||
      combinedText.includes('thread') ||
      combinedText.includes('race condition');

    if (classes.length < 3) {
      testScore = isStrict ? 3 : 4;
      testEvidence = 'No concurrency protection, capacity limits, or error recovery modeled.';
      testConcern = 'High concurrency failure risk: simultaneous requests will cause race conditions and corrupted state.';
      testSuggestion = 'Incorporate thread-safe locking primitives (ReentrantLock, AtomicInteger, synchronized methods).';
    } else if (hasConcurrencyMention) {
      testScore = isStrict ? 7 : 8;
      testEvidence = 'Consideration of concurrent access, capacity exhaustion, or thread synchronization documented.';
      testConcern = 'Ensure race conditions during simultaneous bookings/dispatches are protected via atomic operations.';
      testSuggestion = 'Structure unit tests to simulate concurrent requests using mock drivers.';
    } else {
      testScore = isStrict ? 4 : 5;
      testEvidence = 'No concurrency guards or race-condition handling specified.';
      testConcern = 'In concurrent environments (e.g. multiple gates or floor buttons), state will become inconsistent without locks.';
      testSuggestion = 'Explicitly define synchronization mechanisms in method contracts or explanation.';
    }

    criteria.push({
      name: 'Edge Cases / Testability',
      score: testScore,
      evidence: testEvidence,
      concern: testConcern,
      suggestion: testSuggestion,
      confidence: 0.90,
    });

    // 8. Explanation Quality (Trade-offs & Architectural Reasoning)
    let expScore = 4;
    const safeExp = explanation || '';
    let expEvidence = `Explanation provided (${safeExp.length} characters): "${safeExp.slice(0, 80)}..."`;
    let expConcern = 'Surface-level explanation without explicit architectural justification.';
    let expSuggestion = 'Elaborate on why certain design patterns or relationship choices were picked over alternatives.';

    if (safeExp.length > 500 && (safeExp.toLowerCase().includes('trade-off') || safeExp.toLowerCase().includes('assumption') || safeExp.toLowerCase().includes('alternative'))) {
      expScore = isStrict ? 8 : 9;
      expEvidence = `Thorough architectural rationale (${safeExp.length} characters) detailing design decisions, assumptions, and trade-offs.`;
      expConcern = 'Keep trade-off explanations grounded in practical latency and memory implications.';
      expSuggestion = 'Structure future writeups into explicit sections: Assumptions, Trade-offs, and Alternative Rejected Designs.';
    } else if (safeExp.length > 250) {
      expScore = isStrict ? 6 : 7;
      expEvidence = `Clear rationale provided (${safeExp.length} characters).`;
      expConcern = 'Could benefit from deeper analysis of alternative design choices.';
      expSuggestion = 'Include an explicit section explaining which design alternatives were rejected and why.';
    } else if (safeExp.length > 50) {
      expScore = isStrict ? 4 : 5;
      expEvidence = `Brief rationale provided (${safeExp.length} characters).`;
      expConcern = 'Too concise for a senior interview evaluation; lacks deep justification.';
      expSuggestion = 'Expand on assumptions, concurrency guards, and performance trade-offs.';
    } else {
      expScore = 3;
      expEvidence = 'Minimal or missing design explanation.';
      expConcern = 'Architectural decisions are undocumented.';
      expSuggestion = 'Complete all 5 explanation sections in the Explanation tab.';
    }

    criteria.push({
      name: 'Explanation Quality',
      score: expScore,
      evidence: expEvidence,
      concern: expConcern,
      suggestion: expSuggestion,
      confidence: 0.95,
    });

    // Calculate overall score (weighted average scaled to 100 with strict cap for incomplete submissions)
    const totalRaw = criteria.reduce((sum, c) => sum + c.score, 0);
    let overallScore = Math.round((totalRaw / (criteria.length * 10)) * 100);

    // Hard ceiling for incomplete designs in strict mode
    if (isStrict) {
      if (classes.length < 3) {
        overallScore = Math.min(overallScore, 45);
      } else if (classes.length < 4) {
        overallScore = Math.min(overallScore, 62);
      }
    }

    const strengths: string[] = [];
    const priorityImprovements: string[] = [];

    if (reqScore >= 7) strengths.push('Identified primary domain boundaries for core functional scenarios.');
    if (respScore >= 7) strengths.push('Avoided monolithic god-classes with appropriate responsibility separation.');
    if (patScore >= 7) strengths.push('Applied design patterns to decouple policy from execution.');
    if (expScore >= 7) strengths.push('Articulate design explanation with thoughtful justification of trade-offs.');
    if (strengths.length === 0) {
      strengths.push(`Initiated initial model breakdown with ${classes.length} class${classes.length === 1 ? '' : 'es'}.`);
    }

    if (classes.length < 4) {
      priorityImprovements.push(`Model additional core domain classes (currently only ${classes.length} class${classes.length === 1 ? '' : 'es'} provided).`);
    }
    if (testScore <= 6) priorityImprovements.push('Specify concurrency safety (locks/atomics) and capacity edge-case handling.');
    if (patScore <= 6) priorityImprovements.push('Introduce behavioral patterns (Strategy/State) to avoid rigid conditional branching.');
    if (encScore <= 6) priorityImprovements.push('Strictly enforce encapsulation by locking attributes behind private access and domain methods.');
    if (priorityImprovements.length === 0) priorityImprovements.push('Consider evaluating system behavior under extreme concurrent peak loads.');

    let nextPracticeSuggestion = '';
    if (problem.slug.includes('parking')) {
      nextPracticeSuggestion = 'Continue with another LLD problem such as Vending Machine to practice state-based design.';
    } else if (problem.slug.includes('vending')) {
      nextPracticeSuggestion = 'Continue with another LLD problem such as Elevator System to practice complex dispatch scheduling and concurrency.';
    } else {
      nextPracticeSuggestion = 'Continue with another LLD problem such as Parking Lot to practice extensible capacity and pricing strategies.';
    }

    return {
      id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      submissionId: submission.id,
      attemptId: submission.attemptId,
      problemId: problem.id,
      overallScore,
      evaluatorType: 'RULE_BASED',
      criteria,
      strengths,
      priorityImprovements,
      nextPracticeSuggestion,
      evaluatedAt: new Date().toISOString(),
      isStrict,
      evaluationMode: isStrict ? 'STRICT' : 'STANDARD',
    };
  }
}
