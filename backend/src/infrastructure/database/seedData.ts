import { Problem } from '../../domain/models/Problem.js';
import { User } from '../../domain/models/User.js';
import { Attempt } from '../../domain/models/Attempt.js';
import { Submission } from '../../domain/models/Submission.js';
import { Evaluation } from '../../domain/models/Evaluation.js';

export const SEED_USERS: User[] = [
  {
    id: 'user_default',
    userId: 'user_default',
    name: 'Alex Rivera (Staff Candidate)',
    email: 'alex.rivera@example.com',
    role: 'LEARNER',
    createdAt: '2026-03-01T10:00:00.000Z',
  },
];

export const SEED_PROBLEMS: Problem[] = [
  {
    id: 'prob_parking_lot',
    slug: 'parking-lot',
    title: 'Parking Lot',
    difficulty: 'MEDIUM',
    shortDescription: 'Design an automated multi-floor parking lot system supporting diverse vehicle types, dynamic spot allocation, and fee calculation.',
    description: `A commercial shopping mall requires a robust, automated multi-level parking lot system.
The system is responsible for managing multiple entry and exit gates, tracking real-time parking spot availability across multiple floors, assigning optimal parking spots based on vehicle dimensions, issuing automated timestamped tickets, and calculating exit fees based on parking duration and dynamic pricing strategies.

Your design should emphasize clean object-oriented decomposition, proper separation of concerns between payment policies and spot assignment strategies, and support for high concurrent access.`,
    functionalRequirements: [
      'Multi-floor facility with designated spots for Motorcycles, Compact Cars, Large Vehicles (SUVs/Vans), and Electric Vehicles (EV).',
      'Entry Gate issues a ticket containing a unique ID, vehicle license, assigned spot, and entry timestamp.',
      'Dynamic spot assignment strategy (e.g. nearest spot to entry gate, lowest floor first).',
      'Exit Gate validates the ticket, calculates the total fee based on vehicle type and duration, and accepts payment.',
      'Real-time status display boards at each floor entrance showing available spots per vehicle category.',
      'Support for multiple entry and exit gates operating concurrently.',
    ],
    constraints: [
      'Motorcycles can park in any spot; Compact cars can park in Compact or Large spots; Large vehicles can ONLY park in Large spots.',
      'EVs require spots equipped with an active charging terminal.',
      'The system operates in-memory for fast gate response time (< 50ms per vehicle ticket issuance).',
      'System must avoid double-booking spots when two vehicles enter simultaneously.',
    ],
    assumptions: [
      'Standard hourly pricing with a minimum flat base fee for the first hour.',
      'License plate recognition (ANPR) hardware sends events to the system controller.',
      'Single physical parking spot cannot be split between two smaller vehicles.',
    ],
    expectedDesignAreas: [
      'Vehicle & ParkingSpot inheritance/composition hierarchy',
      'ParkingLot singleton or controller orchestration',
      'ParkingStrategy interface (e.g. NearestFirstStrategy, FarthestStrategy)',
      'PricingStrategy / FeeCalculationStrategy (e.g. FlatRate, HourlyRate, VehicleTierRate)',
      'Ticket and Payment lifecycle management',
      'Concurrency control on spot state (Available, Reserved, Occupied)',
    ],
    suggestedPatterns: ['Strategy Pattern', 'Factory Pattern', 'Observer Pattern', 'Singleton Pattern'],
    createdAt: '2026-01-15T08:00:00.000Z',
  },
  {
    id: 'prob_vending_machine',
    slug: 'vending-machine',
    title: 'Vending Machine',
    difficulty: 'EASY',
    shortDescription: 'Design a state-driven vending machine that handles product selection, coin/cash transactions, inventory dispensing, and refunds.',
    description: `A smart office snack and beverage vending machine needs a reliable software architecture to govern its physical hardware interactions.
The machine maintains an inventory of items (e.g., drinks, snacks, sandwiches) across multiple shelves/racks. Users can inspect item availability and prices, insert cash/coins, select an item code, receive the dispensed product, and collect their remaining change.

The machine must strictly prevent invalid operations (e.g., dispensing without payment, accepting orders when an item is out of stock, or keeping money upon cancellation). Your design should represent the machine's operational lifecycle clearly.`,
    functionalRequirements: [
      'Inventory management: Add, inspect, and dispense items organized by rack/shelf codes (e.g., A1, B3).',
      'Payment acceptance: Accept multiple coin and note denominations (e.g. $1, $2, $5, $10) and maintain an internal change bank.',
      'Product selection: Allow user to select a product and validate if sufficient funds were inserted and if the item is in stock.',
      'Dispense cycle: Dispense selected product and return remaining change.',
      'Cancellation & Refund: Allow user to cancel transaction at any point before dispensing and receive a full cash refund.',
      'Maintenance mode: Allow authorized technicians to restock items and replenish change reserves.',
    ],
    constraints: [
      'Transactions must be atomic: either product is dispensed and change returned, or full money is refunded on mechanical failure.',
      'If the machine cannot return exact change, it must warn the user before transaction confirmation.',
      'Physical item count per rack cannot exceed rack capacity.',
    ],
    assumptions: [
      'Fixed currency denominations.',
      'Sensors trigger events when a product drops into the delivery chute.',
    ],
    expectedDesignAreas: [
      'State Pattern for machine lifecycle (IdleState, HasMoneyState, DispensingState, SoldOutState)',
      'Inventory & Rack management entities',
      'Coin/Cash Bank and Change Calculation algorithm (Greedy/Coin Change)',
      'Item and ItemSlot modeling',
      'VendingMachine facade orchestrating state transitions',
    ],
    suggestedPatterns: ['State Pattern', 'Strategy Pattern', 'Command Pattern', 'Facade Pattern'],
    createdAt: '2026-01-16T08:00:00.000Z',
  },
  {
    id: 'prob_elevator_system',
    slug: 'elevator-system',
    title: 'Elevator System',
    difficulty: 'HARD',
    shortDescription: 'Design a multi-car elevator control system for a high-rise building with smart dispatching, scheduling algorithms, and safety rules.',
    description: `A 50-story commercial tower requires an elevator dispatch and control system managing a bank of 4 elevator cars.
Passengers can submit external hall calls (requesting an elevator going UP or DOWN from a floor) as well as internal car calls (selecting destination floors inside an elevator).

The elevator system must optimize for minimal average passenger wait times, minimize energy consumption (total floor travels), prevent passenger starvation, enforce weight/capacity limits, and support emergency overrides (fire alarm, power outage).`,
    functionalRequirements: [
      'Manage multiple elevator cars operating simultaneously in a building with N floors.',
      'Process external hall calls (source floor + desired direction) from floor panels.',
      'Process internal car calls (destination floor) from cabin button panels.',
      'Dispatching algorithm assigns optimal elevator car to each external request based on current positions, directions, and queue depths.',
      'Door operations: Open, close, hold, and safety obstruction sensor handling.',
      'Emergency handling: Move all cars to ground floor and park in fire mode.',
    ],
    constraints: [
      'Cars have maximum passenger capacity and weight thresholds.',
      'Cars move one floor at a time at a constant velocity with acceleration/deceleration curves.',
      'No passenger call should be starved indefinitely during peak traffic.',
    ],
    assumptions: [
      'Building has 50 floors (Floors 1 to 50) and 4 elevator cars.',
      'Requests arrive concurrently from multiple floor panels and car panels.',
    ],
    expectedDesignAreas: [
      'ElevatorCar modeling (state: IDLE, MOVING_UP, MOVING_DOWN; doors: OPEN, CLOSED)',
      'ElevatorController / Dispatcher coordinating the fleet of cars',
      'ElevatorSchedulingStrategy (e.g. SCAN/LOOK algorithm, Shortest Seek Time, Proximity Heuristic)',
      'Request & Call representations (HallCall, CarCall, Direction enum)',
      'Safety and sensor interfaces',
    ],
    suggestedPatterns: ['Strategy Pattern', 'Observer Pattern', 'State Pattern', 'Command Pattern'],
    createdAt: '2026-01-17T08:00:00.000Z',
  },
];

// Seed 1 completed sample attempt and evaluation for immediate demonstration
export const SEED_ATTEMPTS: Attempt[] = [
  {
    id: 'att_demo_01',
    attemptId: 'att_demo_01',
    userId: 'user_default',
    problemId: 'prob_parking_lot',
    submissionId: 'sub_demo_01',
    attemptNumber: 1,
    status: 'COMPLETED',
    score: 84,
    createdAt: '2026-03-20T14:30:00.000Z',
    completedAt: '2026-03-20T14:32:15.000Z',
  },
];

export const SEED_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_demo_01',
    submissionId: 'sub_demo_01',
    attemptId: 'att_demo_01',
    problemId: 'prob_parking_lot',
    status: 'COMPLETED',
    createdAt: '2026-03-20T14:31:00.000Z',
    updatedAt: '2026-03-20T14:32:00.000Z',
    classes: [
      {
        id: 'cls_1',
        name: 'ParkingLot',
        responsibility: 'Acts as the central facade orchestrating floors, entry/exit gates, and global capacity limits.',
        attributes: [
          'private String name',
          'private List<ParkingFloor> floors',
          'private List<EntryGate> entryGates',
          'private List<ExitGate> exitGates',
          'private ParkingStrategy parkingStrategy',
        ],
        methods: [
          'public ParkingSpot findSpot(Vehicle vehicle)',
          'public Ticket issueTicket(Vehicle vehicle, EntryGate gate)',
          'public double processExit(Ticket ticket, PaymentStrategy payment)',
          'public boolean isFull()',
        ],
      },
      {
        id: 'cls_2',
        name: 'ParkingSpot',
        responsibility: 'Represents a physical parking slot with spot type, floor association, and occupancy state.',
        attributes: [
          'private String spotId',
          'private int floorNumber',
          'private SpotType spotType',
          'private boolean isOccupied',
          'private Vehicle currentVehicle',
        ],
        methods: [
          'public synchronized boolean assignVehicle(Vehicle vehicle)',
          'public synchronized void vacate()',
          'public boolean isAvailable()',
          'public boolean canFitVehicle(Vehicle vehicle)',
        ],
      },
      {
        id: 'cls_3',
        name: 'Vehicle',
        responsibility: 'Abstract base domain model encapsulating vehicle identity and physical sizing classification.',
        attributes: [
          'private String licenseNumber',
          'private VehicleType vehicleType',
        ],
        methods: [
          'public VehicleType getType()',
          'public String getLicensePlate()',
        ],
      },
      {
        id: 'cls_4',
        name: 'Ticket',
        responsibility: 'Represents an active parking session voucher linking vehicle, spot, and entry timestamp.',
        attributes: [
          'private String ticketId',
          'private Instant entryTime',
          'private Instant exitTime',
          'private Vehicle vehicle',
          'private ParkingSpot allocatedSpot',
          'private TicketStatus status',
        ],
        methods: [
          'public void closeTicket(Instant exitTime)',
          'public Duration calculateDuration()',
        ],
      },
      {
        id: 'cls_5',
        name: 'FeeCalculationStrategy',
        responsibility: 'Strategy interface computing the monetary balance owed based on duration and vehicle tier.',
        attributes: [],
        methods: [
          'public double calculateFee(Ticket ticket, VehicleType type)',
        ],
      },
      {
        id: 'cls_6',
        name: 'ParkingStrategy',
        responsibility: 'Interface decoupling spot selection logic (e.g. LowestFloorFirst, NearestGateFirst) from ParkingLot facade.',
        attributes: [],
        methods: [
          'public ParkingSpot findSpot(List<ParkingFloor> floors, Vehicle vehicle)',
        ],
      },
    ],
    relationships: [
      {
        id: 'rel_1',
        sourceClass: 'ParkingLot',
        targetClass: 'ParkingFloor',
        relationship: 'COMPOSITION',
        reason: 'Parking lot owns and manages the lifecycle of parking floors.',
      },
      {
        id: 'rel_2',
        sourceClass: 'ParkingFloor',
        targetClass: 'ParkingSpot',
        relationship: 'COMPOSITION',
        reason: 'A floor comprises multiple categorized parking spots.',
      },
      {
        id: 'rel_3',
        sourceClass: 'ParkingLot',
        targetClass: 'ParkingStrategy',
        relationship: 'AGGREGATION',
        reason: 'ParkingLot delegates spot allocation algorithm via Strategy pattern.',
      },
      {
        id: 'rel_4',
        sourceClass: 'ExitGate',
        targetClass: 'FeeCalculationStrategy',
        relationship: 'DEPENDENCY',
        reason: 'Exit gate calculates final fee using pluggable pricing rules.',
      },
      {
        id: 'rel_5',
        sourceClass: 'Ticket',
        targetClass: 'ParkingSpot',
        relationship: 'ASSOCIATION',
        reason: 'Ticket references the assigned parking spot for validation upon exit.',
      },
    ],
    explanation: `Architectural Decisions and Trade-offs:
1. Separation of Allocation & Pricing:
We decoupled spot discovery (ParkingStrategy) and pricing rules (FeeCalculationStrategy) using the Strategy Pattern. This ensures that changing mall rate policies (e.g., holiday surge pricing) or adding VIP parking algorithms does not require modifying the ParkingLot controller.

2. Concurrency Safety:
ParkingSpot.assignVehicle() uses synchronized locking / atomic test-and-set semantics to prevent race conditions when two gates attempt to allocate the same vacant spot simultaneously.

3. Single Responsibility:
ParkingLot acts as an orchestrator/facade rather than directly tracking individual spot bits. Floors manage their own sub-inventories to enable per-floor display boards without querying global state.

4. Trade-off:
In-memory synchronization allows sub-millisecond gate responses, but in a distributed physical multi-gate deployment, spot state would be backed by a centralized cache with distributed locks (e.g. Redis). For this LLD prototype, we encapsulate this behind the spot state machine.`,
    optionalCode: `// Java-like implementation excerpt:
public class ParkingSpot {
    private final String id;
    private final SpotType spotType;
    private volatile boolean occupied;
    private Vehicle currentVehicle;

    public synchronized boolean assignVehicle(Vehicle vehicle) {
        if (occupied || !canFitVehicle(vehicle)) {
            return false;
        }
        this.currentVehicle = vehicle;
        this.occupied = true;
        return true;
    }

    public synchronized void vacate() {
        this.occupied = false;
        this.currentVehicle = null;
    }
}`,
  },
];

export const SEED_EVALUATIONS: Evaluation[] = [
  {
    id: 'eval_demo_01',
    submissionId: 'sub_demo_01',
    attemptId: 'att_demo_01',
    problemId: 'prob_parking_lot',
    overallScore: 84,
    evaluatorType: 'RULE_BASED',
    criteria: [
      {
        name: 'Requirement Understanding',
        score: 9,
        evidence: 'Identified core domain entities: vehicle modeling (Vehicle), spot allocation (ParkingSpot, ParkingFloor), and ticketing/payment (Ticket, FeeCalculationStrategy).',
        concern: 'Ensure multithreaded capacity checks are accounted for when parking is at max capacity.',
        suggestion: 'Explicitly define how vehicle sizing dynamically bounds to spot sizing via an enum or strategy.',
        confidence: 0.94,
      },
      {
        name: 'Class Responsibilities',
        score: 9,
        evidence: 'Each class focuses on a single primary responsibility (ParkingLot as facade, ParkingSpot managing spot state, Ticket handling session voucher).',
        concern: 'Minimal overlap observed; keep vigilance against leaking payment gateway details into ExitGate.',
        suggestion: 'Keep method signatures lean and focused purely on core domain contracts.',
        confidence: 0.92,
      },
      {
        name: 'Coupling / Cohesion',
        score: 8,
        evidence: 'Clear compositional structure modeled (ParkingLot -> ParkingFloor -> ParkingSpot). High cohesion within individual entities.',
        concern: 'Ensure bidirectional navigation between Ticket and ParkingSpot is properly bounded.',
        suggestion: 'Store spot ID rather than direct object reference on Ticket if distributed persistence is introduced.',
        confidence: 0.90,
      },
      {
        name: 'Encapsulation / Interfaces',
        score: 9,
        evidence: 'Encapsulation conventions used with private state access and synchronized public behavioral methods.',
        concern: 'Ensure collections returned by ParkingLot (e.g. getFloors) are unmodifiable.',
        suggestion: 'Wrap internal lists with Collections.unmodifiableList() to prevent external state tampering.',
        confidence: 0.91,
      },
      {
        name: 'Abstraction / Design Patterns',
        score: 9,
        evidence: 'Applied patterns recognized in architecture: Strategy Pattern (ParkingStrategy, FeeCalculationStrategy) and Facade Pattern (ParkingLot).',
        concern: 'Beware of over-engineering patterns where simple polymorphism suffices.',
        suggestion: 'Document the trade-off of introducing these patterns versus simpler static alternatives.',
        confidence: 0.90,
      },
      {
        name: 'Extensibility',
        score: 8,
        evidence: 'Architecture explicitly considers open-closed principle through pluggable ParkingStrategy and FeeCalculationStrategy.',
        concern: 'Extension points should be documented so third-party integrations do not break invariants.',
        suggestion: 'Provide default baseline implementations for interfaces to ease extension.',
        confidence: 0.88,
      },
      {
        name: 'Edge Cases / Testability',
        score: 7,
        evidence: 'Addressed concurrent spot allocation using synchronized methods and volatile state flags.',
        concern: 'Missing explicit handling for lost tickets or gate scanner hardware timeouts.',
        suggestion: 'Introduce a LostTicketStrategy that assesses a flat penalty fee.',
        confidence: 0.86,
      },
      {
        name: 'Explanation Quality',
        score: 9,
        evidence: 'Thorough architectural rationale (842 characters) detailing design decisions, assumptions, and trade-offs.',
        concern: 'Keep trade-off explanations grounded in practical latency and memory implications.',
        suggestion: 'Structure future writeups into explicit sections: Assumptions, Trade-offs, and Alternative Rejected Designs.',
        confidence: 0.95,
      },
    ],
    strengths: [
      'Strong domain boundary identification and mapping to core requirements.',
      'High cohesion with clear single responsibilities assigned to individual classes.',
      'Smart application of design patterns (Strategy & Facade) to decouple policy from execution.',
      'Articulate design explanation with thoughtful justification of trade-offs.',
    ],
    priorityImprovements: [
      'Specify edge-case workflows for lost tickets and hardware gate failures.',
      'Return immutable collections when querying floor and spot inventories to strengthen encapsulation.',
    ],
    nextPracticeSuggestion: 'Try the Vending Machine problem next to practice modeling dynamic lifecycle transitions using the State Pattern!',
    evaluatedAt: '2026-03-20T14:32:15.000Z',
  },
];
